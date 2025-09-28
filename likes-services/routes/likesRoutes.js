// routes/likesRoutes.js
import express from "express";
import { addLike, removeLike, getLikes } from "../controllers/likesController.js";


const router = express.Router();

router.post("/", addLike);          // Add a like
router.delete("/", removeLike);     // Remove a like
router.get("/:postId", getLikes);   // Get all likes for a post

export default router;
