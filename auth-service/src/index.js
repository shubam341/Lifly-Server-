// import express from "express";
// import cors from "cors";
// import * as dotenv from "dotenv";
// import { expressjwt } from "express-jwt";
// import jwks from "jwks-rsa";

// // ✅ Load .env variables
// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ✅ Debug: check env variables
// console.log("AUTH0_DOMAIN:", process.env.AUTH0_DOMAIN);
// console.log("AUTH0_AUDIENCE:", process.env.AUTH0_AUDIENCE);

// // ✅ Middleware to check JWT from Auth0
// const checkJwt = expressjwt({
//   secret: jwks.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
//   }),
//   audience: process.env.AUTH0_AUDIENCE,
//   issuer: `https://${process.env.AUTH0_DOMAIN}/`,
//   algorithms: ["RS256"],
// });

// // ✅ Public route
// app.get("/public", (req, res) => {
//   res.json({ message: "Hello from public endpoint!" });
// });

// // ✅ Protected route
// app.get("/protected", checkJwt, (req, res) => {
//   try {
//     res.json({ message: "Hello from protected endpoint!", user: req.auth });
//   } catch (err) {
//     console.error("Protected route error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // ✅ Global error handler
// app.use((err, req, res, next) => {
//   if (err.name === "UnauthorizedError") {
//     return res.status(401).json({ error: "Invalid token" });
//   }
//   console.error("Global error:", err);
//   res.status(500).json({ error: "Something went wrong" });
// });

// // ✅ Start server
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`Auth service running on http://localhost:${PORT}`);
// });

// auth-service/src/index.js
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { expressjwt } from "express-jwt";
import jwks from "jwks-rsa";

dotenv.config();

const authApp = express();
authApp.use(cors());
authApp.use(express.json());

export const checkJwt = expressjwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
});

// Public route
authApp.get("/public", (req, res) => {
  res.json({ message: "Hello from public endpoint!" });
});

// Protected route
authApp.get("/protected", checkJwt, (req, res) => {
  res.json({ message: "Hello from protected endpoint!", user: req.auth });
});

// Global error handler
authApp.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") return res.status(401).json({ error: "Invalid token" });
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

export default authApp;
