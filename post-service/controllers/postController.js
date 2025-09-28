import Post from "../models/Post.js";
import fetch from "node-fetch";

export const createPost = async (req, res) => {
  try {
    // 1️⃣ Auth0 validation
    const auth0Id = req.auth?.sub;
    if (!auth0Id) return res.status(401).json({ message: "Unauthorized" });

    // 2️⃣ Validate environment variable
    if (!process.env.USER_SERVICE_URL) {
      throw new Error("USER_SERVICE_URL is not defined in .env");
    }

    // 3️⃣ Fetch user info from User Service
    const userServiceUrl = `${process.env.USER_SERVICE_URL}/${auth0Id}`;
    console.log("Fetching user info from:", userServiceUrl);

    const userRes = await fetch(userServiceUrl);
    if (!userRes.ok) {
      const errorText = await userRes.text();
      return res.status(userRes.status).json({ message: errorText });
    }

    const userData = await userRes.json();
    const authorName = userData.name || userData.username || "Unknown";
  const authorAvatar = userData.avatar || `${process.env.BASE_URL}/uploads/default.png`;


  
    const { title, category, bio } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ message: "Media file is required" });

    // 5️ Use BASE_URL from .env to create absolute media URL
    if (!process.env.BASE_URL) {
      throw new Error("BASE_URL is not defined in .env");
    }
    const mediaUrl = `${process.env.BASE_URL}/uploads/${file.filename}`;

    // Save post to MongoDB
    const newPost = new Post({
      title,
      category,
      bio,
      mediaUrl,
      authorId: auth0Id,
      authorName,
      authorAvatar,
    });

    await newPost.save();
    res.status(201).json(newPost);

  } catch (err) {
    console.error("Post creation error:", err);
    res.status(500).json({ message: err.message });
  }
};
