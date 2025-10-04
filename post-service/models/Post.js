import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  bio: { type: String },
  mediaUrl: { type: String, required: true },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  authorAvatar: { type: String, required: true },
   likes: { type: Number, default: 0 },           // ← Add this
  // comments: { type: Number, default: 0 }, 
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Post", postSchema);
