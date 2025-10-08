import mongoose from "mongoose";

const recruiterProfileSchema = new mongoose.Schema({
  authId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
  isActive: { type: Boolean, default: true },
  name: { type: String, default: '' },
  tagline: { type: String, default: '' },
  email: { type: String, default: '' },
  company: { type: String, default: '' },
  isCompany: { type: Boolean, default: false },
  // members: { type: String, default: '0-50', enum: ['0-50', '50-100', '100-500', '500-1000', '1000+'] },
  website: { type: String, default: "" },
  role: { type: String, default: "user" },
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