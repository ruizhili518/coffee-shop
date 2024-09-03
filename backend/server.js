//Packages
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Routes
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';

// Tools
import {connectDB} from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//Middle wares
app.use(express.json()); // Parse request body.
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/product",productRoutes);


app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}...`);
    connectDB();
});