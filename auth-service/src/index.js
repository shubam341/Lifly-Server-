
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
