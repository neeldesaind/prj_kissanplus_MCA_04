import Noc from "../models/models.forms/noc.model.js";
import {approveNocTemplate}  from '../utils/emailTemplates/approveNocTemplate.js';
import mailTransporter from "../utils/config/mailTransporter.js";
import {denyNocTemplate}  from '../utils/emailTemplates/denyNocTemplate.js';

const generateNocId = () => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `NOC-${timestamp}-${randomPart}`;
};

export const approveNOC = async (req, res) => {
  try {
    const { nocId } = req.params;

    const noc = await Noc.findById(nocId)
      .populate({
        path: "profile_id",
        populate: { path: "user_id" },
      });

    if (!noc) return res.status(404).json({ message: "NOC not found" });

    noc.isApprovedbyTalati = true;
    noc.isApprovedbyTalatiAt = new Date(); // ✅ Set the approval timestamp
    noc.isDeniedbyTalati = false; // ✅ Ensure denial is reset if it exists
    noc.isDeniedByTalatiAt = null; // ✅ Clear denial timestamp if any
    noc.isPending = false;
    await noc.save();

    const userEmail = noc?.profile_id?.user_id?.email;
    if (userEmail) {
      await mailTransporter.sendMail({
        from: process.env.GMAIL_USER,
        to: userEmail,
        subject: "NOC Application Approved",
        html: approveNocTemplate(noc.noc_id),
      });
    }

    res.status(200).json({ message: "NOC approved" });
  } catch (error) {
    console.error("Error approving NOC:", error);
    res.status(500).json({ message: "Error approving NOC" });
  }
};

export const getNOCsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find NOCs where the profile's user_id matches
    const nocs = await Noc.find()
      .populate({
        path: "profile_id",
        match: { user_id: userId }, // match the inner user
        populate: { path: "user_id" }, // populate user details
      })
      .populate("farm_ids"); // optional: populate farm info

    // Filter out any NOCs where profile didn't match due to 'match'
    const filtered = nocs.filter(noc => noc.profile_id !== null);

    if (filtered.length === 0) {
      return res.status(404).json({ message: "No NOCs found for this user" });
    }

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch NOCs", error: err.message });
  }
};

export const denyNOC = async (req, res) => {
  try {
    const { nocId } = req.params;

    const noc = await Noc.findById(nocId)
      .populate({
        path: "profile_id",
        populate: {
          path: "user_id"
        }
      });

    if (!noc) {
      return res.status(404).json({ message: "NOC not found" });
    }

    noc.isApprovedbyTalati = false;
    noc.isApprovedbyTalatiAt = null; // ✅ Clear approval timestamp if any

    noc.isDeniedbyTalati = true; // ✅ Mark as denied by Talati
    noc.isDeniedByTalatiAt = new Date(); // ✅ Set denial timestamp
    noc.isPending = false;
    await noc.save();

    const userEmail = noc?.profile_id?.user_id?.email;

    if (userEmail) {
      await mailTransporter.sendMail({
        from: process.env.GMAIL_USER,
        to: userEmail,
        subject: "NOC Application Denied",
        html: denyNocTemplate(noc.noc_id || noc._id),
      });
    }

    res.status(200).json({ message: "NOC denied" });
  } catch (error) {
    console.error("Error denying NOC:", error);
    res.status(500).json({ message: "Error denying NOC" });
  }
};


export const getNOCById = async (req, res) => {
  try {
    const nocId = req.params.nocId;
    if (!nocId) {
      return res.status(400).json({ error: 'NOC ID is required' });
    }

    // Update this part to populate farm details
    const noc = await Noc.findById(nocId)
      .populate({
        path: 'profile_id',
        populate: {
          path: 'user_id',
          select: 'firstName middleName lastName',  // Adjust the fields you need
          model: 'User',
        },
      })
      .populate({
        path: 'farm_ids', // Populate farm details
        populate: [
          { path: 'state_id', select: 'state_name' }, // Adjust with the actual field you need
          { path: 'district_id', select: 'district_name' }, 
          { path: 'subdistrict_id', select: 'subdistrict_name' },
          { path: 'village_id', select: 'village_name' },
        ]
      })
      .exec();

    if (!noc) {
      return res.status(404).json({ error: 'NOC not found' });
    }

    res.json(noc);
  } catch (error) {
    console.error('Error fetching NOC by ID:', error);
    res.status(500).json({ error: 'Failed to fetch NOC' });
  }
};




export const createNOC = async (req, res) => {
  try {
    const { profile_id, reason_for_noc, isowner, farm_ids } = req.body;

    // Validate required fields
    if (!profile_id || !reason_for_noc || !Array.isArray(farm_ids) || farm_ids.length === 0) {
      return res.status(400).json({
        message: "Reason for Noc required.",
      });
    }

    // Check if last application is within 15 days
    const lastNoc = await Noc.findOne({ profile_id }).sort({ createdAt: -1 });

    if (lastNoc) {
      const fifteenDaysAgo = new Date();
      fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

      if (lastNoc.createdAt > fifteenDaysAgo) {
        return res.status(400).json({
          message: "You can only apply for NOC once every 15 days.",
        });
      }
    }

    const newNoc = new Noc({
      noc_id: generateNocId(),
      profile_id,
      reason_for_noc,
      isowner,
      isApprovedbyTalati: false,
      isApprovedbyTalatiAt: null,
      isDeniedbyTalati: false,
      isDeniedbyTalatiAt: null,
      isPending: true,
      farm_ids, 
    });

    await newNoc.save();

    res.status(201).json({ message: "NOC created successfully", noc: newNoc });
  } catch (error) {
    console.error("Error creating NOC:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllNOCs = async (req, res) => {
  try {
    const nocs = await Noc.find()
    .populate({
      path: 'profile_id',
      populate: {
        path: 'user_id',
        select: 'firstName middleName lastName',
        model: 'User',
      },
    })
    .populate("farm_ids");
  
    res.status(200).json(nocs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch NOCs" });
  }
};
