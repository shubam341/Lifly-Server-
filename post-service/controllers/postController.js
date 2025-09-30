// import Post from "../models/Post.js";
// import fetch from "node-fetch";

// export const createPost = async (req, res) => {
//   try {
//     // 1️⃣ Auth0 validation
//     const auth0Id = req.auth?.sub;
//     if (!auth0Id) return res.status(401).json({ message: "Unauthorized" });

//     // 2️⃣ Validate environment variable
//     if (!process.env.USER_SERVICE_URL) {
//       throw new Error("USER_SERVICE_URL is not defined in .env");
//     }

//     // 3️⃣ Fetch user info from User Service
//     const userServiceUrl = `${process.env.USER_SERVICE_URL}/${auth0Id}`;
//     console.log("Fetching user info from:", userServiceUrl);

//     const userRes = await fetch(userServiceUrl);
//     if (!userRes.ok) {
//       const errorText = await userRes.text();
//       return res.status(userRes.status).json({ message: errorText });
//     }

//     const userData = await userRes.json();
//     const authorName = userData.name || userData.username || "Unknown";
//   const authorAvatar = userData.avatar || `${process.env.BASE_URL}/uploads/default.png`;


  
//     const { title, category, bio } = req.body;
//     const file = req.file;
//     if (!file) return res.status(400).json({ message: "Media file is required" });

//     // 5️ Use BASE_URL from .env to create absolute media URL
//     if (!process.env.BASE_URL) {
//       throw new Error("BASE_URL is not defined in .env");
//     }
//     const mediaUrl = `${process.env.BASE_URL}/uploads/${file.filename}`;

//     // Save post to MongoDB
//     const newPost = new Post({
//       title,
//       category,
//       bio,
//       mediaUrl,
//       authorId: auth0Id,
//       authorName,
//       authorAvatar,
//     });

//     await newPost.save();
//     res.status(201).json(newPost);

//   } catch (err) {
//     console.error("Post creation error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };



// // 📌 Get all posts
// export const getAllPosts = async (req, res) => {
//   try {
//     const posts = await Post.find().sort({ createdAt: -1 }); // latest first
//     res.status(200).json(posts);
//   } catch (err) {
//     console.error("Error fetching posts:", err);
//     res.status(500).json({ message: err.message });
//   }
// };


// export const getPostById = async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const post = await Post.findById(postId);

//     if (!post) return res.status(404).json({ message: "Post not found" });

//     res.json(post);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };



import Post from "../models/Post.js";
import fetch from "node-fetch";

// CREATE POST
export const createPost = async (req, res) => {
  try {
    // 1️⃣ Auth0 validation
    const auth0Id = req.auth?.sub;
    if (!auth0Id) return res.status(401).json({ message: "Unauthorized" });

    // 2️⃣ Validate environment variable
    if (!process.env.USER_SERVICE_URL) {
      throw new Error("USER_SERVICE_URL is not defined in .env");
    }

    // 3️⃣ Fetch current user info from User Service
    const userServiceUrl = `${process.env.USER_SERVICE_URL}/${auth0Id}`;
    const userRes = await fetch(userServiceUrl);

    if (!userRes.ok) {
      const errorText = await userRes.text();
      return res.status(userRes.status).json({ message: errorText });
    }

    const userData = await userRes.json();
    const authorName = userData.name || userData.username || "Unknown";
    const authorAvatar = userData.avatar
      ? `${process.env.BASE_URL}/uploads/${userData.avatar}`
      : `${process.env.BASE_URL}/uploads/default.png`;

    // 4️⃣ Get post data
    const { title, category, bio } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ message: "Media file is required" });

    if (!process.env.BASE_URL) {
      throw new Error("BASE_URL is not defined in .env");
    }
    const mediaUrl = `${process.env.BASE_URL}/uploads/${file.filename}`;

    // 5️⃣ Save post with current user info
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

// GET ALL POSTS
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET POST BY ID
export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE ALL POSTS AUTHOR INFO
// PATCH /api/posts/update-author/:auth0Id
export const updatePostsAuthorInfo = async (req, res) => {
  try {
    const { auth0Id } = req.params;
    const { name, avatar } = req.body;

    if (!auth0Id) return res.status(400).json({ message: "auth0Id missing" });

    await Post.updateMany(
      { authorId: auth0Id },
      {
        authorName: name,
        authorAvatar: avatar ? `${process.env.BASE_URL}/uploads/${avatar}` : `${process.env.BASE_URL}/uploads/default.png`
      }
    );

    res.json({ message: "Posts author info updated successfully" });
  } catch (err) {
    console.error("Error updating posts:", err);
    res.status(500).json({ message: "Failed to update posts" });
  }
};
