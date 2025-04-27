import crypto from "crypto";
import User from "../models/models.user/user.model.js";
import mailTransporter from "../utils/config/mailTransporter.js";

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.verified) {
            return res.status(403).json({ message: "Email is not verified", exists: true, verified: false });
        }

        // Generate Token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(resetTokenExpiry);
        await user.save();

        const resetLink = `http://localhost:8080/reset-password/${resetToken}`;

        // Send reset password email
        await mailTransporter.sendMail({
            from: `"Kissan Plus" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: "Password Reset Request",
            html: `
                <p>Hello ${user.firstName},</p>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}" 
                   style="background-color:#4CAF50;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">
                    Reset Password
                </a>
                <p>This link will expire in 1 hour.</p>
            `,
        });

        res.status(200).json({ message: "Password reset link sent successfully." });
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Check if Email Exists
export const checkEmailExists = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(404).json({ message: "User not found" }); // Clearer message
        }
    } catch (error) {
        console.error("Error in checkEmailExists:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};