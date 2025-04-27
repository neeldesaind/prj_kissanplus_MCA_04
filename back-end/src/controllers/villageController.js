import Village from "../models/models.location/village.model.js";

export const addVillage = async (req, res) => {
  try {
    const { village_name, subdistrict_id } = req.body;

    // Check if a village with the same name already exists in the same subdistrict
    const existingVillage = await Village.findOne({ village_name, subdistrict_id });

    if (existingVillage) {
      return res.status(400).json({ message: "A village with this name already exists in the sub-district" });
    }

    // Find the latest village_id
    const lastVillage = await Village.findOne().sort({ village_id: -1 });

    // Set village_id
    const village_id = lastVillage ? lastVillage.village_id + 1 : 1;  

    const newVillage = new Village({
      village_id,
      village_name,
      subdistrict_id
    });

    await newVillage.save();
    res.status(201).json({ message: "Village added successfully", newVillage });

  } catch (error) {
    console.error("Error adding village:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getAllVillages = async (req, res) => {
  try {
    const villages = await Village.find().populate("subdistrict_id");
    res.status(200).json(villages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getVillagesBySubDistrict = async (req, res) => {
  try {
    const { subdistrict_id } = req.params;
    const villages = await Village.find({ subdistrict_id });

    if (!villages.length) {
      return res.status(404).json({ message: "No villages found for this sub-district" });
    }

    res.status(200).json(villages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Controller for updating a village
export const updateVillage = async (req, res) => {
  const { village_id } = req.params;
  const { village_name } = req.body;

  try {
    // Check if village exists
    const village = await Village.findById(village_id);
    if (!village) {
      return res.status(404).json({ message: "Village not found" });
    }

    // Update the village name
    village.village_name = village_name;

    // Save the updated village
    await village.save();

    return res.status(200).json({ message: "Village updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update village" });
  }
};

export const getVillagesById = async (req, res) => {
  try {
    const village = await Village.findById(req.params.id);
    if (!village) {
      return res.status(404).json({ message: 'Village not found' });
    }
    res.json(village);
  } catch (error) {
    console.error('Error fetching village:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
