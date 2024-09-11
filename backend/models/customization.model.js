import mongoose from "mongoose";

const customizationSchema = new mongoose.Schema({
    cusCategory: {
        type: String,
    },
    cusName: {
        type: String,
    },
    extraprice: {
        type: Number,
    }
})

const Customization = mongoose.model('Customization', customizationSchema);

export default Customization;