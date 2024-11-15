import express from 'express';
import {editProfileName, getProfile, refreshToken, signin, signout, signup} from "../controllers/auth.controllers.js";

const router = express.Router();

router.post('/sign-up', signup);
router.post('/sign-in', signin);
router.post('/sign-out', signout);
router.post('/refresh-token', refreshToken);
router.post('/profile', getProfile);
router.post('/profile-name', editProfileName)

export default router;