import Exemption from '../models/models.forms/exemption.model.js';
import Profile from '../models/models.user/profile.model.js';
import  mailTransporter from "../utils/config/mailTransporter.js";
import { approveExemptionTemplate } from '../utils/emailTemplates/exemptionApproveTemplate.js';
import { denyExemptionTemplate } from '../utils/emailTemplates/exemptionDenyTemplate.js';

export const submitExemption = async (req, res) => {
  const { userId, waterSource, othersSurveyNumber, farmDetails, isOwner,date_of_well } = req.body;

  try {
    // Fetch user's profile data
    const userProfile = await Profile.findById(userId);
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Check if there's an existing exemption within the last month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const recentExemption = await Exemption.findOne({
      profile_id: userProfile._id,
      createdAt: { $gte: oneMonthAgo },
    });

    if (recentExemption) {
      return res.status(400).json({
        message: 'You have already submitted an exemption application within the last month. Please try again later.',
      });
    }

    // Generate exemption ID
    const exemptionId = `exmp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newExemption = new Exemption({
      exemption_id: exemptionId,
      profile_id: userProfile._id,
      isOwnWell: waterSource === 'ownWell',
      othersSurveyNumber: waterSource === 'othersWell' ? othersSurveyNumber : null,
      date_of_well,
      isOwner,
      farmDetails,
    });
    // Save to DB
    await newExemption.save();

    return res.status(201).json({
      message: 'Exemption application submitted successfully',
      data: newExemption,
    });
  } catch (error) {
    console.error('Error submitting exemption:', error);
    return res.status(500).json({ message: 'An error occurred while submitting the exemption' });
  }
};

// Controller to get exemptions by userId
export const getExemptionsByUserId = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Find exemptions related to the userId by filtering with profile_id
      const exemptions = await Exemption.find({ profile_id: userId });
  
      if (exemptions.length === 0) {
        return res.status(200).json([]);
      }
  
      // Helper function to format a date or return "-" if invalid
      const formatDate = (date) => {
        if (!date) return "-";
        const formattedDate = new Date(date);
        if (isNaN(formattedDate.getTime())) return "-";
        return formattedDate.toLocaleDateString();
      };
  
      // Format each exemption
      const formattedExemptions = exemptions.map((exemption) => {
        const isApproved = exemption.isApprovedbyTalati;
        const isDenied = exemption.isDenied;
  
        return {
          ...exemption.toObject(),
          date_of_well: formatDate(exemption.date_of_well),
          submitDate: formatDate(exemption.createdAt),
          approvedDate: isApproved ? formatDate(exemption.updatedAt) : "-",
          status: isApproved ? "Approved" : isDenied ? "Denied" : "Pending",
        };
      });
  
      res.json(formattedExemptions);
    } catch (error) {
      console.error("Error fetching exemptions:", error);
      res.status(500).json({ message: "Server error while fetching exemptions" });
    }
  };
  
  
  
  export const getAllExemptions = async (req, res) => {
    try {
      const exemptions = await Exemption.find()
        .populate({
          path: "profile_id",
          populate: {
            path: "user_id",
            select: "firstName middleName lastName",
          },
        });
  
      res.status(200).json(exemptions);
    } catch (error) {
      console.error("Error fetching exemptions:", error);
      res.status(500).json({ message: "Failed to fetch exemption applications" });
    }
  };
  
  export const getExemptionById = async (req, res) => {
    try {
      const { exemption_id } = req.params;
  
      // Use findOne with exemption_id field instead of findById
      const exemption = await Exemption.findOne({ exemption_id })
        .populate({
          path: "profile_id",
          populate: {
            path: "user_id",
          },
        });
  
      if (!exemption) {
        return res.status(404).json({ message: "Exemption not found" });
      }
  
      res.status(200).json(exemption);
    } catch (error) {
      console.error("Error fetching exemption:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  export const approveExemption = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Fetch the exemption document by exemption_id
      const exemption = await Exemption.findOne({ exemption_id: id })
        .populate({
          path: "profile_id",
          populate: {
            path: "user_id",
          },
        });
  
      if (!exemption) {
        return res.status(404).json({ message: "Exemption not found" });
      }
  
      // Update exemption status
      exemption.isApprovedbyTalati = true;
      exemption.isDeniedbyTalati = false;
      exemption.isPending = false; // ✅
      exemption.isApprovedbyTalatiAt = new Date();  // Set approval timestamp
      exemption.isDeniedbyTalatiAt = null; // Reset denial timestamp if it's approved
      
  
      // Save the updated exemption status
      const updatedExemption = await exemption.save();
  
      // Get the user's email
      const userEmail = exemption?.profile_id?.user_id?.email;
  
      if (userEmail) {
        // Send HTML email
        const emailContent = approveExemptionTemplate(exemption.exemption_id);  // Use the HTML template
  
        await mailTransporter.sendMail({
          from: process.env.GMAIL_USER,  // sender email
          to: userEmail,  // recipient email
          subject: "Exemption Approved",  // email subject
          html: emailContent,  // send HTML content
        });
      }
  
      return res.status(200).json({
        message: "Exemption approved",
        exemption: updatedExemption,
      });
    } catch (error) {
      console.error("Error approving exemption:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const denyExemption = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Fetch the exemption document by exemption_id
      const exemption = await Exemption.findOne({ exemption_id: id })
        .populate({
          path: "profile_id",
          populate: {
            path: "user_id",
          },
        });
  
      if (!exemption) {
        return res.status(404).json({ message: "Exemption not found" });
      }
  
      // Update exemption status
      exemption.isApprovedbyTalati = false;
      exemption.isDeniedbyTalati = true;
      exemption.isPending = false; // ✅
      exemption.isApprovedbyTalatiAt = null; // Reset approval timestamp if it's denied
      exemption.isDeniedbyTalatiAt = new Date();  // Set denial timestamp
  
      // Save the updated exemption status
      const updatedExemption = await exemption.save();
  
      // Get the user's email
      const userEmail = exemption?.profile_id?.user_id?.email;
  
      if (userEmail) {
        // Send HTML email
        const emailContent = denyExemptionTemplate(exemption.exemption_id);  // Use the HTML template
  
        await mailTransporter.sendMail({
          from: process.env.GMAIL_USER,  // sender email
          to: userEmail,  // recipient email
          subject: "Exemption Denied",  // email subject
          html: emailContent,  // send HTML content
        });
      }
  
      return res.status(200).json({
        message: "Exemption Denied",
        exemption: updatedExemption,
      });
    } catch (error) {
      console.error("Error denying exemption:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  