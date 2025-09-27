import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import authModel from "../models/authModels.js";
import userProfileModel from "../models/userProfileModel.js";
import recruiterProfileModel from "../models/recruiterProfileModel.js";
import nodemailer from "nodemailer";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "nt5@gmail.com";

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

        const verificationOTP = String(Math.floor(900000 * Math.random()) + 100000);
        const hashedPassword = await bcrypt.hash(password, 10);

        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: '"Alfa Career" <movietrendmaker2244@gmail.com>',
            to: email,
            subject: "🔑 Verify Your Alfa Career Account",
            html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <!-- Header -->
      <div style="background: linear-gradient(90deg, #0076b5, #00bfa6); padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">Alfa Career</h2>
      </div>

      <!-- Body -->
      <div style="padding: 25px; color: #333; font-size: 16px; line-height: 1.6;">
        <p>Hey <b>${name}</b>,</p>
        <p>Thank you for signing up with <b>Alfa Career</b>. To complete your account verification, please use the following OTP:</p>

        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; font-size: 28px; font-weight: bold; letter-spacing: 6px; background: #f3f9ff; padding: 15px 25px; border: 2px dashed #0076b5; border-radius: 8px; color: #0076b5;">
            ${verificationOTP}
          </span>
        </div>

        <p>This OTP is valid for <b>10 minutes</b>. Please do not share it with anyone for security reasons.</p>
        <p>If you didn’t request this verification, you can safely ignore this email.</p>
      </div>

      <!-- Footer -->
      <div style="background: #f9f9f9; padding: 15px; text-align: center; font-size: 13px; color: #777;">
        <p>© ${new Date().getFullYear()} Alfa Career. All rights reserved.</p>
      </div>
    </div>
  `,
        });

        const auth = new authModel({
            name,
            email,
            password: hashedPassword,
            role,
            verificationOTP: verificationOTP,
        });

        if (email === ADMIN_EMAIL) {
            auth.isAdmin = true;
        }
        await auth.save();

        if (role === "user") {
            await userProfileModel.create({ authId: auth._id, role: "user", name: name, email: email });
        } else {
            await recruiterProfileModel.create({ authId: auth._id, role: "recruiter", name: name, email: email })
        }

        return res.json({ success: true, message: `Please Verify Your Account` });
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

        if (user.isVerified === false) {
            return res.json({ success: false, message: "Please Verify Your Email First" });
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

export const checkAdmin = async (req, res) => {
    const { _id: userId } = req.user

    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
        const user = await authModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User Not Found" });
        }

        return res.json({ success: true, isAdmin: user.isAdmin });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const verifyEmail = async (req, res) => {
    const { OTP, email } = req.body;

    if (!OTP || !email) {
        return res.json({ success: false, message: "OTP is required" });
    }

    try {
        const authUser = await authModel.findOne({ email });
        if (!authUser) {
            return res.json({ success: false, message: "User not found" });
        }

        if (authUser.verificationOTP !== OTP) {
            return res.json({ success: false, message: "Invalid OTP! Please Enter a Valid OTP" });
        }

        authUser.isVerified = true;
        authUser.verificationOTP = ""
        await authUser.save();

        return res.json({ success: true, message: "Email verified successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.body;

    try {
        const user = await authModel.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let deletedProfile;
        if (user.role === "user") {
            deletedProfile = await userProfileModel.findOneAndDelete({ authId: user._id });
        } else if (user.role === "recruiter") {
            deletedProfile = await recruiterProfileModel.findOneAndDelete({ authId: user._id });
        }

        await authModel.findByIdAndDelete(id);

        return res.json({
            success: true,
            message: "User and related profile deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
