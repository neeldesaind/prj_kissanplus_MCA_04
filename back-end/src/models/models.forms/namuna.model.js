import mongoose from 'mongoose';

const farmDetailSchema = new mongoose.Schema({
  farm_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  canal_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Canal'
  },
  requested_area: {
    type: String,
    required: true
  },
  crop_name: {
    type: String,
    required: true
  },
  otherCropName: String,
  irrigationYear: {
    type: Date,
    required: true
  }
},{ _id: false }); ;

const namunaSchema = new mongoose.Schema({
  namuna_id: {
    type: String,
    unique: true,
    required: true
  },
  source_type: String,
  profile_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  date_of_supply: {
    type: Date,
  },
  isOwner: Boolean,
  dues_Clear_till: String,
  dues_crop_name: String,
  isApprovedbyTalati: Boolean,
  isDeniedbyTalati: Boolean,
  approvedByTalatiAt: Date,
  deniedByTalatiAt: Date,
  isPending: { type: Boolean, default: true },
  
  farmDetails: [farmDetailSchema]
}, { timestamps: true });

export default mongoose.model('Namuna', namunaSchema);