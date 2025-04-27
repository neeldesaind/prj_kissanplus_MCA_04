import mongoose from 'mongoose';
import Profile from "../models/models.user/profile.model.js" // Import Profile model
import User from "../models/models.user/user.model.js"; // Import User model
import Farm from "../models/models.farms/farm.models.js"; // Import Farm model
import Namuna from "../models/models.forms/namuna.model.js"; // Import Namuna model
import Canal from "../models/models.location/canal.model.js"; // Import Canal model
import Village from '../models/models.location/village.model.js';
import mailTransporter from "../utils/config/mailTransporter.js";
import { approveNamuna7Template } from '../utils/emailTemplates/namuna7ApproveTemplate.js';
import { denyNamuna7Template } from '../utils/emailTemplates/namuna7DenyTemplate.js';


export const getNamuna7Data = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch user details from UserModel
    const user = await User.findById(userId).select("firstName middleName lastName email role verified");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch profile details from ProfileModel
    const profile = await Profile.findOne({ user_id:userId }).select("address subdistrict_id district_id");
    // Fetch farm details from FarmModel
    const farms = await Farm.find({ userId: userId });
    // Construct response
    const responseData = {
      farmerName: `${user.firstName} ${user.middleName || ""} ${user.lastName}`.trim(),
      residentOf: profile?.address || "",
      district: profile?.district_name || "",
      phone: profile?.phone || "",
      aadharNumber: profile?.aadhar_number || "",
      farmDetails: farms.map((farm) => ({
        villageName: farm.villageName,
        canalNumber: farm.canalNumber,
        baariNumber: farm.baariNumber,
        surveyNumber: farm.surveyNumber,
        poatNumber: farm.poatNumber,
        totalAreaVigha: farm.totalAreaVigha,
        requestedWaterVigha: farm.requestedWaterVigha,
        cropName: farm.cropName,
        irrigationYear: farm.irrigationYear,
      })),
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching Namuna7 data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const saveNamuna7Data = async (req, res) => {
  try {
    const formData = req.body;

    if (!formData || !Array.isArray(formData.farmDetails)) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ message: "Invalid data" });
    }

    // Validate canal IDs and prepare farm details
    const farmDetailsArray = [];

    for (const farm of formData.farmDetails) {
      const canalId = farm.canal_id;

      if (!mongoose.Types.ObjectId.isValid(canalId)) {
        return res.status(400).json({ message: `Invalid canal_id: ${canalId}` });
      }

      const canal = await Canal.findById(canalId);
      if (!canal) {
        return res.status(400).json({ message: `Canal with canal_id ${canalId} not found` });
      }

      farmDetailsArray.push({
        farm_id: farm.farm_id,
        canal_id: canal._id,
        requested_area: farm.requested_water_vigha,
        crop_name: farm.crop_name,
        otherCropName: farm.otherCropName,
        irrigationYear: farm.irrigationYear ? new Date(farm.irrigationYear) : undefined
      });
    }

    const count = await Namuna.countDocuments();
    const paddedId = String(count + 1).padStart(4, '0');
    const customId = `NAM-${paddedId}`;

    const newEntry = new Namuna({
      namuna_id: customId,
      source_type: formData.source_type || "canal",
      profile_id: formData.profile_id,
      isOwner: formData.isOwner,
      dues_Clear_till: formData.dues_Clear_till,
      dues_crop_name: formData.dues_crop_name,
      isApprovedbyTalati: formData.isApprovedbyTalati,
      farmDetails: farmDetailsArray
    });

    const savedEntry = await newEntry.save();
    res.status(201).json({ message: "Data saved successfully", data: savedEntry });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllNamunaApplications = async (req, res) => {
  try {
    const applications = await Namuna.find()
      .populate({
        path: "profile_id",
        populate: { path: "user_id" }
      });

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching Namuna applications:", error);
    res.status(500).json({ message: "Failed to load Namuna applications" });
  }
};


export const getSingleNamuna7 = async (req, res) => {
  try {
    const { namuna_id } = req.params;

    const application = await Namuna.findOne({ namuna_id })
      .populate({
        path: "profile_id",
        populate: {
          path: "user_id",
          select: "firstName middleName lastName",
        },
      })
      .lean(); // Allow modifying the object

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Enrich farmDetails with canal_name
// Enrich farmDetails with canal_name and farm details
const enrichedFarmDetails = await Promise.all(
  (application.farmDetails || []).map(async (farm) => {
    const enrichedFarm = { ...farm };

    if (farm.canal_id) {
      const canal = await Canal.findById(farm.canal_id);
      enrichedFarm.canal_name = canal ? canal.canal_name : "Unknown";
    }

    if (farm.farm_id) {
      const farmData = await Farm.findById(farm.farm_id);
      if (farmData) {
        enrichedFarm.village_name = farmData.village_name;
        enrichedFarm.surveyNumber = farmData.surveyNumber;
        enrichedFarm.poatNumber = farmData.poatNumber;
        enrichedFarm.farmArea = farmData.farmArea;

        const village = await Village.findById(farmData.village_id);
        enrichedFarm.village_name = village ? village.village_name : "Unknown";
      }
    }

    return enrichedFarm;
  })
);

application.farmDetails = enrichedFarmDetails;


    res.status(200).json(application);
  } catch (error) {
    console.error("Error fetching Namuna7 application:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const approveNamuna7 = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the Namuna 7 application by ID
    const application = await Namuna.findOne({ namuna_id: id })
      .populate({
        path: "profile_id",
        populate: { path: "user_id" },
      });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Update the application to approved
    application.isApprovedbyTalati = true;
    application.isDeniedbyTalati = false;
    application.approvedByTalatiAt = new Date();
    application.deniedByTalatiAt = null;
    application.isPending = false; 

    await application.save();

    // Send approval email if user email exists
    const userEmail = application?.profile_id?.user_id?.email;
    if (userEmail) {
      await mailTransporter.sendMail({
        from: process.env.GMAIL_USER,
        to: userEmail,
        subject: `Namuna 7 Application Approved - ${application.namuna_id}`,
        html: approveNamuna7Template(application.namuna_id, application.isApprovedbyTalati),
      });
    }

    res.status(200).json({ message: "Namuna 7 application approved by Talati" });
  } catch (error) {
    console.error("Error approving Namuna 7:", error);
    res.status(500).json({ message: "Error approving Namuna 7 application" });
  }
};

export const denyNamuna7 = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the Namuna 7 application by ID
    const application = await Namuna.findOne({ namuna_id: id })
      .populate({
        path: "profile_id",
        populate: { path: "user_id" },
      });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Update the application to denied
    application.isApprovedbyTalati = false;
    application.isDeniedbyTalati = true;
    application.deniedByTalatiAt = new Date();
    application.approvedByTalatiAt = null;
    application.isPending = false;

    await application.save();

    // Send denial email if user email exists
    const userEmail = application?.profile_id?.user_id?.email;
    if (userEmail) {
      await mailTransporter.sendMail({
        from: process.env.GMAIL_USER,
        to: userEmail,
        subject: `Namuna 7 Application Denied - ${application.namuna_id}`,
        html: denyNamuna7Template(application.namuna_id, application.isApprovedbyTalati),
      });
    }

    res.status(200).json({ message: "Namuna 7 application denied by Talati" });
  } catch (error) {
    console.error("Error denying Namuna 7:", error);
    res.status(500).json({ message: "Error denying Namuna 7 application" });
  }
};

export const getNamuna7ByProfileId = async (req, res) => {
  const { profileId } = req.params;

  try {
    const namuna7s = await Namuna.find({ profile_id: profileId })
      .populate("profile_id")
      .populate("farmDetails.farm_id")
      .populate({
        path: "farmDetails.canal_id",
        select: "canal_name", // This ensures that `canal_name` is included in the populated `canal_id`
      });

    if (!namuna7s.length) {
      return res.status(404).json({ message: "No Namuna 7 applications found for this profile." });
    }

    res.status(200).json(namuna7s);
  } catch (error) {
    console.error("Error fetching Namuna7s:", error);
    res.status(500).json({ message: "Failed to fetch Namuna 7s", error: error.message });
  }
};



export const getAllNamunaApplication = async (req, res) => {
  try {
    const applications = await Namuna.find({ isApprovedbyTalati: true })
      .populate({
        path: "profile_id",
        populate: { path: "user_id" }
      })
      .populate({
        path: "farmDetails.farm_id", // Populate farm_id
        model: "Farm", // The model name for the Farm collection
        populate: [
          { path: "state_id", model: "State" }, // Populate state_id
          { path: "district_id", model: "District" }, // Populate district_id
          { path: "subdistrict_id", model: "SubDistrict" }, // Populate subdistrict_id
          { path: "village_id", model: "Village" } // Populate village_id
        ]
      })
      .populate({
        path: "farmDetails.canal_id", // Assuming canal_id exists in farmDetails
        model: "Canal" // The model name for the Canal collection
      });

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching Namuna applications:", error);
    res.status(500).json({ message: "Failed to load Namuna applications" });
  }
};



  export const updateDateOfSupply = async (req, res) => {
    const { id } = req.params;
    const { date_of_supply } = req.body;
  
    try {
      // Find the Form12 application by ID
      const namuna7 = await Namuna.findById(id);
  
      if (!namuna7) {
        return res.status(404).json({ message: 'namuna7 application not found' });
      }
  
      // Update the date_of_supply field
      namuna7.date_of_supply = date_of_supply;
  
      // Save the updated form
      await namuna7.save();
  
      res.status(200).json({ message: 'Date of supply updated successfully', data: namuna7 });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating date of supply' });
    }
  };


