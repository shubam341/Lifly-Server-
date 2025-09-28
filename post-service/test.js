import express from "express";
const app = express();
app.get("/test", (req, res) => res.send("Test route works"));
app.listen(5005, () => console.log("Server running on 5005"));
