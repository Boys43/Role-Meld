import recruiterProfileModel from "../models/recruiterProfileModel.js"
import userProfileModel from "../models/userProfileModel.js"
import authModel from "../models/authModels.js";
import jobsModel from "../models/jobsModel.js";
import applicationModel from "../models/applicationModel.js";


export const getAllUsers = async (req, res) => {
    try {
        const users = await userProfileModel.find({})
        return res.json({ success: true, users })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" })
    }
}

export const getAllRecruiters = async (req, res) => {
    try {
        const recruiters = await recruiterProfileModel.find({})
        return res.json({ success: true, recruiters })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" })
    }
}

// ---------- Utility function ----------
function calculateProfileScore(user) {
    let score = 0;

    // Resume uploaded (any one of work/edu/skills filled)
    if (user.resume && user.resume.trim() !== "") {
        score += 20;
    }

    // Profile picture
    if (user.profilePicture && user.profilePicture.trim() !== "") {
        score += 20;
    }

    // Headline
    if (user.headline && user.headline.trim() !== "") {
        score += 10;
    }

    if (user.phone && user.phone.trim() !== "") {
        score += 10;
    }

    if (user.portfolio && user.portfolio.trim() !== "") {
        score += 10;
    }

    if (user.city && user.city.trim() !== "") {
        score += 10;
    }

    if (user.address && user.address.trim() !== "") {
        score += 10;
    }

    if (user.postal && user.postal.trim() !== "") {
        score += 10;
    }

    return Math.min(score, 100);
}


export const getUserData = async (req, res) => {
    const userId = req.user._id;

    try {
        const authUser = await authModel.findById(userId);

        let profile;

        if (authUser.role === "user") {
            profile = await userProfileModel.findOne({ authId: userId });
        } else {
            profile = await recruiterProfileModel.findOne({ authId: userId });
        }

        if (!profile) {
            return res.json({ success: false, message: "Profile not found!" });
        }

        return res.json({
            success: true,
            profile,
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { updateUser } = req.body;

        if (!updateUser) {
            return res.json({ success: false, message: "Missing or invalid details" });
        }

        const authUser = await authModel.findById(userId);

        let updatedProfile;

        if (authUser.role === "user") {
            updatedProfile = await userProfileModel.findOneAndUpdate(
                { authId: userId },
                { $set: updateUser },
                { new: true }
            );

            if (!updatedProfile) {
                return res.json({ success: false, message: "User Not Found!" });
            }

            updatedProfile.profileScore = calculateProfileScore(updatedProfile);
            await updatedProfile.save();
        } else {
            updatedProfile = await recruiterProfileModel.findOneAndUpdate(
                { authId: userId },
                { $set: updateUser },   // 👈 directly update
                { new: true }
            );

            if (!updatedProfile) {
                return res.json({ success: false, message: "User Not Found!" });
            }

            await updatedProfile.save();
        }

        return res.json({
            success: true,
            message: "Profile updated successfully",
            profile: updatedProfile,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

export const checkProfileScore = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await userProfileModel.findOne({ authId: userId });

        if (!user) {
            return res.json({ success: false, message: "User Not Found!" });
        }

        user.profileScore = calculateProfileScore(user);
        await user.save();

        res.json({ success: true, profileScore: user.profileScore });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

export const updateProfilePicture = async (req, res) => {
    const userId = req.user._id;

    try {
        const authUser = await authModel.findOne(userId);

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        let user;

        if (authUser.role === "user") {
            user = await userProfileModel.findOne({ authId: userId })
        } else {
            user = await recruiterProfileModel.findOne({ authId: userId })
        }

        if (!user) {
            return res.status(404).json({ success: false, message: "User Not Found!" });
        }

        user.profileScore ? user.profileScore = calculateProfileScore(user) : ''

        user.profilePicture = req.file.filename;

        await user.save();

        res.json({
            success: true,
            message: "Profile picture updated successfully",
            user,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

export const updateBanner = async (req, res) => {
    const userId = req.user._id;

    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        let user = await recruiterProfileModel.findOne({ authId: userId })

        if (!user) {
            return res.status(404).json({ success: false, message: "User Not Found!" });
        }

        user.banner = req.file.filename;

        await user.save();

        res.json({
            success: true,
            message: "Banner updated successfully",
            user,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};


export const updateResume = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!req.file) {
            return res.json({ success: false, message: "No resume uploaded" });
        }

        const updatedProfile = await userProfileModel.findOneAndUpdate(
            { authId: userId },
            { $set: { resume: req.file.filename } }, // only save filename or path
            { new: true }
        );

        return res.json({
            success: true,
            message: "Resume uploaded successfully",
            profile: updatedProfile,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const applyJob = async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
        const { jobId, resume, coverLetter } = req.body;

        if (!jobId || !resume || !coverLetter) {
            return res.status(400).json({ success: false, message: "Missing job ID or applicant details" });
        }

        const job = await jobsModel.findById(jobId);

        if (!job) return res.status(404).json({ success: false, message: "Job not found" });

        job.applicants.push(req.user._id);
        await job.save();

        const application = new applicationModel({
            job: job._id,
            applicant: req.user._id,
            recruiter: job.postedBy,
            resume: resume,
            coverLetter: coverLetter,
        });
        await application.save();

        const user = await userProfileModel.findOne({ authId: userId });
        if (!user) {
            return res.status(404).json({ success: false, message: "User profile not found" });
        }

        user.appliedJobs.push(job._id);
        await user.save();

        res.json({ success: true, message: "Application submitted", application });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

export const fetchApplicants = async (req, res) => {
    try {
        const userId = req.user._id; // recruiter id

        if (!userId) {
            return res.json({ success: false, message: "User not found" });
        }

        // Find all applications for jobs posted by this recruiter
        const applications = await applicationModel.find({ recruiter: userId })
            .populate("applicant", "name email resume") // show applicant details
            .populate("job", "title description location"); // show job info

        return res.json({
            success: true,
            message: "Applicants fetched successfully",
            applicants: applications,
        });
    } catch (error) {
        console.error("Error fetching applicants:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};


export const followUnfollowAccount = async (req, res) => {
    const { companyId, followerId } = req.body;

    console.log('companyId:', companyId, 'followerId:', followerId);

    if (!companyId || !followerId) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        // Try to find company by authId first
        let company = await recruiterProfileModel.findOne({ authId: companyId });

        // If not found by authId, try by _id (in case companyId is the profile _id)
        if (!company) {
            company = await recruiterProfileModel.findById(companyId);
        }

        console.log('Found company:', company);

        if (!company) {
            return res.status(404).json({ success: false, message: 'Company not found' });
        }

        const user = await userProfileModel.findById(followerId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        let message;
        const followerIdStr = followerId.toString();

        // Check if already following (convert to strings for comparison)
        const isFollowing = company.followersId.some(id => id.toString() === followerIdStr);

        if (!isFollowing) {
            // Follow
            company.followersId.push(followerId);
            company.followers = (company.followers || 0) + 1;
            user.followedAccounts.push(companyId);
            message = "Followed";
        } else {
            // Unfollow
            company.followersId = company.followersId.filter(id => id.toString() !== followerIdStr);
            company.followers = Math.max((company.followers || 1) - 1, 0);
            user.followedAccounts = user.followedAccounts.filter(id => id.toString() !== companyId.toString());
            message = "Unfollowed";
        }

        await company.save();
        await user.save();

        return res.json({ success: true, message: `Successfully ${message}`, company });
    } catch (error) {
        console.error('Follow/Unfollow error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getCompanyDetails = async (req, res) => {
    const { companyId } = req.body;

    if (!companyId) {
        return res.status(400).json({ success: false, message: 'Company ID is required' });
    }

    try {
        let company = await recruiterProfileModel.findOne({ authId: companyId })
            .populate('followersId', 'name email');

        if (!company) {
            return res.status(404).json({ success: false, message: 'Company not found' });
        }

        return res.json({ success: true, company });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const followedAccountsDetails = async (req, res) => {
    const id = req.user._id

    try {
        const user = await userProfileModel.findOne({ authId: id });

        console.log('user.followedAccounts', user.followedAccounts)

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const companies = await recruiterProfileModel.find(
            { authId: { $in: user.followedAccounts } },
            { _id: 1, name: 1, profilePicture: 1, followers: 1, company: 1, authId: 1 } // only these fields
        );

        console.log(companies);

        return res.json({ success: true, companies });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}