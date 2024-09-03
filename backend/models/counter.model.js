import mongoose from 'mongoose'

// Define counter schema
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },  // sequence name，e.g.: 'userId'
    seq: { type: Number, start: 1000 }       // counter
});

// Create a model
const Counter = mongoose.model('Counter', counterSchema);

export default Counter;