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
  location: {
    city: { type: String, default: "" },
    address: { type: String, default: "" },
    postal: { type: String, default: "" },
  },
  resume: {
    workExperience: { type: Array, default: [] },
    education: {
      college: { type: String, default: "" },
      qualification: { type: String, default: "" },
      from: { type: String, default: "" },
      to: { type: String, default: "" },
      city: { type: String, default: "" },
    },
    skills: { type: Array, default: [] },
  }
});

export default mongoose.model("UserProfile", userProfileSchema);