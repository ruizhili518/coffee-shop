//Packages
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Routes
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import pointsRoutes from './routes/points.route.js';
import orderRoutes from './routes/order.route.js';
import cors from 'cors';

// Tools
import {connectDB} from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//Middle wares
app.use(cors({
    origin: true, // Allow all origins
    credentials: true
})); // Allow CORS.
app.use(express.json()); // Parse request body.
app.use(cookieParser());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/product",productRoutes);
app.use("/api/points",pointsRoutes);
app.use("/api/order",orderRoutes);

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}...`);
    connectDB();
});