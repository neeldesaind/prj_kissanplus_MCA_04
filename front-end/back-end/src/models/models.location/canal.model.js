import mongoose from 'mongoose';
const canalSchema = new mongoose.Schema({
    canal_id:{
        type: Number,
        required: true
    },
    canal_name:{
        type: String,
        required: true
    },
    village_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Village',
        required: true
    }
})
const Canal = mongoose.model('Canal', canalSchema);
export default Canal;