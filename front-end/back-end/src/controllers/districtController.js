import District from "../models/models.location/district.model.js";
import mongoose from "mongoose";

// Format district name properly
const formatDistrictName = (name) => {
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Get Districts by State ID
export const getDistrictsByState = async (req, res) => {
  try {
    const { stateId } = req.params; // Extract state ID from params

    // Fetch districts for the given state
    const districts = await District.find({ state_id: stateId });

    if (!districts.length) {
      return res.status(404).json({ message: "No districts found for this state" });
    }

    res.status(200).json({ districts });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Add a new district
export const addDistrict = async (req, res) => {
  try {
    let { district_name, state_id } = req.body;

    // Ensure required fields are present
    if (!district_name || !state_id) {
      return res.status(400).json({ message: "District name and state ID are required" });
    }

    // Validate `state_id` format
    if (!mongoose.Types.ObjectId.isValid(state_id)) {
      return res.status(400).json({ message: "Invalid state ID format" });
    }

    // Convert district name to lowercase and trim spaces for consistency
    district_name = district_name.trim();

    // Check if the district already exists for the given state
    const existingDistrict = await District.findOne({ district_name, state_id });

    if (existingDistrict) {
      return res.status(400).json({ message: "District already exists." });
    }

    // Find the latest `district_id`
    const lastDistrict = await District.findOne().sort({ district_id: -1 });

    let newDistrictId = 1; // Default starting value
    if (lastDistrict) {
      newDistrictId = lastDistrict.district_id + 1;
    }

    // Create and save the new district
    const newDistrict = new District({
      district_id: newDistrictId,
      district_name,
      state_id
    });

    await newDistrict.save();

    res.status(201).json({ message: "District added successfully!", district: newDistrict });

  } catch (error) {
    console.error("Error adding district:", error);

    // Handle MongoDB duplicate key error (E11000)
    if (error.code === 11000) {
      return res.status(400).json({ message: "District already exists." });
    }

    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
// Update district
export const updateDistrict = async (req, res) => {
  try {
    const { id } = req.params;
    const { district_name, state_id } = req.body;

    if (!district_name || !state_id) {
      return res.status(400).json({ message: "District name and state ID are required" });
    }

    const updatedDistrict = await District.findByIdAndUpdate(
      id,
      { district_name, state_id },
      { new: true }
    );

    if (!updatedDistrict) {
      return res.status(404).json({ message: "District not found" });
    }

    res.json({ message: "District updated successfully!", district: updatedDistrict });
  } catch (error) {
    console.error("Error updating district:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDistrictsById = async (req, res) => {

  try {
    const district = await District.findById(req.params.id);
    if (!district) {
      return res.status(404).json({ message: 'District not found' });
    }
    res.json(district);
  } catch (error) {
    console.error('Error fetching district:', error);
    res.status(500).json({ message: 'Server error' });
  }
};