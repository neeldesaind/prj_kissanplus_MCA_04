import mongoose from 'mongoose';
const exemptionSchema = new mongoose.Schema({
    exemption_id: {
        type: String,
        required: true,
        unique: true
    },
    profile_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    isOwnWell: {
        type: Boolean,
        required: true
    },
    othersSurveyNumber: {
        type: String,
        default: null,
      },
    date_of_well: {
        type: Date,
        required: true
    },
    isOwner: {
        type: Boolean,
        required: true
    },
    isPending: {
        type: Boolean,
        default: true,
      },
      
    isApprovedbyTalati: {
        type: Boolean,
        default: false // Default is false
    },
    isApprovedbyTalatiAt: {
        type: Date,
        default: null // Store the approval timestamp
      },
      isDeniedbyTalati: {
        type: Boolean,
        default: false // Default is false
      },
      isDeniedbyTalatiAt: {
        type: Date,
        default: null // Store the denial timestamp
      },
    farmDetails: [{
        village_name: { type: String, required: true },
        surveyNumber: { type: String, required: true },
        poatNumber: { type: String, required: true },
        farmArea: { type: Number, required: true },
    }]
}, {
    timestamps: true
});

export default mongoose.model('Exemption', exemptionSchema);
