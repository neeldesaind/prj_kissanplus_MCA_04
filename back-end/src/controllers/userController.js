import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/models.user/user.model.js";
import Profile from "../models/models.user/profile.model.js";
import {verificationEmailTemplate} from "../utils/emailTemplates/verificationTemplate.js";
import {successEmailTemplate} from "../utils/emailTemplates/successTemplate.js";
import {accountCreationEmailTemplate} from "../utils/emailTemplates/accountCreationTemplate.js";
import mailTransporter from "../utils/config/mailTransporter.js";


// Generate Access & Refresh Tokens
const generateAccessToken = (user) => {
    return jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};


const userRegister = async (req, res) => {
    try {
        const { firstName, middleName, lastName, email, password, role, isAdmin } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email Already Registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            middleName: middleName || "",
            lastName,
            email,
            password: hashedPassword,
            role: role || "Farmer",
            verified: isAdmin ? true : false, 
        });

        await newUser.save();

        // If user is added by admin, no need to send verification email
        if (isAdmin) {
            return res.status(201).json({ 
                message: "User registered successfully and verified.",
                userId: newUser._id  
            });
        }

        // Generate Email Verification Token (for non-admin created users)
        const emailToken = jwt.sign(
            { email: newUser.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );

        const verificationLink = `http://localhost:3000/api/users/verify/${emailToken}`;

        // Send verification email only if not added by an admin
        await mailTransporter.sendMail({
            from: `"Kissan Plus" <${process.env.GMAIL_USER}>`,
            to: newUser.email,
            subject: "Verify Your Email",
            html: verificationEmailTemplate(newUser.firstName, newUser.lastName, verificationLink),
        });

        res.status(201).json({ 
            message: "User registered successfully. Please verify your email.",
            userId: newUser._id  
        });

    } catch (error) {
        console.error("Error in userRegister:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default userRegister;

const sendEmail = async (email, firstName, password) => {
    const loginLink = "http://localhost:8080/login-page"; 

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Account Registration Successful",
        html: accountCreationEmailTemplate(firstName, email, password, loginLink),
    };

    try {
        await mailTransporter.sendMail(mailOptions);
        console.log("Email sent successfully to", email);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};


const addUser = async (req, res) => {
    try {
        const { firstName, middleName, lastName, email, password, role, verified } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email Already Exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            middleName: middleName || "",
            lastName,
            email,
            password: hashedPassword,
            role: role || "Farmer",
            verified: verified ?? true, // Default verified
        });

        await newUser.save();

        // Send email with credentials
        await sendEmail(email, firstName, password);

        res.status(201).json({
            message: "User added successfully",
            userId: newUser._id,
        });

    } catch (error) {
        console.error("Error in addUser:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export { addUser };



// Email Verification
const verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.redirect(`http://localhost:8080/login-page?verified=failed`); // For non-existent users
        }

        if (user.verified) {
            return res.redirect(`http://localhost:8080/login-page?verified=true`); // Already verified
        }

        user.verified = true;
        await user.save();

        // Send success confirmation email
        await mailTransporter.sendMail({
            from: `"Kissan Plus" <${process.env.GMAIL_USER}>`,
            to: user.email,
            subject: "Email Verified Successfully",
            html: successEmailTemplate(user.firstName)
        }, (error, info) => {
            if (error) {
                console.error("Email Sending Error:", error);
            } else {
                console.log("Email Sent:", info.response);
            }
        });
        

        // Redirect to login page with success flag
        res.redirect(`http://localhost:8080/login-page?verified=success`);

    } catch (error) {
        console.error("Verification Error:", error);
        res.redirect(`http://localhost:8080/login-page?verified=failed`); // Handle invalid token error
    }
};



const userLogin = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.verified) return res.status(403).json({ message: "Please verify your email." });

    const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
        message: "Login successful",
        accessToken,
        refreshToken,
        _id: user._id, // Ensure _id is included here
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.toLowerCase(),
    });
};

// Refresh Token
const refreshAccessToken = async (req, res) => {
    const { token } = req.body;

    if (!token) return res.status(403).json({ message: "Refresh Token required" });

    const user = await User.findOne({ refreshToken: token });
    if (!user) return res.status(403).json({ message: "Invalid Refresh Token" });

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid Refresh Token" });

        const accessToken = generateAccessToken(user);
        res.json({ accessToken });
    });
};

// User Logout
const userLogout = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    user.refreshToken = "";  // Clear refresh token
    await user.save();

    res.status(200).json({ message: "Logout successful" });
};

const getUsersList = async (req, res) => {
    try {
        // Fetch users first
        const users = await User.find({}, "firstName middleName lastName email role verified");

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        // Fetch the profiles based on user_id
        const profiles = await Profile.find({
            user_id: { $in: users.map(user => user._id) }
        });

        // Combine user data with profile data
        const usersWithProfile = users.map(user => {
            // Find the profile associated with each user
            const userProfile = profiles.find(profile => profile.user_id.toString() === user._id.toString());
            return {
                ...user.toObject(),
                profile: userProfile ? {
                    avatar: userProfile.avatar,
                    gender: userProfile.gender,
                    dob: userProfile.dob,
                    address: userProfile.address,
                    pincode: userProfile.pincode,
                    phone: userProfile.phone,
                    aadhar_number: userProfile.aadhar_number
                } : null
            };
        });

        res.status(200).json({ users: usersWithProfile });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getUserById = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const profile = await Profile.findOne({ user_id: user._id })
        .populate("state_id district_id subdistrict_id village_id");
  
      res.status(200).json({ user, profile });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };
export { userRegister, verifyEmail, userLogin,userLogout, refreshAccessToken, getUsersList, getUserById };