import express from "express";
import {checkSuccess, createCheckoutSession} from "../controllers/order.controllers.js";

const router = express.Router();

router.post("/create-checkout-session",createCheckoutSession);
router.post("/check-success",checkSuccess);

export default router;