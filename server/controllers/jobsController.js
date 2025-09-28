import applicationModel from '../models/applicationModel.js';
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
            postedBy: userId,
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
        const jobs = await jobsModel.find().populate('postedBy', 'name email');

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
        const companyJobs = await jobsModel.find({ company: company, isActive: true });

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
        const getSavedJobs = await jobsModel.find({ _id: { $in: savedJobsIds }, isActive: true });

        if (!getSavedJobs || getSavedJobs.length <= 0) {
            return res.json({ success: false, message: "No Saved Jobs" })
        }

        return res.json({ success: true, getSavedJobs })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const updateJobStatus = async (req, res) => {
    const { jobId, status } = req.body;

    if (!jobId || !status) {
        return res.status(400).json({ success: false, message: "Missing Details" });
    }

    try {
        const job = await jobsModel.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job Not Found" });
        }

        job.approved = status;
        await job.save();

        return res.status(200).json({ success: true, message: "Job Status Updated" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const getApprovedJobs = async (req, res) => {
    try {
        const jobs = await jobsModel.find({ approved: "approved", isActive: true });

        console.log(jobs);

        const categorySet = new Set(jobs.map(job => job.category));
        console.log(categorySet);

        return res.json({ success: true, jobs, categorySet: [...categorySet] });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const getPendingJobs = async (req, res) => {
    try {
        const jobs = await jobsModel.find({ approved: "pending", isActive: true });
        return res.json({ success: true, jobs });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const getActiveJobs = async (req, res) => {
    try {
        const result = await jobsModel.updateMany(
            { applicationDeadline: { $lt: new Date() } },
            { $set: { isActive: false } }
        );
    } catch (error) {

    }
}

export const searchJob = async (req, res) => {
    try {
        const { search } = req.body;

        // Search for approved jobs matching title (case-insensitive)
        const approvedJobs = await jobsModel.find({
            title: { $regex: search, $options: "i" },
            approved: "approved",
            isActive: true
        });

        // Get unique categories of matched jobs
        const categorySet = new Set(approvedJobs.map(job => job.category));

        const approvedCategoryJobs = await jobsModel.find({
            category: { $in: [...categorySet] },
            approved: "approved",
            isActive: true
        })

        return res.json({
            success: true,
            categorySet: [...categorySet],
            approvedCategoryJobs
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getCategoryJobs = async (req, res) => {
    try {
        const { category } = req.body;

        const approvedCategoryJobs = await jobsModel.find({
            category: category,
            approved: "approved",
            isActive: true
        });

        return res.json({
            success: true,
            approvedCategoryJobs
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Sponsored Jobs
export const getSponsoredJobs = async (req, res) => {
    try {
        const sponsoredJobs = await jobsModel.find({
            sponsored: true,
            approved: "approved",
            isActive: true
        });

        return res.status(200).json({
            success: true,
            sponsoredJobs
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Remove Jobs
export const removeJob = async (req, res) => {
    const { jobId } = req.body;

    if (!jobId) {
        return res.status(400).json({ success: false, message: "Job ID is required" });
    }
    try {
        const job = await jobsModel.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        await jobsModel.findByIdAndDelete(jobId);

        return res.status(200).json({ success: true, message: "Job removed successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}