import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// Import your microservices
import authApp from "./auth-service/src/index.js";
import userService, { connectDB } from "./user-service/src/index.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------- CORS SETUP -------------------
const allowedOrigins = [
  "http://localhost:5173",             // local dev
  "https://lifly-client.vercel.app"   // deployed frontend
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server or curl requests
    if (!allowedOrigins.includes(origin)) {
      return callback(new Error(`CORS policy: Origin not allowed - ${origin}`), false);
    }
    return callback(null, true);
  },
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Handle preflight OPTIONS requests
app.options("*", cors({
  origin: allowedOrigins,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));

// ------------------- MIDDLEWARE -------------------
app.use(express.json());

// ------------------- MICRO SERVICES -------------------
// Mount Auth service
app.use("/auth", authApp);

// Connect DB and mount User service
connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection failed:", err));

app.use("/api/users", userService);

// ------------------- SERVE REACT FRONTEND -------------------
app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// ------------------- START SERVER -------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Root server running on port ${PORT}`);
});
