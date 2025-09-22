import User from "../models/User.js";

// GET profile
export const getUserProfile = async (req, res) => {
  try {
    const { auth0Id } = req.params;
    if (!auth0Id) return res.status(400).json({ message: "auth0Id missing" });

    let user = await User.findOne({ auth0Id });
    if (!user) user = await User.create({ auth0Id });

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
    const { name, bio, profilePicture } = req.body;

    if (!auth0Id) return res.status(400).json({ message: "auth0Id missing" });

    const updatedUser = await User.findOneAndUpdate(
      { auth0Id },
      { name, bio, profilePicture },
      { new: true, upsert: true }
    );

    res.json(updatedUser);
  } catch (err) {
    console.error("MongoDB error in updateUserProfile:", err);
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
};
