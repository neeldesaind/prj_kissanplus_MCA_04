import User from "../models/models.user/user.model.js";
import bcrypt from "bcrypt";

export const changePassword = async (req, res) => {
  try {
    const { userId } = req.params; // Use 'userId' as defined in routes
    const { currentPassword, newPassword } = req.body;

    

    // Validate input
    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    // Ensure password field exists in the database
    if (!user.password) {
      return res.status(400).json({ message: "Password not set for this user" });
    }

    // Verify the current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Ensure new password is different
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: "New password must be different from the current password" });
    }

    // Hash the new password with salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in the database
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });

  } catch (error) {
    console.error("🚨 Change Password Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
