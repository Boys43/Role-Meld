import jobsModel from '../models/jobsModel.js';
import recruiterProfileModel from '../models/recruiterProfileModel.js';
// import authModel from '../models/authModels.js';

import userProfileModel from "../models/userProfileModel.js";

export const addJob = async (req, res) => {
    const { jobData } = req.body;
    const { _id: userId } = req.user

    if (!jobData) {
        return res.status(400).json({ success: false, message: "Missing Details" });
    }

    try {
        const job = new jobsModel({
            ...jobData,
            postedBy: req.user._id,
            postedAt: new Date(),
            applicationDeadline: new Date(Date.now() + jobData.applicationDeadline * 24 * 60 * 60 * 1000),
        });
        await job.save();

        const recruiter = await recruiterProfileModel.findOne({ authId: userId });

        if (!recruiter) {
            return res.status(404).json({ success: false, message: "User Not Found" });
        }

        if (!recruiter.sentJobs.includes(job._id)) {
            recruiter.sentJobs.push(job._id);
        }
        await recruiter.save();

        return res.status(201).json({ success: true, message: "Job Listed" });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message,
                errors: Object.keys(error.errors).map((key) => `${key} is required`),
            });
        }

        return res.status(500).json({ success: false, message: error.message });
    }
};


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
        return res.json({ success: true })
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const getJob = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.json({ success: false, message: "Job Id Required" });
    }

    try {
        const job = await jobsModel.findById(id);

        if (!job) {
            return res.json({ success: false, message: "Job Not Found, Expired" })
        }

        return res.json({ success: true, job });
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const getAllJobs = async (req, res) => {
    try {
        const jobs = await jobsModel.find();

        if (!jobs || jobs.length < 0) {
            return res.json({ success: false, message: "No Jobs Found" })
        }

        return res.json({ success: true, jobs })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const getCompanyJobs = async (req, res) => {
    const { company } = req.body;

    if (!company) {
        return res.json({ success: false, message: "No Company Found" });
    }

    try {
        const companyJobs = await jobsModel.find({ company: company })

        if (!companyJobs || companyJobs.length <= 0) {
            return res.json({ success: false, message: "No Jobs Found" });
        }

        return res.json({ success: true, companyJobs });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const getSavedJobs = async (req, res) => {
    const { savedJobsIds } = req.body;

    if (!savedJobsIds) {
        return res.json({ success: false, message: "Missing Details" });
    }

    try {
        const getSavedJobs = await jobsModel.find({ _id: { $in: savedJobsIds } });

        if (!getSavedJobs || getSavedJobs.length <= 0) {
            return res.json({ success: false, message: "No Saved Jobs" })
        }

        return res.json({ success: true, getSavedJobs })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}