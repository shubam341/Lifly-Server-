// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { fileURLToPath } from "url";
// import path from "path";

// dotenv.config(); // root .env


// dotenv.config({ path: path.join(process.cwd(), "post-service/.env") });

// // Import your microservices
// import authApp from "./auth-service/src/index.js";
// import userService, { connectDB as connectUserDB } from "./user-service/src/index.js";
// import postServiceApp, { connectDB as connectPostDB } from "./post-service/server.js";
// ;

// const app = express();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


// const allowedOrigins = [
//   "http://localhost:5173",             
//   "https://lifly-client.vercel.app"   
// ];

// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin) return callback(null, true);
//     if (!allowedOrigins.includes(origin)) {
//       return callback(new Error(`CORS policy: Origin not allowed - ${origin}`), false);
//     }
//     return callback(null, true);
//   },
//   methods: ["GET","POST","PUT","DELETE","OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true
// }));

// app.options("*", cors({
//   origin: allowedOrigins,
//   methods: ["GET","POST","PUT","DELETE","OPTIONS"],
//   allowedHeaders: ["Content-Type","Authorization"],
//   credentials: true
// }));


// app.use(express.json());


// app.use("/auth", authApp);

// // User service
// connectUserDB()
//   .then(() => console.log("User Service MongoDB connected"))
//   .catch(err => console.error("User Service DB connection failed:", err));
// app.use("/api/users", userService);

// // Post service
// connectPostDB()
//   .then(() => console.log("Post Service MongoDB connected"))
//   .catch(err => console.error("Post Service DB connection failed:", err));
// app.use("/api/posts", postServiceApp);


// app.use(express.static(path.join(__dirname, "build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Root server running on port ${PORT}`);
// });

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config(); // root .env
dotenv.config({ path: path.join(process.cwd(), "post-service/.env") });

// Import your microservices
import authApp from "./auth-service/src/index.js";
import userService, { connectDB as connectUserDB } from "./user-service/src/index.js";
import postServiceApp, { connectDB as connectPostDB } from "./post-service/server.js";
import likesServiceApp, { connectDB as connectLikesDB } from "./likes-services/server.js"; // ✅ Likes service

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  "http://localhost:5173",
  "https://lifly-client.vercel.app"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (!allowedOrigins.includes(origin)) {
      return callback(new Error(`CORS policy: Origin not allowed - ${origin}`), false);
    }
    return callback(null, true);
  },
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("*", cors({
  origin: allowedOrigins,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));

app.use(express.json());

// Auth service
app.use("/auth", authApp);

// User service
connectUserDB()
  .then(() => console.log("User Service MongoDB connected"))
  .catch(err => console.error("User Service DB connection failed:", err));
app.use("/api/users", userService);

// Post service
connectPostDB()
  .then(() => console.log("Post Service MongoDB connected"))
  .catch(err => console.error("Post Service DB connection failed:", err));
app.use("/api/posts", postServiceApp);

// ✅ Likes service
connectLikesDB()
  .then(() => console.log("Likes Service MongoDB connected"))
  .catch(err => console.error("Likes Service DB connection failed:", err));
app.use("/api/likes", likesServiceApp);

app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Root server running on port ${PORT}`);
});
