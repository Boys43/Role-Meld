import recruiterProfileModel from "../models/recruiterProfileModel.js"
import userProfileModel from "../models/userProfileModel.js"
import authModel from "../models/authModels.js";
import jobsModel from "../models/jobsModel.js";
import applicationModel from "../models/applicationModel.js";
import fs from 'fs';
import cloudinary from '../config/cloudinary.js';


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
        const recruiters = (await recruiterProfileModel.find({})).populate('sentJobs', "isActive approved")
        return res.json({ success: true, recruiters })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" })
    }
}

// ---------- Utility function ----------
function calculateProfileScore(user) {
    let score = 0;

    // ========== BASIC INFO (30 points) ==========
    // Name (required, 3 points)
    if (user.name && user.name.trim() !== "") {
        score += 3;
    }

    // Phone (3 points)
    if (user.phone && user.phone.trim() !== "") {
        score += 3;
    }

    // Current Position (3 points)
    if (user.currentPosition && user.currentPosition.trim() !== "") {
        score += 3;
    }

    // Description (5 points)
    if (user.description && user.description.trim() !== "") {
        score += 5;
    }

    // Date of Birth (3 points)
    if (user.dob) {
        score += 3;
    }

    // Gender (2 points)
    if (user.gender && user.gender.trim() !== "") {
        score += 2;
    }

    // Category (3 points)
    if (user.category && user.category.trim() !== "") {
        score += 3;
    }

    // Languages (3 points if at least 1)
    if (user.languages && user.languages.length > 0) {
        score += 3;
    }

    // Currency (2 points)
    if (user.currency && user.currency.trim() !== "") {
        score += 2;
    }

    // Salary Type (3 points)
    if (user.salaryType && user.salaryType.trim() !== "") {
        score += 3;
    }

    // ========== PROFESSIONAL (25 points) ==========
    // Headline (5 points)
    if (user.headline && user.headline.trim() !== "") {
        score += 5;
    }

    // Qualification (5 points)
    if (user.qualification && user.qualification.trim() !== "") {
        score += 5;
    }

    // Experience Years (5 points)
    if (user.experienceYears && user.experienceYears.trim() !== "") {
        score += 5;
    }

    // Skills (5 points if at least 3)
    if (user.skills && user.skills.length >= 3) {
        score += 5;
    }

    // Offered Salary (5 points if > 0)
    if (user.offeredSalary && user.offeredSalary > 0) {
        score += 5;
    }

    // ========== MEDIA (15 points) ==========
    // Profile Picture (4 points)
    if (user.profilePicture && user.profilePicture.trim() !== "") {
        score += 4;
    }

    // Cover Image (3 points)
    if (user.coverImage && user.coverImage.trim() !== "") {
        score += 3;
    }

    // Resume (4 points)
    if (user.resume && user.resume.trim() !== "") {
        score += 4;
    }

    // Portfolio (2 points)
    if (user.portfolio && user.portfolio.trim() !== "") {
        score += 2;
    }

    // Video URL (2 points)
    if (user.videoUrl && user.videoUrl.trim() !== "") {
        score += 2;
    }

    // ========== LOCATION (10 points) ==========
    // Address (3 points)
    if (user.address && user.address.trim() !== "") {
        score += 3;
    }

    // City (3 points)
    if (user.city && user.city.trim() !== "") {
        score += 3;
    }

    // Country (3 points)
    if (user.country && user.country.trim() !== "") {
        score += 3;
    }

    // Postal Code (1 point)
    if (user.postal && user.postal.trim() !== "") {
        score += 1;
    }

    // ========== EXPERIENCE & EDUCATION (10 points) ==========
    // Education (5 points if at least 1 entry)
    if (user.education && user.education.length > 0) {
        score += 5;
    }

    // Experience (5 points if at least 1 entry)
    if (user.experience && user.experience.length > 0) {
        score += 5;
    }

    // ========== PROJECTS & AWARDS (5 points) ==========
    // Projects (3 points if at least 1)
    if (user.projects && user.projects.length > 0) {
        score += 3;
    }

    // Awards (2 points if at least 1)
    if (user.awards && user.awards.length > 0) {
        score += 2;
    }

    // ========== SOCIAL LINKS (5 points) ==========
    let socialCount = 0;

    // Count predefined social links
    if (user.linkedin && user.linkedin.trim() !== "") socialCount++;
    if (user.twitter && user.twitter.trim() !== "") socialCount++;
    if (user.facebook && user.facebook.trim() !== "") socialCount++;
    if (user.instagram && user.instagram.trim() !== "") socialCount++;
    if (user.youtube && user.youtube.trim() !== "") socialCount++;
    if (user.tiktok && user.tiktok.trim() !== "") socialCount++;
    if (user.github && user.github.trim() !== "") socialCount++;

    // Count custom social networks
    if (user.customSocialNetworks && user.customSocialNetworks.length > 0) {
        socialCount += user.customSocialNetworks.filter(s => s.url && s.url.trim() !== "").length;
    }

    // Award points based on social link count (max 5 points)
    if (socialCount >= 2) {
        score += Math.min(socialCount, 5);
    }

    return Math.min(score, 100);
}



function calculateRecruiterProfileScore(user) {
    let score = 0;
    const totalPossible = 70; // total points if all conditions are met

    if (user.name?.trim()) score += 10;
    if (user.profilePicture?.trim()) score += 10;
    if (user.banner?.trim()) score += 5;
    if (user.companyType?.trim()) score += 5;
    if (user.industry?.trim()) score += 5;
    if (user.about?.trim()) score += 5;
    if (user.tagline?.trim()) score += 5;
    if (user.contactNumber?.trim()) score += 5;
    if (user.country?.trim()) score += 5;
    if (user.city?.trim()) score += 5;
    if (user.company?.trim() !== "Individual") score += 10;

    // convert to percentage
    const percentage = (score / totalPossible) * 100;

    return Math.round(percentage);
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

            updatedProfile.profileScore = calculateRecruiterProfileScore(updatedProfile);
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

        let user;

        if (authUser.role === "user") {
            user = await userProfileModel.findOne({ authId: userId })
            user.profileScore ? user.profileScore = calculateProfileScore(user) : ''
        } else {
            user = await recruiterProfileModel.findOne({ authId: userId })
            user.profileScore ? user.profileScore = calculateRecruiterProfileScore(user) : ''
        }

        if (!user) {
            return res.status(404).json({ success: false, message: "User Not Found!" });
        }

        // Save full Cloudinary URL
        user.profilePicture = req.file.path;

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

        user.banner = req.file?.path;

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
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }
        const userId = req.user._id;
        const baseName = req.file.originalname.split(".")[0];

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "users",
            resource_type: "raw",
            public_id: `${baseName}_${Date.now()}`,
            format: "pdf"
        });

        try { fs.unlinkSync(req.file.path); } catch (e) { }

        const user = await userProfileModel.findOne({ authId: userId });
        if (!user) {
            return res.status(404).json({ success: false, message: "User Not Found!" });
        }
        user.resume = result.secure_url;
        user.profileScore = calculateProfileScore(user);
        await user.save();

        res.json({
            success: true,
            message: "Resume uploaded successfully",
            profile: user,
        });
    } catch (error) {
        if (req.file && req.file.path) {
            try { fs.unlinkSync(req.file.path); } catch (e) { }
        }
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const applyJob = async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({ success: false, message: "Missing job ID or applicant details" });
        }

        const user = await userProfileModel.findOne({ authId: userId });

        console.log(user);

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const job = await jobsModel.findById(jobId);

        console.log(job);

        if (!job) return res.status(404).json({ success: false, message: "Job not found" });

        job.applicants.push(userId);
        await job.save();

        const application = new applicationModel({
            job: job._id,
            applicant: user._id,
            recruiter: job.postedBy,
            resume: user.resume,
        });

        await application.save();

        user.appliedJobs.push(job._id);
        await user.save();

        res.json({ success: true, message: "Application submitted" });
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
            .populate("applicant", "name authId _id email resume phone")
            .populate("job", "title description location category jobType salaryType fixedSalary minSalary maxSalary");

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

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const companies = await recruiterProfileModel.find(
            { authId: { $in: user.followedAccounts } });

        return res.json({ success: true, companies });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const uploadCompanyImages = async (req, res) => {
    const userId = req.user._id;

    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "No images uploaded" });
        }

        const recruiter = await recruiterProfileModel.findOne({ authId: userId });

        if (!recruiter) {
            return res.status(404).json({ success: false, message: "Recruiter profile not found" });
        }

        // Get image paths from uploaded files
        const imagePaths = req.files.map(file => file.path);

        // Add new images to existing ones
        recruiter.companyImages = [...(recruiter.companyImages || []), ...imagePaths];

        await recruiter.save();

        res.json({
            success: true,
            message: "Company images uploaded successfully",
            images: recruiter.companyImages,
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

export const deleteCompanyImage = async (req, res) => {
    const userId = req.user._id;
    const { imageUrl } = req.body;

    try {
        if (!imageUrl) {
            return res.status(400).json({ success: false, message: "Image URL is required" });
        }

        const recruiter = await recruiterProfileModel.findOne({ authId: userId });

        if (!recruiter) {
            return res.status(404).json({ success: false, message: "Recruiter profile not found" });
        }

        // Remove image from array
        recruiter.companyImages = recruiter.companyImages.filter(img => img !== imageUrl);

        await recruiter.save();

        res.json({
            success: true,
            message: "Company image deleted successfully",
            images: recruiter.companyImages,
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

export const searchCandidate = async (req, res) => {
    try {
        const { search, location } = req.body;

        console.log(search, location);

        // Search for approved jobs matching title (case-insensitive)
        let candidates;

        if (!location) {
            candidates = await userProfileModel.find({
                name: { $regex: search, $options: "i" },
            });
        } else {
            candidates = await userProfileModel.find({
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { location: { $regex: location, $options: "i" } },
                ]
            });
        }

        return res.json({
            success: true,
            candidates
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};