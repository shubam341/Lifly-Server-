// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import likesRoutes from "./routes/likesRoutes.js";


// dotenv.config();
// const app = express();

// app.use(express.json());

// // Routes
// app.use("/api/likes", likesRoutes);

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log("MongoDB connected"))
// .catch((err) => console.log("MongoDB connection error:", err));

// const PORT = process.env.PORT || 5002;
// app.listen(PORT, () => console.log(`Likes Service running on port ${PORT}`));

// likes-service/server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import likesRoutes from "./routes/likesRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/", likesRoutes);

// ✅ Export DB connection (instead of connecting directly here)
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Likes Service MongoDB connected");
  } catch (err) {
    console.error("❌ Likes Service DB connection failed:", err);
  }
};

// ✅ Export app
export default app;
