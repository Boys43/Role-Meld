import mongoose from "mongoose";

const jobsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    jobType: { type: String, required: true },
    locationType: { type: String, required: true },
    salary: { type: Number, required: true },
    skills: { type: [String], required: true },
    experience: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "RecruiterProfile", required: true },
    applicationDeadline: { type: Date, required: true },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "userProfile" }],
    sponsored: { type: Boolean, default: false },
    cardName: { type: String, default: "" },
    cardNumber: { type: String, default: "" },
    expiryDate: { type: String, default: "" },
    cvv: { type: Number, default: null },
    company: { type: String },
    companyProfile: { type: String },
    category: { type: String },
    approved: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    isActive: { type: Boolean, default: true },
    subCategory: { type: String, default: '' },
}, { timestamps: true });

const jobsModel = mongoose.models.Jobs || mongoose.model("Jobs", jobsSchema);
export default jobsModel;