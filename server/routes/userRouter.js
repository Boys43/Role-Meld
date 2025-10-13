import { saveJob } from "../controllers/jobsController.js";
import userAuth from "../middlewares/userAuth.js";
import {
  applyJob,
  checkProfileScore,
  fetchApplicants,
  getUserData,
  updateProfile,
  updateProfilePicture,
  updateResume,
  getAllRecruiters,
  getAllUsers,
  followUnfollowAccount,
  getCompanyDetails,
  updateBanner,
  followedAccountsDetails,
} from "../controllers/userController.js";
import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const userRouter = express.Router();

/* ------------------ 🧩 Cloudinary + Multer Config ------------------ */
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isResume = file.fieldname === "resume";
    return {
      folder: "users",
      resource_type: isResume ? "raw" : "image",
      allowed_formats: isResume
        ? ["pdf", "doc", "docx"]
        : ["jpg", "png", "jpeg", "webp"],
      transformation: !isResume
        ? [{ width: 800, height: 600, crop: "limit" }]
        : undefined,
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/* ------------------ 🔐 Routes ------------------ */

// User data & profile
userRouter.get("/data", userAuth, getUserData);
userRouter.post("/updateprofile", userAuth, updateProfile);
userRouter.get("/checkprofilescore", userAuth, checkProfileScore);

// File uploads
userRouter.post("/updateresume", userAuth, upload.single("resume"), updateResume);
userRouter.post("/updateprofilepicture", userAuth, upload.single("profilePicture"), updateProfilePicture);
userRouter.post("/updatebanner", userAuth, upload.single("banner"), updateBanner);

// Jobs
userRouter.post("/savejob", userAuth, saveJob);
userRouter.post("/applyjob", userAuth, applyJob);
userRouter.get("/fetchapplicants", userAuth, fetchApplicants);

// Users & recruiters
userRouter.get("/allusers", userAuth, getAllUsers);
userRouter.get("/allrecruiters", userAuth, getAllRecruiters);

// Social & company
userRouter.post("/follow-unfollow-acc", userAuth, followUnfollowAccount);
userRouter.post("/getcompanydetails", userAuth, getCompanyDetails);
userRouter.get("/followedaccounts", userAuth, followedAccountsDetails);

export default userRouter;