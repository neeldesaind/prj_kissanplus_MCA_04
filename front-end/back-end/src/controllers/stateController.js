import State from "../models/models.location/state.model.js";
import mongoose from "mongoose"; // Ensure this is imported at the top

const formatStateName = (name) => {
    return name
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export const addState = async (req, res) => {
    try {
        let { state_name } = req.body;

        if (!state_name) {
            return res.status(400).json({ message: "State name is required" });
        }

        // Format state name properly (first letter of each word capitalized)
        state_name = formatStateName(state_name);

        // Check if state already exists
        const existingState = await State.findOne({ state_name });
        if (existingState) {
            return res.status(400).json({ message: "State already exists" });
        }

        // Get the next state_id
        const lastState = await State.findOne().sort({ state_id: -1 });
        const state_id = lastState ? lastState.state_id + 1 : 1;

        const newState = new State({
            state_id,
            state_name
        });

        await newState.save();
        res.status(201).json({ message: "State added successfully", state: newState });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// Get all states
export const getAllStates = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const totalStates = await State.countDocuments();
      const totalPages = Math.ceil(totalStates / limit);
  
      const states = await State.find().sort({ state_id: 1 }).skip(skip).limit(limit);
  
      res.status(200).json({ states, totalPages });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  
  

// Get state by ID
export const getStateById = async (req, res) => {
    try {
        const { id } = req.params;
        const state = await State.findById(id);
        if (!state) {
            return res.status(404).json({ message: "State not found" });
        }
        res.status(200).json(state);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Delete state
export const deleteState = async (req, res) => {
    try {
        const { id } = req.params;
        const state = await State.findByIdAndDelete(id);
        if (!state) {
            return res.status(404).json({ message: "State not found" });
        }
        res.status(200).json({ message: "State deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const updateState = async (req, res) => {
  try {
      const { state_name } = req.body;
      const { id } = req.params;

      if (!state_name) {
          return res.status(400).json({ message: "State name is required" });
      }

      // Format state name
      const formattedStateName = state_name
          .toLowerCase()
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

      // Check if the same state name already exists (excluding the current state)
      const existingState = await State.findOne({ state_name: formattedStateName });
      if (existingState && existingState.state_id !== id) {
          return res.status(400).json({ message: "State name already exists" });
      }

      // Update the state
      const updatedState = await State.findOneAndUpdate(
          { state_id: id },
          { state_name: formattedStateName },
          { new: true }
      );

      if (!updatedState) {
          return res.status(404).json({ message: "State not found" });
      }

      res.status(200).json({ message: "State updated successfully", state: updatedState });

  } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
  }
};

  
