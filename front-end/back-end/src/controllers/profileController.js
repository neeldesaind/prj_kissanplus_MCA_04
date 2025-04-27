import Profile from "../models/models.user/profile.model.js";
import User from "../models/models.user/user.model.js";
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { upload } from '../utils/config/multerConfig.js';  
import fs from 'fs';

import moment from 'moment';
import mongoose from 'mongoose';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  export const getUserProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).lean();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const profile = await Profile.findOne({ user_id: userId }).lean();

        if (!profile) {
            return res.status(200).json({ ...user });
        }

      
        res.status(200).json({
            ...user,
            ...profile,
            
            state_id: profile.state_id ? profile.state_id.toString() : "",
    district_id: profile.district_id ? profile.district_id.toString() : "",
    subdistrict_id: profile.subdistrict_id ? profile.subdistrict_id.toString() : "",
    village_id: profile.village_id ? profile.village_id.toString() : "",
        });

    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const updateProfile = async (req, res) => {
    const { userId } = req.params;
    let { state_id, district_id, subdistrict_id, village_id, phone, middleName, ...rest } = req.body;

    try {
        const convertToObjectId = (id) =>
            mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;

        state_id = convertToObjectId(state_id);
        district_id = convertToObjectId(district_id);
        subdistrict_id = convertToObjectId(subdistrict_id);
        village_id = Array.isArray(village_id)
            ? convertToObjectId(village_id.find((id) => id)) // Remove empty values
            : convertToObjectId(village_id);

        // Prepare update object with only provided fields
        let updateFields = { ...rest };
        if (state_id) updateFields.state_id = state_id;
        if (district_id) updateFields.district_id = district_id;
        if (subdistrict_id) updateFields.subdistrict_id = subdistrict_id;
        if (village_id) updateFields.village_id = village_id;

        // Handle avatar upload if a file is provided
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "avatars",
                width: 200,
                height: 200,
                crop: "fill",
            });
            updateFields.avatar = result.secure_url; // Save Cloudinary URL in DB
        }

        // Check for duplicate phone only if phone is provided
        if (phone) {
            const existingProfile = await Profile.findOne({
                phone,
                user_id: { $ne: userId }, // Exclude current user
            });

            if (existingProfile) {
                return res.status(400).json({ message: "Phone number already in use." });
            }

            updateFields.phone = phone; // Add phone only if it's valid
        }

        // ✅ Update User model to include middleName
        if (middleName !== undefined) {
            await User.findByIdAndUpdate(userId, { middleName }, { new: true });
        }

        // ✅ Update Profile model
        const profile = await Profile.findOneAndUpdate(
            { user_id: userId },
            { $set: updateFields }, // Update only fields that exist
            { new: true, upsert: true }
        );

        res.status(200).json({ message: "Profile updated successfully", profile });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message, // Send the actual error
        });
    }
};
