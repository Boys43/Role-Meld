import recruiterProfileModel from "../models/recruiterProfileModel.js";
import userProfileModel from "../models/userProfileModel.js";
import jobsModel from "../models/jobsModel.js";

export const weeklyAnalytic = async (req, res) => {
    try {
        const now = new Date();
        const jobResults = [];
        const userResults = [];
        const recruiterResults = [];

        for (let i = 0; i < 7; i++) {
            const start = new Date(now);
            start.setDate(now.getDate() - i);

            const end = new Date(now);
            end.setDate(now.getDate() - (i + 1));

            const count = await jobsModel.countDocuments({
                createdAt: { $gte: end, $lt: start }
            });

            jobResults.push({
                day: end.toISOString().split("T")[0], // yyyy-mm-dd format
                jobs: count
            });
        }

        for (let i = 0; i < 7; i++) {
            const start = new Date(now);
            start.setDate(now.getDate() - i);

            const end = new Date(now);
            end.setDate(now.getDate() - (i + 1));

            const count = await userProfileModel.countDocuments({
                createdAt: { $gte: end, $lt: start }
            });

            userResults.push({
                day: end.toISOString().split("T")[0], // yyyy-mm-dd format
                users: count
            });
        }

        for (let i = 0; i < 7; i++) {
            const start = new Date(now);
            start.setDate(now.getDate() - i);

            const end = new Date(now);
            end.setDate(now.getDate() - (i + 1));

            const count = await recruiterProfileModel.countDocuments({
                createdAt: { $gte: end, $lt: start }
            });

            recruiterResults.push({
                day: end.toISOString().split("T")[0], // yyyy-mm-dd format
                recruiters: count
            });
        }

        // reverse so oldest day comes first
        jobResults.reverse();
        userResults.reverse();
        recruiterResults.reverse();

        return res.json({ success: true, jobs: jobResults, users: userResults, recruiters: recruiterResults });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};
