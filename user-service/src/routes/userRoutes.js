import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/:auth0Id", getUserProfile);
router.put("/:auth0Id", updateUserProfile);

export default router;
