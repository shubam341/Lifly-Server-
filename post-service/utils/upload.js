// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // make sure uploads/ folder exists
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, Date.now() + ext);
//   },
// });

// export const upload = multer({
//   storage,
//   limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only images and videos are allowed"));
//     }
//   },
// });


import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../cloudinary.js"; // go up one folder


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "lifly_uploads", // Cloudinary folder
    allowed_formats: ["jpg", "jpeg", "png", "mp4"],
    resource_type: "auto", // auto-detects images or videos
  },
});

export const upload = multer({ storage });
