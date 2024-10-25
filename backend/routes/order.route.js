import express from "express";
import {createCheckoutSession} from "../controllers/order.controllers.js";

const router = express.Router();

router.post("/create-checkout-session",createCheckoutSession);

export default router;