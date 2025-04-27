import mongoose from 'mongoose';
const locationSchema = new mongoose.Schema({
    location_id:{
        type: Number,
        required: true
    },
    
    state_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State',
        required: true
    },
    district_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District',
        required: true
    },
    subdistrict_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubDistrict',
        required: true
    },
    village_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Village',
        required: true
    }
    
}, {timestamps: true});
const Location = mongoose.model('Location', locationSchema);
export default Location;