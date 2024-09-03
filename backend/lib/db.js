import mongoose from 'mongoose';
import Counter from "../models/counter.model.js";

// Connect server to MongoDB
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err){
        console.log('Error connecting to MONGODB',err);
        process.exit(1);
    }
    initializeCounter().catch((err) => console.error(err));
}

// Initialize userId, starting from 1000.
const initializeCounter = async () => {
    const userCounter = await Counter.findById('userId');
    if (!userCounter) {
        const newCounter = new Counter({
            _id: 'userId',
            seq: 1000
        });
        await newCounter.save();
        console.log('Counter initialized to 1000.');
    }else{
        console.log('Counter already exists:', userCounter);
    }
}
