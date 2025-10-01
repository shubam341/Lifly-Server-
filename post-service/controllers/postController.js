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
 // ✅ you were missing this import
import fetch from "node-fetch";

// Helper to normalize media URLs
const buildMediaUrl = (mediaUrl) => {
  if (!mediaUrl) return null;
  if (mediaUrl.startsWith("http")) return mediaUrl;
  return `${process.env.BASE_URL}/uploads/${mediaUrl}`;
};

// CREATE POST
export const createPost = async (req, res) => {
  try {
    const auth0Id = req.auth?.sub;
    if (!auth0Id) return res.status(401).json({ message: "Unauthorized" });

    if (!process.env.USER_SERVICE_URL) {
      throw new Error("USER_SERVICE_URL is not defined in .env");
    }

    // Fetch user info
    const userServiceUrl = `${process.env.USER_SERVICE_URL}/${auth0Id}`;
    const userRes = await fetch(userServiceUrl);
    if (!userRes.ok) {
      const errorText = await userRes.text();
      return res.status(userRes.status).json({ message: errorText });
    }

    const userData = await userRes.json();
    const authorName = userData.name || userData.username || "Unknown";
    const authorAvatar = userData.avatar
      ? buildMediaUrl(userData.avatar)
      : `${process.env.BASE_URL}/uploads/default.png`;

    const { title, category, bio } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ message: "Media file is required" });

    if (!process.env.BASE_URL) {
      throw new Error("BASE_URL is not defined in .env");
    }

    const mediaUrl = `${process.env.BASE_URL}/uploads/${file.filename}`;

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
    let posts = await Post.find().sort({ createdAt: -1 }).lean();
    posts = posts.map(post => ({
      ...post,
      mediaUrl: buildMediaUrl(post.mediaUrl),
      authorAvatar: buildMediaUrl(post.authorAvatar),
    }));
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
    let post = await Post.findById(postId).lean();

    if (!post) return res.status(404).json({ message: "Post not found" });

    post.mediaUrl = buildMediaUrl(post.mediaUrl);
    post.authorAvatar = buildMediaUrl(post.authorAvatar);

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE ALL POSTS AUTHOR INFO
export const updatePostsAuthorInfo = async (req, res) => {
  try {
    const { auth0Id } = req.params;
    const { name, avatar } = req.body;

    if (!auth0Id) return res.status(400).json({ message: "auth0Id missing" });

    await Post.updateMany(
      { authorId: auth0Id },
      {
        authorName: name,
        authorAvatar: avatar ? buildMediaUrl(avatar) : `${process.env.BASE_URL}/uploads/default.png`
      }
    );

    res.json({ message: "Posts author info updated successfully" });
  } catch (err) {
    console.error("Error updating posts:", err);
    res.status(500).json({ message: "Failed to update posts" });
  }
};

// GET USER PROFILE + POSTS
export const getUserProfile = async (req, res) => {
  try {
    const { auth0Id } = req.params;
    if (!auth0Id) return res.status(400).json({ message: "auth0Id missing" });

    const user = await User.findOne({ auth0Id }).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    let posts = await Post.find({ authorId: auth0Id }).sort({ createdAt: -1 }).lean();
    posts = posts.map(post => ({
      ...post,
      mediaUrl: buildMediaUrl(post.mediaUrl),
      authorAvatar: buildMediaUrl(post.authorAvatar),
    }));

    const profile = {
      ...user,
      avatar: buildMediaUrl(user.avatar),
      posts,
    };

    res.json(profile);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};
