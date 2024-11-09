import express from "express";
import {
    changeOrderStatus,
    checkSuccess,
    createCheckoutSession,
    getOrderHistory
} from "../controllers/order.controllers.js";

const router = express.Router();

router.post("/create-checkout-session",createCheckoutSession);
router.post("/check-success",checkSuccess);
router.post("/get-orders",getOrderHistory);
router.post("/change-order-status",changeOrderStatus);

export default router;