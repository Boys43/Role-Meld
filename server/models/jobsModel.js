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
    required: function () { 
      return this.locationType === "on-site" || this.locationType === "hybrid"; 
    }
  },

  // Job Type
  jobType: {
    type: String,
    enum: ["full-time", "part-time", "contract", "internship", "temporary"],
    required: true
  },
  hoursPerWeek: { type: Number, required: function () { return this.jobType === "full-time"; } },
  shift: { type: String, required: function () { return this.jobType === "part-time"; } },
  contractDuration: { type: String, required: function () { return this.jobType === "contract"; } },
  internshipDuration: { type: String },
  temporaryDuration: { type: String },

  // Salary
  salaryType: { type: String, enum: ["fixed", "range"], default: "fixed"},
  fixedSalary: { type: Number, required: function () { return this.salaryType === "fixed"; }},
  minSalary: { type: Number, default: 0 },
  maxSalary: { type: Number, default: 0},

  // Job Description & Requirements
  responsibilities: { type: [String] },
  qualifications: { type: String, required: true },
  skills: { type: [String], required: true },
  experience: { type: String, enum: ["6 Months - 1 Year", "1 Year - 2 Years", "2 Years - 3 Years", "3 Years - 4 Years", "4 Years - 5 Years", "5 Years+"], required: true },

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
    enum: ["easy", "external"],
    required: true,
    default: "easy"
  },
  resumeRequirement: { type: Boolean, default: false },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "userProfile" }],

  // Payment for featured jobs
  sponsored: { type: Boolean, default: false },
  cardName: { type: String, default: "" },
  cardNumber: { type: String, default: "" },
  expiryDate: { type: String, default: "" },
  cvv: { type: Number, default: null },

  // Extra optional fields
  benefits: { type: [String], default: [] },
  education: { type: String },
  remoteOption: { 
    type: Boolean, 
    default: function () { return this.locationType === "remote"; } 
  },
  applyLink: { 
    type: String, 
    required: function () { return this.applicationMethod === "external"; } 
  },

  // Status
  approved: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  isActive: {
    type: Boolean,
    default: true,
  },

  jobsCurrency: {type: String, default: "USD"},

}, { timestamps: true });

const jobsModel = mongoose.models?.Jobs || mongoose.model("Jobs", jobsSchema);
export default jobsModel;