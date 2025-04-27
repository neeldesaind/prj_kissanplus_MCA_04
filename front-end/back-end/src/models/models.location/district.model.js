import mongoose from "mongoose";
const districtSchema = new mongoose.Schema({
    district_id:{
        type: Number,
        required: true
    },
    district_name:{
        type: String,
        required: true
    },
    state_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State',
        required: true
    }
},{timestamps: true});
const District = mongoose.model('District', districtSchema);
export default District;