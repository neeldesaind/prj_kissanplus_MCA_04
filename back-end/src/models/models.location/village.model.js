import mongoose from "mongoose";
const villageSchema = new mongoose.Schema({
    village_id:{
        type: Number,
        required: true
    },
    village_name:{
        type: String,
        required: true
    },
    subdistrict_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubDistrict',
        required: true
    }
},{timestamps: true})
const Village = mongoose.model('Village', villageSchema);
export default Village;