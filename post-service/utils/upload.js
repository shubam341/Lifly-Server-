
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
