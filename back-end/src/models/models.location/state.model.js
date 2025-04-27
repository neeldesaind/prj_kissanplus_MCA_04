import mongoose from "mongoose";
const stateSchema = new mongoose.Schema({
    state_id:{
        type: Number,
        required: true
    },
    state_name:{
        type: String,
        required: true
    }
}, {timestamps: true});
const State = mongoose.model('State', stateSchema);
export default State;