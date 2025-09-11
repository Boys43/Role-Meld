import { saveJob } from "../controllers/jobsController.js";
import userAuth from "../middlewares/userAuth.js";
import { checkProfileScore, getUserData, updateProfile, updateProfilePicture } from "../controllers/userController.js";
import express from 'express'
import multer from "multer";
import path from 'path'

const userRouter = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

userRouter.post("/savejob", userAuth, saveJob);
userRouter.get('/data', userAuth, getUserData);
userRouter.post('/updateprofile', userAuth, updateProfile)
userRouter.get('/checkprofilescore', userAuth, checkProfileScore)
userRouter.post('/updateprofilepicture', userAuth, upload.single('profilePicture'), updateProfilePicture)

export default userRouter;