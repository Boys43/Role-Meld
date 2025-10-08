import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema({
  authId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  profilePicture: { type: String, default: "" },
  savedJobs: { type: Array, default: [] },
  role: { type: String, default: "user" }, // applicant, recruiter
  profileScore: { type: Number, default: 0 },
  headline: { type: String, default: "" },
  phone: { type: String, default: "" },
  country: { type: String, default: "" },
  city: { type: String, default: "" },
  address: { type: String, default: "" },
  postal: { type: String, default: "" },
  appliedJobs: { type: Array, default: [] },
  followedAccounts: [{ type: mongoose.Schema.Types.ObjectId, ref: "RecruiterProfile" }],
  skills: { type: Array, default: [] },
  isBanned: {type: Boolean, default: false},

  // 🆕 Resume & extra fields
  resume: { type: String, default: "" },   // file URL (PDF/Doc)
  portfolio: { type: String, default: "" },
  github: { type: String, default: "" },
}, { timestamps: true });


export default mongoose.model("UserProfile", userProfileSchema);