import express from "express";
import { createPost } from "../controllers/postController.js";
import { upload } from "../utils/upload.js";
import { checkJwt } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST route with Auth0 validation and file upload
router.post("/", checkJwt, upload.single("media"), createPost);

// GET route (no auth required, optional)
router.get("/", async (req, res) => {
  res.send("GET posts route - can implement later");
});

export default router;
