import userProfileModel from "../models/userProfileModel.js";
import fs from "fs";

// ---------- Utility function ----------
function calculateProfileScore(user) {
    let score = 0;

    // Resume uploaded (any one of work/edu/skills filled)
    if (
        user.resume &&
        (
            (Array.isArray(user.resume.workExperience) && user.resume.workExperience.length > 0) ||
            (user.resume.education?.college?.trim?.() !== "") ||
            (Array.isArray(user.resume.skills) && user.resume.skills.length > 0)
        )
    ) {
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

    if (user.country && user.country.trim() !== "") {
        score += 10;
    }

    if (Array.isArray(user.resume?.skills) && user.resume.skills.length >= 3) {
        score += 20;
    }

    if (Array.isArray(user.resume?.workExperience) && user.resume.workExperience.length > 0) {
        score += 10;
    }

    return Math.min(score, 100);
}


export const getUserData = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await userProfileModel.findOne({ authId: userId });

        if (!user) {
            return res.json({ success: false, message: "User Not Found!" });
        }

        return res.json({ success: true, user });
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

        // Flatten nested objects into dot notation
        const flattenObject = (obj, parentKey = "", resObj = {}) => {
            for (let key in obj) {
                const newKey = parentKey ? `${parentKey}.${key}` : key;
                if (typeof obj[key] === "object" && !Array.isArray(obj[key]) && obj[key] !== null) {
                    flattenObject(obj[key], newKey, resObj);
                } else {
                    resObj[newKey] = obj[key];
                }
            }
            return resObj;
        };

        const updateFields = flattenObject(updateUser);

        let user = await userProfileModel.findOneAndUpdate(
            { authId: userId },
            { $set: updateFields },
            { new: true }
        );

        if (!user) {
            return res.json({ success: false, message: "User Not Found!" });
        }

        user.profileScore = calculateProfileScore(user);
        await user.save();

        res.json({
            success: true,
            message: "Profile updated successfully",
            user,
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
        console.log("Incoming file:", req.file);  // 👈 Debug here

    try {
        const user = await userProfileModel.findOne({ authId: userId });

        if (!user) {
            return res.status(404).json({ success: false, message: "User Not Found!" });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }
        

        // Save only filename with /uploads/
        user.profilePicture = req.file.filename;

        user.profileScore = calculateProfileScore(user);
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