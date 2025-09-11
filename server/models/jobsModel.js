import mongoose from "mongoose";

const jobsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    jobType: { type: String, required: true },
    locationType: { type: String, required: true },
    salary: { type: Number, required: true },
    maxSalary: { type: Number },
    minSalary: { type: Number },
    skills: { type: [String], required: true },
    experience: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    postedAt: { type: Date, default: Date.now },
    applicationDeadline: { type: Date, required: true },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    duration: { type: Number, required: true },
    sponsored: { type: Boolean, default: false },
    company: { type: String },
    companyProfile: { type: String },
    category: { type: String }
})

const jobsModel = mongoose.models.Jobs || mongoose.model("Jobs", jobsSchema);
export default jobsModel;