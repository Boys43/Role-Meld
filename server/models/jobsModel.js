import mongoose from "mongoose";

const jobsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },

  // Location
  locationType: {
    type: String,
    enum: ["remote", "on-site", "hybrid"],
    required: true
  },
  location: {
    type: String,
    required: function () { return this.locationType === "on-site" || this.locationType === "hybrid"; }
  },

  // Job Type
  jobType: {
    type: String,
    enum: ["full-time", "part-time", "contract", "internship", "temporary"],
    required: true
  },
  hoursPerWeek: { type: Number, required: function () { return this.jobType === "full-time"; } },
  shift: { type: String, required: function () { return this.jobType === "part-time"; } }, // e.g., morning, evening, night
  contractDuration: { type: String, required: function () { return this.jobType === "contract"; } }, // e.g., "6 months"
  internshipDuration: { type: String }, // Optional for internships
  temporaryDuration: { type: String }, // Optional for temporary jobs

  // Salary
  minSalary: { type: Number, required: true },
  maxSalary: { type: Number, required: true },

  // Job Description & Requirements
  responsibilities: { type: String }, // Optional but recommended
  qualifications: { type: [String], required: true }, // Required skills/qualifications
  skills: { type: [String], required: true },
  experience: { type: String, required: true }, // e.g., "2+ years"

  // Company & recruiter
  company: { type: String, required: true },
  companyProfile: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "RecruiterProfile", required: true },

  // Job category
  category: { type: String },
  subCategory: { type: String, default: "" },

  // Application Settings
  applicationDeadline: { type: Date, required: true },
  applicationMethod: {
    type: String,
    enum: ["platform", "external"],
    required: true,
    default: "platform"
  },
  resumeRequirement: { type: Boolean, default: false }, // Yes/No for resume requirement
  screeningQuestions: [{
    question: { type: String },
    type: { type: String, enum: ["text", "multiple-choice"] },
    options: [String] // For multiple-choice questions
  }],
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "userProfile" }],

  // Payment for featured jobs
  sponsored: { type: Boolean, default: false },
  cardName: { type: String, default: "" },
  cardNumber: { type: String, default: "" },
  expiryDate: { type: String, default: "" },
  cvv: { type: Number, default: null },

  // Extra optional fields
  perks: { type: [String], default: [] }, // e.g., ["Health Insurance", "Gym"]
  benefits: { type: [String], default: [] }, // e.g., ["Paid Vacation", "401k"]
  education: { type: String }, // e.g., "Bachelor's Degree"
  remoteOption: { type: Boolean, default: function () { return this.locationType === "remote"; } },
  applyLink: { type: String, required: function () { return this.applicationMethod === "external"; } }, // Required if external application method

  // Status
  approved: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  isActive: { type: Boolean, default: true },

}, { timestamps: true });

const jobsModel = mongoose.models?.Jobs || mongoose.model("Jobs", jobsSchema);
export default jobsModel;