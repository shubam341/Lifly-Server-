import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authApp, { checkJwt } from "./auth-service/src/index.js";
import userService, { connectDB } from "./user-service/src/index.js";

dotenv.config();
const app = express();

// CORS setup for fronten
app.use(cors({
  origin: "http://localhost:5173",
    origin: "https://lifly-client.vercel.app",
  credentials: true,
}));

app.use(express.json());




// Mount auth-service routes
app.use("/auth", authApp);

// Mount user-service routes with JWT verification
app.use("/api/users", checkJwt, userService);

// Connect to MongoDB and start server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("❌ DB connection failed:", err);
});
