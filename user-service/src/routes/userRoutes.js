import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/userController.js";

import { upload } from "../middlewares/multer.js"; // import your multer setup

const router = express.Router();

// GET user profile
router.get("/:auth0Id", getUserProfile);

router.put("/:auth0Id", upload.single("avatar"), updateUserProfile);

export default router;
