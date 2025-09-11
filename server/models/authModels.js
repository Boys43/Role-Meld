import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: ['user', 'recruiter'], default: 'user'},
    isAdmin: {type: Boolean, default: false},
})

const authModel = mongoose.model("User", authSchema);
export default authModel;