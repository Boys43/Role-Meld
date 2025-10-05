import mongoose from "mongoose";

const recruiterProfileSchema = new mongoose.Schema({
  authId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
  name: { type: String, default: '' },
  headline: { type: String, default: '' },
  isPhysical: { type: Boolean, default: false },
  email: { type: String, default: '' },
  company: { type: String, default: 'Individual' },
  members: { type: Number, default: 1 },
  website: { type: String, default: "" },
  role: { type: String, default: "user" }, // applicant, recruiter
  profilePicture: { type: String, default: "" },
  banner: { type: String, default: "" },
  city: { type: String, default: "" },
  address: { type: String, default: "" },
  country: { type: String, default: "" },
  establishedDate: { type: Date, default: Date.now },
  state: { type: String, default: "" },
  contactNumber: { type: String, default: "" },
  about: { type: String, default: "" },
  industry: { type: String, default: "" },
  sentJobs: { type: Array, default: [] },
  followedAccounts: [{ type: mongoose.Schema.Types.ObjectId, ref: "RecruiterProfile" }],
  savedApplicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserProfile" }],
  followers: { type: Number, default: 0 },
  followersId: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserProfile" }]
}, { timestamps: true });

export default mongoose.model("RecruiterProfile", recruiterProfileSchema);