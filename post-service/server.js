import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import postRoutes from "./routes/postRoutes.js";
import path from "path";
import fs from "fs";

dotenv.config();

const app = express();


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists in ROOT
const uploadsPath = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log("Uploads directory created at:", uploadsPath);
}

// Note: We DO NOT serve /uploads here, the root server serves it

// Routes
app.use("/", postRoutes);

// Function to connect to MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Post Service MongoDB connected");
  } catch (err) {
    console.error("Post Service DB connection error:", err);
    throw err;
  }
};

// Export the Express app
export default app;
