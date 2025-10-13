import express from "express";
import userAuth from "../middlewares/userAuth.js";
import { createBlog, editBlog, getAllBlogs, getBlog, removeBlog } from "../controllers/blogsController.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const blogRouter = express.Router();

// ✅ Configure Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: "blogs",
        resource_type: file.fieldname === "resume" ? "raw" : "image",
        allowed_formats: file.fieldname === "resume" ? ["pdf", "doc", "docx"] : ["jpg", "jpeg", "png", "webp"],
        // No transformations = fastest possible upload
    }),
});

const upload = multer({ storage });

// ✅ Routes
blogRouter.post("/createblog", userAuth, upload.single("coverImage"), createBlog);
blogRouter.get("/getallblogs", getAllBlogs);
blogRouter.post("/getblog", getBlog);
blogRouter.post("/removeblog", removeBlog);
blogRouter.post("/editblog", editBlog);

export default blogRouter;