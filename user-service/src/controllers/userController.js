import User from "../models/User.js";

// GET profile
export const getUserProfile = async (req, res) => {
  try {
    const { auth0Id } = req.params;
    if (!auth0Id) return res.status(400).json({ message: "auth0Id missing" });

    // ✅ Create or return existing user safely
    const user = await User.findOneAndUpdate(
      { auth0Id },
      { $setOnInsert: { email: `${auth0Id}@placeholder.com` } }, // only set email if new
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
    const { name, bio, profilePicture, email } = req.body;

    if (!auth0Id) return res.status(400).json({ message: "auth0Id missing" });

    // ✅ Prevent duplicate email: if email is empty, keep old or generate placeholder
    const updatedUser = await User.findOneAndUpdate(
      { auth0Id },
      {
        name,
        bio,
        profilePicture,
        email: email || `${auth0Id}@placeholder.com`,
      },
      { new: true, upsert: true }
    );

    res.json(updatedUser);
  } catch (err) {
    console.error("MongoDB error in updateUserProfile:", err);
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
};




// // ✅ GET profile (create if missing)
// // GET profile (create if missing)
// export const getUserProfile = async (req, res) => {
//   try {
//     const { auth0Id } = req.params;
//     if (!auth0Id) return res.status(400).json({ message: "auth0Id missing" });

//     // Try to find existing user
//     let user = await User.findOne({ auth0Id });

//     // If user doesn't exist, create with defaults
//     if (!user) {
//       user = new User({
//         auth0Id,
//         email: `${auth0Id}@placeholder.com`,
//         name: "New User", // default name for new user
//       });
//       await user.save();
//     }

//     res.json(user);
//   } catch (err) {
//     console.error("MongoDB error in getUserProfile:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };


// // UPDATE profile
// export const updateUserProfile = async (req, res) => {
//   try {
//     const { auth0Id } = req.params;
//     if (!auth0Id) return res.status(400).json({ message: "auth0Id missing" });

//     const { name, bio, profilePicture, email, userId } = req.body;

// const updates = {};

//     if (name && name.trim() !== "") updates.name = name; 
//     if (bio !== undefined) updates.bio = bio;
//     if (profilePicture !== undefined) updates.profilePicture = profilePicture;
//     if (userId !== undefined) updates.userId = userId;
//     if (email && email.trim() !== "") updates.email = email;

//     const updatedUser = await User.findOneAndUpdate(
//       { auth0Id },
//       { $set: updates },
//       { new: true }
//     );

//     res.json(updatedUser);
//   } catch (err) {
//     console.error("MongoDB error in updateUserProfile:", err);
//     res.status(500).json({ message: "Failed to update profile", error: err.message });
//   }
// };
