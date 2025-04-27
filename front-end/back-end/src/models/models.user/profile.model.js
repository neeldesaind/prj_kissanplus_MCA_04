import mongoose from 'mongoose';
const profileSchema = new mongoose.Schema({
    profile_id: {
        type: Number,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    avatar: {
        type: String,
        required: false,
        default: '',
        match: /^(https?:\/\/.*\.(?:png|jpg|jpeg|svg|webp|gif))$/i
    },
    gender: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true
    },
    address: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        
        match: /^[6-9]\d{9}$/
    },
    aadhar_number: {
        type: String,
        required: false,
        match: /^\d{12}$/
    },
    // 🔹 New Location Fields
    state_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State',
        required: false  // 🔹 Now optional
    },
    district_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District',
        required: false
    },
    subdistrict_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubDistrict',
        required: false
    },
    village_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Village',
        required: false
    }
}, {timestamps: true});

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
