import SubDistrict from "../models/models.location/subdistrict.model.js";
import District from "../models/models.location/district.model.js";
import mongoose from "mongoose";

// ✅ Add a new sub-district
export const addSubDistrict = async (req, res) => {
    try {
      const { subdistrict_name, district_id } = req.body;
  
      // 🔹 Check if the subdistrict already exists in this district
      const existingSubDistrict = await SubDistrict.findOne({ 
        subdistrict_name, 
        district_id 
      });
  
      if (existingSubDistrict) {
        return res.status(400).json({ message: "Sub-District name must be unique in this district." });
      }
  
      // Get the highest existing subdistrict_id and increment it
      const lastSubDistrict = await SubDistrict.findOne().sort({ subdistrict_id: -1 });
  
      const newSubDistrict = new SubDistrict({
        subdistrict_id: lastSubDistrict ? lastSubDistrict.subdistrict_id + 1 : 1, // Start from 1
        subdistrict_name,
        district_id,
      });
  
      await newSubDistrict.save();
      res.status(201).json({ message: "Sub-District added successfully!", subdistrict: newSubDistrict });
    } catch (error) {
      console.error("Error adding sub-district:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

  export const updateSubDistrict = async (req, res) => {
    try {
      const { id } = req.params;
      console.log("Updating sub-district with ID:", id); // Debugging
  
      const { subdistrict_name, district_id } = req.body;
      if (!subdistrict_name || !district_id) {
        return res.status(400).json({ message: "Sub-District name and District ID are required" });
      }
  
      const updatedSubDistrict = await SubDistrict.findByIdAndUpdate(
        id,
        { subdistrict_name, district_id },
        { new: true }
      );
  
      if (!updatedSubDistrict) {
        return res.status(404).json({ message: "Sub-District not found" });
      }
  
      res.json({ message: "Sub-District updated successfully!", subdistrict: updatedSubDistrict });
    } catch (error) {
      console.error("Error updating sub-district:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

export const getSubDistrictsByDistrict = async (req, res) => {
    try {
      const { district_id } = req.params;
      const { page = 1, limit = 5 } = req.query;
  
      if (!mongoose.Types.ObjectId.isValid(district_id)) {
        return res.status(400).json({ message: "Invalid district_id" });
      }
  
      const skip = (page - 1) * limit;
      const total = await SubDistrict.countDocuments({ district_id });
      const totalPages = Math.ceil(total / limit);
  
      const subDistrictList = await SubDistrict.find({ district_id })
  .select("subdistrict_id subdistrict_name") // Select only necessary fields
  .skip(skip)
  .limit(Number(limit));
  
      res.json({ subdistricts: subDistrictList, totalPages }); // 🛠 Use correct variable
    } catch (error) {
      console.error("Error fetching sub-districts:", error.message);
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  };

  export const getSubDistrictsByID = async (req, res) => {
    try {
      const subdistrict = await SubDistrict.findById(req.params.id);
      if (!subdistrict) {
        return res.status(404).json({ message: 'Subdistrict not found' });
      }
      res.json(subdistrict);
      
    } catch (error) {
      console.error('Error fetching subdistrict:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };