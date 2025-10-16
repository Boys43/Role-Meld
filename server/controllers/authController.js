import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import authModel from "../models/authModels.js";
import userProfileModel from "../models/userProfileModel.js";
import recruiterProfileModel from "../models/recruiterProfileModel.js";
import SibApiV3Sdk from "sib-api-v3-sdk";
import 'dotenv/config';

// Configure Brevo client once
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // === Validate inputs ===
        if (!name || !email || !password || !role) {
            return res.json({ success: false, message: "Missing Details" });
        }

        // === Check for existing user ===
        const existingUser = await authModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User Already Exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // === USER FLOW ===
        const verificationOTP = String(Math.floor(100000 + Math.random() * 900000));

        // --- Brevo email content ---
        const sendSmtpEmail = {
            sender: { name: "Alfa Career", email: "movietrendmaker2244@gmail.com" },
            to: [{ email }],
            subject: "🔑 Verify Your Alfa Career Account",
            htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background: linear-gradient(90deg, #0076b5, #00bfa6); padding: 20px; text-align: center; color: white;">
              <h2 style="margin: 0;">Alfa Career</h2>
            </div>
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
            <div style="background: #f9f9f9; padding: 15px; text-align: center; font-size: 13px; color: #777;">
              <p>© ${new Date().getFullYear()} Alfa Career. All rights reserved.</p>
            </div>
          </div>
        `,
        };

        // --- Send verification email ---
        await tranEmailApi.sendTransacEmail(sendSmtpEmail);

        // --- Save user ---
        const auth = new authModel({
            name,
            email,
            password: hashedPassword,
            role: role,
            verificationOTP,
        });

        if (email === process.env.ADMIN_EMAIL) {
            auth.isAdmin = true;
        }

        await auth.save();
        if (role == "user") {
            await userProfileModel.create({ authId: auth._id, role: "user", name, email });
        } else {
            await recruiterProfileModel.create({ authId: auth._id, role: "recruiter", name, email });
        }

        return res.json({ success: true, message: "An OTP has sent to your email address"});

    } catch (error) {
        console.error("Email sending error:", error.response?.body || error.message);
        return res.json({ success: false, message: "Server Error: " + error.message });
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

        if (user.role === "recruiter") {
            var userProfile = await recruiterProfileModel.findOne({authId: user._id})
        }

        return res.json({ success: true, message: "Successfully Logged In", company: userProfile?.company, role: userProfile?.role })

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

export const getPendingRecruiters = async (req, res) => {
    try {
        const pendingRecruiters = await authModel.find({ role: "recruiter", isVerified: false });
        return res.json({ success: true, pendingRecruiters });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const updateRecruiterStatus = async (req, res) => {
    const { email, status } = req.body;

    if (!email || !status) {
        return res.json({ success: false, message: "Email and status are required" });
    }

    try {
        const authUser = await authModel.findOne({ email });

        if (!authUser) {
            return res.json({ success: false, message: "User not found" });
        }

        authUser.isVerified = status;
        await authUser.save();

        const sentEmail = {
            sender: { name: "Alfa Career", email: "movietrendmaker2244@gmail.com" },
            to: [{ email }],
            subject: "🎉 Your Recruiter Account Has Been Approved!",
            htmlContent: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
    <div style="background: linear-gradient(90deg, #0076b5, #00bfa6); padding: 20px; text-align: center; color: white;">
      <h2 style="margin: 0;">Alfa Career</h2>
    </div>
    <div style="padding: 25px; color: #333; font-size: 16px; line-height: 1.6;">
      <p>Hey <b>${authUser?.name}</b>,</p>
      <p>🎉 Great news! Your <b>Recruiter Account</b> has been <b>successfully approved</b> on <b>Alfa Career</b>.</p>
      <p>You can now log in to your dashboard, post job listings, and manage applications from talented candidates.</p>
      <p style="margin-top: 20px;">
        <a href="https://alfacareer.com/login" 
           style="background: linear-gradient(90deg, #0076b5, #00bfa6); color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
          Log in to Your Account
        </a>
      </p>
      <p>If you face any issues accessing your account, feel free to reply to this email — our support team will assist you promptly.</p>
      <p>Welcome aboard, and best of luck with your recruitment journey 🚀</p>
      <p>— The Alfa Career Team</p>
    </div>
    <div style="background: #f9f9f9; padding: 15px; text-align: center; font-size: 13px; color: #777;">
      <p>© ${new Date().getFullYear()} Alfa Career. All rights reserved.</p>
    </div>
  </div>
  `,
        };

        await tranEmailApi.sendTransacEmail(sentEmail);

        return res.json({ success: true, message: "User status updated successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const employeeProfileRequests = async (req, res) => {
    const { reviewStatus, email } = req.body

    try {
        const recruiter = await recruiterProfileModel.findOneAndUpdate(
            { email },
            { reviewStatus: reviewStatus },
            { new: true }
        );

        if (!recruiter) {
            return res.status(404).json({ success: false, message: "Recruiter not found" });
        }

        if (hellow) {
            return res.status
        }

        return res.json({ success: true, message: "Recruiter status updated successfully" });
    } catch (error) {
        return res.json({ success: false, })
    }
}

export const getPendingProfileRequests = async (req, res) => {
    try {
        const pendingRequests = await recruiterProfileModel.find({ reviewStatus: "underReview" });
        return res.json({ success: true, pendingRequests });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.body;

    try {
        const user = await authModel.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.role === "user") {
            await userProfileModel.findOneAndDelete({ authId: user._id });
        } else if (user.role === "recruiter") {
            await recruiterProfileModel.findOneAndDelete({ authId: user._id });
        }

        await authModel.findByIdAndDelete(id);

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.json({
            success: true,
            message: "User and related profile deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const changePassword = async (req, res) => {
    const { email, password, newPassword } = req.body;

    if (!email || !password || !newPassword) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    try {
        const user = await authModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect password" });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);

        user.password = hashedPassword;

        await user.save();

        return res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const deleteAccount = async (req, res) => {
    const { password, email } = req.body;

    try {
        const user = await authModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect password" });
        }

        let deletedProfile;
        if (user.role === "user") {
            deletedProfile = await userProfileModel.findOneAndDelete({ email: user.email });
        } else if (user.role === "recruiter") {
            deletedProfile = await recruiterProfileModel.findOneAndDelete({ email: user.email });
        }

        await authModel.findOneAndDelete({ email: user.email });

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.json({
            success: true,
            message: "Account deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const banUser = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
        const user = await authModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.role === "recruiter") {
            const recruiter = await recruiterProfileModel.findOne({ email });

            if (!recruiter) {
                return res.status(404).json({ success: false, message: "Recruiter not found" });
            }

            recruiter.isBanned = true;
            recruiter.save();
        } else if (user.role === "user") {
            const user = await userProfileModel.findOne({ email });
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            user.isBanned = true;
            user.save();
        }

        return res.json({ success: true, message: "User banned successfully" });
    } catch {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const unBanUser = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
        const user = await authModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.role === "recruiter") {
            const recruiter = await recruiterProfileModel.findOne({ email });

            if (!recruiter) {
                return res.status(404).json({ success: false, message: "Recruiter not found" });
            }

            if (recruiter.isBanned === false) {
                return res.status(400).json({ success: false, message: "User is not banned" });
            }

            recruiter.isBanned = false;
            recruiter.save();
        } else if (user.role === "ruiter") {
            const user = await userProfileModel.findOne({ email });
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }


            if (user.isBanned === false) {
                return res.status(400).json({ success: false, message: "User is not banned" });
            }

            user.isBanned = false;
            user.save();
        }

        return res.json({ success: true, message: "User Un-Banned successfully" });
    } catch {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const changeVisibility = async (req, res) => {
    const { status, email } = req.body

    console.log(status);
    if (status === undefined || status === null) {
        return res.status(400).json({ success: false, message: "Status is required" });
    }

    try {
        const user = await authModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.role === "recruiter") {
            const recruiter = await recruiterProfileModel.findOne({ email });

            if (!recruiter) {
                return res.status(404).json({ success: false, message: "Recruiter not found" });
            }

            recruiter.isActive = status;
            recruiter.save();
        } else if (user.role === "user") {
            const user = await userProfileModel.findOne({ email });
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            user.isActive = status;
            user.save();
        }

        return res.json({ success: true, message: "User visibility changed successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const addAssistant = async (req, res) => {
    const { email, roles } = req.body;
    console.log('email, roles', email, roles)
    const userId = req.user._id;

    if (!email || !roles || roles.length === 0) {
        return res.json({ success: false, message: "Missing Details" });
    }

    try {
        const admin = await recruiterProfileModel.findOne({ authId: userId });
        console.log('admin', admin)

        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        const recruiter = await recruiterProfileModel.findOne({ email });

        if (!recruiter) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (recruiter.role === "user") {
            return res.json({ success: false, message: "Job seekers can't be an assistant" });
        }

        // ✅ Prevent duplicates
        if (admin?.assistants?.includes(recruiter.authId)) {
            return res.json({ success: false, message: "Assistant already added" });
        }

        console.log(admin?.assistants);

        recruiter.isAssistant = true;
        if (Array.isArray(roles)) {
            recruiter?.assistantRoles?.push(...roles);
        } else {
            recruiter?.assistantRoles?.push(roles);
        }

        const sentEmail = {
            sender: { name: "Alfa Career", email: "movietrendmaker2244@gmail.com" },
            to: [{ email }],
            subject: `🎉 You’ve Been Appointed as a ${roles} Manager!`,
            htmlContent: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
    <div style="background: linear-gradient(90deg, #0076b5, #00bfa6); padding: 20px; text-align: center; color: white;">
      <h2 style="margin: 0;">Alfa Career</h2>
    </div>
    <div style="padding: 25px; color: #333; font-size: 16px; line-height: 1.6;">
      <p>Hey <b>${recruiter?.name}</b>,</p>
      <p>We’re thrilled to inform you that you’ve been officially appointed as a <b>${roles} Manager</b> at <b>Alfa Career</b> 🎉.</p>
      <p>As a ${roles} Manager, you now have access to all the necessary tools and permissions to effectively manage your assigned tasks and contribute to our growing platform.</p>
      <p>To get started, please log in to your manager dashboard using the button below:</p>
      <p style="margin-top: 20px;">
        <a href="https://alfacareer.com/login"
           style="background: linear-gradient(90deg, #0076b5, #00bfa6); color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
          Access Your Dashboard
        </a>
      </p>
      <p>If you encounter any issues or need guidance, feel free to reply to this email — our support team will be happy to help.</p>
      <p>Welcome to the management team, and best of luck in your new role 🚀</p>
      <p>— The Alfa Career Admin Team</p>
    </div>
    <div style="background: #f9f9f9; padding: 15px; text-align: center; font-size: 13px; color: #777;">
      <p>© ${new Date().getFullYear()} Alfa Career. All rights reserved.</p>
    </div>
  </div>
  `,
        };

        await tranEmailApi.sendTransacEmail(sentEmail);

        admin?.assistants?.push(recruiter.authId);

        await Promise.all([admin.save(), recruiter.save()]); // ✅ Better practice

        return res.json({ success: true, message: "Assistant added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAssistants = async (req, res) => {
    const userId = req.user._id;
    try {
        const admin = await recruiterProfileModel.findOne({ authId: userId, isAdmin: true });

        if (!admin) {
            return res.json({ success: false, message: "Only Admins are allowed to access this route" });
        }

        const assistants = await recruiterProfileModel.find({ authId: { $in: admin.assistants } });

        console.log('assistants', assistants)

        return res.json({ success: true, assistants });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}