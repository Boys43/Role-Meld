import express from "express";
import userAuth from "../middlewares/userAuth.js";
import { getAllApplications, updateApplcationStatus } from "../controllers/applicationController.js";

const applicationRouter = express.Router();

applicationRouter.get("/appliedjobs", userAuth, getAllApplications )
applicationRouter.post('/update-status', userAuth, updateApplcationStatus )

export default applicationRouter;