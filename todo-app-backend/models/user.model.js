import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        bio: {
            type: String
        }
    },
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
    },
},
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
