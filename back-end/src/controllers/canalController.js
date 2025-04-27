import Canal from '../models/models.location/canal.model.js';  // Import Canal model
import mongoose from 'mongoose';

// Add new canal
// Add Canal
export const addCanal = async (req, res) => {
  try {
    const { canal_name, village_id } = req.body;  // Updated variable names to match frontend

    if (!canal_name || !village_id) {
      return res.status(400).json({ message: 'Canal name and village are required' });
    }

    const existingCanal = await Canal.findOne({ canal_name, village_id });

    if (existingCanal) {
      return res.status(400).json({ message: "A canal with this name already exists in the village" });
    }

    const lastCanal = await Canal.findOne({ village_id }).sort({ canal_id: -1 });

    const canal_id = lastCanal ? lastCanal.canal_id + 1 : 1;

    const newCanal = new Canal({
      canal_id,
      canal_name,
      village_id: new mongoose.Types.ObjectId(village_id),
    });

    await newCanal.save();
    res.status(201).json({ message: 'Canal added successfully', canal: newCanal });

  } catch (error) {
    console.error("Error adding canal:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get Canals By Village with Pagination
export const getCanalsByVillage = async (req, res) => {
  try {
    const { villageId } = req.params;
    const { page = 1, limit = 5 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(villageId)) {
      return res.status(400).json({ message: "Invalid village ID format" });
    }

    const skip = (page - 1) * limit;
    const totalCanals = await Canal.countDocuments({ village_id: villageId });

    const canals = await Canal.find({ village_id: new mongoose.Types.ObjectId(villageId) })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ canal_id: 1 });

    res.status(200).json({
      canals,
      totalCanals,
      totalPages: Math.ceil(totalCanals / limit),  // Add totalPages to the response
    });
  } catch (error) {
    console.error("Error fetching canals:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateCanal = async (req, res) => {
  const { canal_id } = req.params;  // Canal ID from the request parameters
  const { canal_name } = req.body;  // Canal name from the request body

  try {
    // Check if the canal exists
    const canal = await Canal.findById(canal_id);
    if (!canal) {
      return res.status(404).json({ message: "Canal not found" });  // Canal not found
    }

    // Check if the canal name already exists
    const canalExists = await Canal.findOne({
      canal_name: new RegExp(`^${canal_name}$`, 'i'),  // Case-insensitive search for canal name
      _id: { $ne: canal_id },  // Make sure it’s not the same canal being updated
    });
    if (canalExists) {
      return res.status(400).json({ message: "Canal name already exists" });  // Name conflict
    }

    // Update the canal name
    canal.canal_name = canal_name;

    // Save the updated canal
    await canal.save();

    return res.status(200).json({ message: "Canal updated successfully" });  // Successful update
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update canal" });  // Internal server error
  }
};
