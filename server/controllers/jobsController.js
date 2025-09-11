// import jobsModel from '../models/jobsModel.js';
// import authModel from '../models/authModels.js';

import userProfileModel from "../models/userProfileModel.js";

export const addJob = async (req, res) => {
    const { jobData } = req.body;

    if (!jobData) {
        return res.json({ success: false, message: "Missing Details" });
    }

    try {
        const jobs = new jobsModel({
            ...jobData,
            postedBy: req.user._id,
            postedAt: new Date(),
        })
        await jobs.save()

        return res.json({success: true, message: "Job Listed"});
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const saveJob = async (req, res) => {
    const { savedJobs } = req.body;
    const { _id: userId } = req.user

    try {
        const user = await userProfileModel.findOne({ authId: userId })

        if (!user) {
            return res.json({ success: false, message: "Profile Not Found" })
        }

        user.savedJobs = savedJobs;
        await user.save()
        return res.json({ success: true, message: "Job Saved" })
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}