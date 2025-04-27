import mongoose from "mongoose";
const subdisSchema = new mongoose.Schema({
    subdistrict_id:{
        type: Number,
        required: true
    },
    subdistrict_name:{
        type: String,
        required: true
    },
    district_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District',
        required: true
    }
},{timestamps: true})
const SubDistrict = mongoose.model('SubDistrict', subdisSchema);
export default SubDistrict;