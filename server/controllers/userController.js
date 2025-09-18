import recruiterProfileModel from "../models/recruiterProfileModel.js"
import userProfileModel from "../models/userProfileModel.js"

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