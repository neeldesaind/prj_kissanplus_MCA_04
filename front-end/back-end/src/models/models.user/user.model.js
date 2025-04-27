import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    email: { 
        type: String,
        required: true,
        unique: true,
        trim: true, // Ensures no spaces
        lowercase: true
    },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "Farmer" },
    verified: { type: Boolean, default: false },
    refreshToken: { type: String, default: "" }, 
    verificationToken: String, // 🔹 Store the verification token
     

    // Password Reset Fields
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
    
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
