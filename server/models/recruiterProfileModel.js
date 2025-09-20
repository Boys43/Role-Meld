import mongoose from "mongoose";

const recruiterProfileSchema = new mongoose.Schema({
  authId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  company: { type: String, default: 'Individual' },
  members: { type: Number, default: 1 },
  website: { type: String, default: "" },
  role: { type: String, default: "user" }, // applicant, recruiter
  profilePicture: { type: String, default: "" },
  sentJobs: {type: Array, default: []}
}, { timestamps: true });

export default mongoose.model("RecruiterProfile", recruiterProfileSchema);