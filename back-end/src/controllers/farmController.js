    import Farm from "../models/models.farms/farm.models.js";
    import User from "../models/models.user/user.model.js";


    export const addFarmDetails = async (req, res) => {
      try {
          const { userId, farms } = req.body;
  
          if (!userId) {
              return res.status(400).json({ message: "User ID is required" });
          }
  
          const user = await User.findById(userId);
          if (!user || user.role !== "Farmer") {
              return res.status(403).json({ message: "Access denied. Only farmers can add farm details." });
          }
  
          if (!farms || !Array.isArray(farms)) {
              return res.status(400).json({ message: "Invalid farm data format" });
          }
  
          const farmRecords = [];
  
          for (const farm of farms) {
              if (farm._id) {
                  // Update existing farm
                  const updatedFarm = await Farm.findByIdAndUpdate(
                      farm._id,
                      { $set: { ...farm } }, // Set all updated values
                      { new: true } // Return the updated farm
                  );
  
                  if (!updatedFarm) {
                      return res.status(404).json({ message: "Farm not found for updating." });
                  }
  
                  farmRecords.push(updatedFarm);
              } else {
                  // Create new farm entry
                  const newFarm = new Farm({ ...farm, userId });
                  await newFarm.save();
                  farmRecords.push(newFarm);
              }
          }
  
          res.status(200).json({ message: "Farm details added/updated successfully", farms: farmRecords });
      } catch (error) {
          console.error("Error in addFarmDetails:", error);
          res.status(500).json({ message: "Server error", error: error.message });
      }
  };
  
      
      
      
      export const getFarmDetails = async (req, res) => {
        try {
            const { userId, userRole } = req.query;
    
            if (!userId) {
                return res.status(400).json({ message: "User ID is required" });
            }

            if(userRole !== "Farmer") {
            
            }
    
            // Assuming you have a model called Farm that you are fetching
            const farms = await Farm.find({ userId });
    
            if (farms.length === 0) {
                // Ensure you return a proper response if no farms are found
                return res.status(404).json({ message: "No farms found " });
            }
    
            res.status(200).json({ farms });
        } catch (error) {
            console.error("Error fetching farm details:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    };
      
  
  

    export const deleteFarmDetails = async (req, res) => {
        const { farmId } = req.params;
      
        try {
          if (!farmId) {
            return res.status(400).json({ message: "Farm ID is required." });
          }
      
          const farm = await Farm.findById(farmId);
          if (!farm) {
            return res.status(404).json({ message: "Farm not found." });
          }
      
          await Farm.findByIdAndDelete(farmId);
          res.status(200).json({ message: "Farm deleted successfully." });
        } catch (error) {
          console.error("Error deleting farm:", error);
          res.status(500).json({ message: "Server error", error: error.message });
        }
      };

      export const getFarmByUserId = async (req, res) => {
        try {
            const farms = await Farm.find({ userId: req.params.userId }); // returns an array
            if (!farms.length) return res.status(404).json({ message: "No farms found" });
            res.json(farms);
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
        };
      