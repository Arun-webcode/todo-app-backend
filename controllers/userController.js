import { User } from "../models/user.model.js"
import { sendEmail } from "../config/sendOtp.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Otp } from "../models/otp.modal.js";

export const register = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                success: false
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                success: false
            });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

        await Otp.deleteMany({ email });

        await Otp.create({ email, otp, otpExpiry });

        // Send OTP via email
        await sendEmail(
            email,
            "Todo App OTP Code",
            `Otp verification code for Todo App is ${otp} and is valid for 5 minutes. Please don't share with anyone.`
        );

        return res.status(200).json({
            message: "OTP sent to your email",
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
            success: false
        });
    }
};

export const verifyOtpAndCreateAccount = async (req, res) => {
    try {
        const { email, name, otp, password } = req.body;
        if (!email || !name || !otp || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered",
                success: false
            });
        }

        const otpRecord = await Otp.findOne({ email });
        const otpExpiryTime = new Date(otpRecord.otpExpiry).getTime();
        if (!otpRecord) {
            return res.status(400).json({
                message: "OTP not found or expired",
                success: false
            });
        }

        if (otpRecord.otp != otp || otpExpiryTime < Date.now()) {
            return res.status(400).json({
                message: "Invalid or expired OTP",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password: hashedPassword
        });

        await Otp.deleteOne({ email });
        return res.status(201).json({
            message: "Account created successfully",
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
            success: false
        });
    }
};

export const sendResetPasswordOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

        await Otp.deleteMany({ email });
        await Otp.create({ email, otp, otpExpiry });
        await sendEmail(
            email,
            "Todo App Password Reset OTP",
            `Your password reset OTP for Todo App is ${otp}. It is valid for 5 minutes. Please do not share it with anyone.`
        );

        return res.status(200).json({
            message: "OTP sent to your email",
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to send OTP",
            error: error.message,
            success: false
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const otpRecord = await Otp.findOne({ email });
        if (!otpRecord || otpRecord.otp != otp || otpRecord.otpExpiry < Date.now()) {
            return res.status(400).json({
                message: "Invalid or expired OTP",
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        await Otp.deleteOne({ email });
        return res.status(200).json({
            message: "Password reset successfully",
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
            success: false
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect password",
                success: false,
            });
        }

        const tokenData = { userId: user._id };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });

        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            profile: user.profile,
        };

        return res
            .status(200)
            .cookie("token", token, {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "lax",
            })
            .json({
                message: `Welcome back ${user.name}`,
                token,
                user: userData,
                success: true,
            });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
            success: false,
        });
    }
};

export const logout = async (req, res) => {
    try {
        const userId = req.id;
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not Authenticated",
                success: false,
            });
        }

        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
            success: false
        });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "Password is required to delete the account.",
                success: false,
            });
        }

        const userId = req.id;
        if (!userId) {
            return res.status(401).json({
                message: "Invalid User Id",
                success: false,
            });
        }

        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect password.",
                success: false,
            });
        }
        await User.findByIdAndDelete(userId);

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        });

        return res.status(200).json({
            message: "Account deleted successfully.",
            success: true,
        });
    } catch (error) {
        console.error("Delete Account Error:", error);
        res.status(500).json({
            message: "Server error during account deletion.",
            error: error.message,
            success: false,
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name, bio } = req.body;
        const userId = req.id;

        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false,
            });
        }

        if (name) user.name = name;
        if (bio) user.profile.bio = bio;

        await user.save();
        user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            profile: user.profile,
        };

        return res.status(200).json({
            message: "Profile updated successfully",
            user,
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
            success: false
        });
    }
};

export const getUserDetails = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        const userDetails = {
            _id: user._id,
            name: user.name,
            email: user.email,
            profile: user.profile,
        };

        return res.status(200).json({
            message: "User details fetched successfully",
            user: userDetails,
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
            success: false,
        });
    }
};