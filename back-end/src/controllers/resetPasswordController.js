import bcrypt from "bcryptjs";
import User from "../models/models.user/user.model.js";

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await User.findOne({ 
            resetPasswordToken: token, 
            resetPasswordExpires: { $gt: new Date() } // Ensure token is still valid
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        // Password Strength Check
        if (!/[A-Z]/.test(newPassword) || 
            !/[0-9]/.test(newPassword) || 
            !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) || 
            newPassword.length < 8 || 
            newPassword.length > 12) {
            return res.status(400).json({ message: "Password must meet all security criteria." });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password successfully reset." });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
