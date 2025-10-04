
import express from "express";
import { 
  createPost, 
  getAllPosts, 
  getPostById, 
  updatePostsAuthorInfo ,
  getPostsByUser 
} from "../controllers/postController.js";
import { upload } from "../utils/upload.js";
import { checkJwt } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create post
router.post("/", checkJwt, upload.single("media"), createPost);

// Get all posts
router.get("/", getAllPosts);

// Get single post by ID
router.get("/:id", getPostById);

// ✅ Update all posts' author info when user updates profile
router.patch("/update-author/:auth0Id", checkJwt, updatePostsAuthorInfo);

router.get("/user/:auth0Id", getPostsByUser);

export default router;

