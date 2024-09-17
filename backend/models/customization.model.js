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

export default customizationSchema;