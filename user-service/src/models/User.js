// user-service/src/models/User.js
import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  userId: { type: String, default: "" },
  name: { type: String, default: "" },    // changed
  email: { type: String, default: "" },   // changed
  bio: { type: String, default: "" },
  profilePicture: { type: String, default: "" },
}, { timestamps: true });


const User = mongoose.model("User", userSchema);

export default User;
