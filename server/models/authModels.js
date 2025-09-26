import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'recruiter'], default: 'user' },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verificationOTP: { type: Number, default: 0 },
}, { timestamps: true });

const authModel = mongoose.model("User", authSchema);
export default authModel;