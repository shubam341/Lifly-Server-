import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload avatar to Cloudinary
const uploadAvatarToCloudinary = async (file) => {
  const result = await cloudinary.uploader.upload(file.path, {
    folder: "lifly_avatars",
    resource_type: "auto",
  });
  fs.unlinkSync(file.path); // remove local file
  return result.secure_url;
};

// GET profile
export const getUserProfile = async (req, res) => {
  try {
    const { auth0Id } = req.params;
    if (!auth0Id) return res.status(400).json({ message: "auth0Id missing" });

    const user = await User.findOneAndUpdate(
      { auth0Id },
      { $setOnInsert: { email: `${auth0Id}@placeholder.com` } },
      { new: true, upsert: true }
    );

    res.json(user);
  } catch (err) {
    console.error("MongoDB error in getUserProfile:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// UPDATE profile
export const updateUserProfile = async (req, res) => {
  try {
    const { auth0Id } = req.params;
    const { name, bio, email } = req.body;

    if (!auth0Id) return res.status(400).json({ message: "auth0Id missing" });

    let profilePicture;

    if (req.file) {
      console.log("File received:", req.file);
      profilePicture = await uploadAvatarToCloudinary(req.file);
      console.log("Uploaded avatar URL:", profilePicture);
    }

    const updates = {
      ...(name && { name }),
      ...(bio && { bio }),
      ...(email && { email }),
      ...(profilePicture && { profilePicture }),
    };

    const updatedUser = await User.findOneAndUpdate(
      { auth0Id },
      { $set: updates },
      { new: true, upsert: true }
    );

    res.json(updatedUser);
  } catch (err) {
    console.error("MongoDB error in updateUserProfile:", err);
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
};

