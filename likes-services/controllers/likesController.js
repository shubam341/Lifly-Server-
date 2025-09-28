import Like from "../models/Like.js";

// Add a like
export const addLike = async (req, res) => {
  const { postId, userId } = req.body;

  if (!postId || !userId) return res.status(400).json({ message: "postId and userId are required" });

  try {
    const like = new Like({ postId, userId });
    await like.save();
    res.status(201).json({ message: "Post liked successfully", like });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "User has already liked this post" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove a like
export const removeLike = async (req, res) => {
  const { postId, userId } = req.body;

  if (!postId || !userId) return res.status(400).json({ message: "postId and userId are required" });

  try {
    const deleted = await Like.findOneAndDelete({ postId, userId });
    if (!deleted) return res.status(404).json({ message: "Like not found" });

    res.status(200).json({ message: "Like removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get likes for a post
export const getLikes = async (req, res) => {
  const { postId } = req.params;

  try {
    const likes = await Like.find({ postId });
    res.status(200).json({ count: likes.length, likes });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
