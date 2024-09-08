import express from 'express';
import {getProfile, refreshToken, signin, signout, signup} from "../controllers/auth.controllers.js";
import {protectRoute} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/sign-up', signup);
router.post('/sign-in', signin);
router.post('/sign-out', signout);
router.post('/refresh-token', refreshToken);
router.post('/profile', getProfile)

export default router;