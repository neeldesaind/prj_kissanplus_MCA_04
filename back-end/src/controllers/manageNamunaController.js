// controllers/manageNamunaController.js

import ManageNamuna from "../models/models.forms/manageNamuna.model.js";

// Create or update Manage Namuna application
export const createOrUpdateManageNamunaApplication = async (req, res) => {
    const { startDate, endDate } = req.body;
  
    try {
      // Check if an application already exists
      let existingApplication = await ManageNamuna.findOne({});
  
      if (existingApplication) {
        // If an existing application is found, update it
        existingApplication.startDate = startDate;
        existingApplication.endDate = endDate;
  
        // Save the updated application
        await existingApplication.save();
  
        return res.status(200).json({
          message: "Existing application updated successfully",
          application: existingApplication,
        });
      } else {
        // If no existing application is found, create a new one
        const newApplication = new ManageNamuna({
          startDate,
          endDate,
        });
  
        await newApplication.save();
  
        return res.status(201).json({
          message: "New application created successfully",
          application: newApplication,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

// Fetch all Manage Namuna applications
export const getManageNamunaApplications = async (req, res) => {
  try {
    const applications = await ManageNamuna.find();

    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a Manage Namuna application
export const deleteManageNamunaApplication = async (req, res) => {
  const { id } = req.params;

  try {
    const application = await ManageNamuna.findByIdAndDelete(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Application deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
