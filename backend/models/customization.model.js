import mongoose from "mongoose";

const customizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    detail: {
        type: Array,
        default: [] // Detail name and extra price.
    }
})

const Customization = mongoose.model('Customization', customizationSchema);

export default Customization;