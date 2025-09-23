import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url"; // ✅ Make sure this line exists
import path from "path"; // ✅ Import path

// Import your microservices
import authApp, { checkJwt } from "./auth-service/src/index.js";
import userService, { connectDB } from "./user-service/src/index.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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


// Serve static frontend build
app.use(express.static(path.join(__dirname, "build")));

// For all other routes, send index.html so React Router works
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});


// ------------------- START SERVER -------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Root server running on port ${PORT}`);
});
