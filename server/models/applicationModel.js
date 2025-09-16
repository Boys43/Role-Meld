import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Jobs", required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    coverLetter: String,
    resume: String, // file URL
    status: { type: String, enum: ["applied", "shortlisted", "rejected", "hired"], default: "applied" },
    appliedAt: { type: Date, default: Date.now }
})

export default mongoose.model("Application", applicationSchema);