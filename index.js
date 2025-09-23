import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import your microservices
import authApp, { checkJwt } from "./auth-service/src/index.js";
import userService, { connectDB } from "./user-service/src/index.js";

dotenv.config();

const app = express();

// ------------------- CORS SETUP -------------------
const allowedOrigins = [
  "http://localhost:5173",        // local dev
"https://lifly-ecommerce.onrender.com"
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy: This origin is not allowed - ${origin}`;
      return callback(new Error(msg), false);
    }

    return callback(null, true);
  },
  credentials: true,
}));

// ------------------- MIDDLEWARE -------------------
app.use(express.json());

// ------------------- ROUTES -------------------
// Mount Auth service (example: /auth)
app.use("/auth", authApp);

// Connect DB for user service
connectDB().then(() => console.log("MongoDB connected"));

// Mount User service (example: /api/users)
app.use("/api/users", userService);

// ------------------- START SERVER -------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Root server running on port ${PORT}`);
});
