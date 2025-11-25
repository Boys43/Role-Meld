import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: "USD",
        trim: true
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    jobPostings: {
        type: Number,
        required: true,
        min: 1
    },
    featuredJobs: {
        type: Number,
        default: 0,
        min: 0
    },
    candidateAccess: {
        type: Boolean,
        default: false
    },
    features: {
        type: [String],
        default: []
    },
    isActive: {
        type: Boolean,
        default: true
    },
    displayOrder: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Package = mongoose.models?.Package || mongoose.model("Package", packageSchema);

export default Package;
