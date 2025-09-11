import mongoose from "mongoose";

const recruiterProfileSchema = new mongoose.Schema({
  authId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
  company: { type: String, required: true },
  members: { type: Number, default: 1 },
  website: { type: String, default: "" },
});

export default mongoose.model("RecruiterProfile", recruiterProfileSchema);