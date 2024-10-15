import mongoose from "mongoose";

// Define points schema
const pointsSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ["get","redeem"],
        required: true
    },
    ratio: {
        type: Number,
        required: true
    }
});

const Points = mongoose.model('Points',pointsSchema);

export default Points;