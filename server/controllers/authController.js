import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import authModel from "../models/authModels.js";
import userProfileModel from "../models/userProfileModel.js";
import recruiterProfileModel from "../models/recruiterProfileModel.js";

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const existingUser = await authModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User Already Exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const auth = new authModel({
            name,
            email,
            password: hashedPassword,
            role,
        });

        await auth.save();

        if (role === "user") {
            await userProfileModel.create({ authId: auth._id, role: "user", name: name, email: email });
        } else {
            await recruiterProfileModel.create({ authId: auth._id, role: "recruiter", name: name, email: email })
        }

        return res.json({ success: true, message: `You are registered as ${role}` });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Missing Details" });
    }

    try {
        const user = await authModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid Email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Password" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.json({ success: true, message: "Successfully Logged In" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.json({ success: true, message: "Successfully Logged Out" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true, message: "Successfully Logged In" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}