import { User } from "../models/user.model.js"
import { sendEmail } from "../config/sendOtp.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

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
                message: "User already exists", success: false
            });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = Date.now() + 5 * 60 * 1000;

        User.otp = otp;
        User.otpExpiry = otpExpiry;
        User.email = email;

        await sendEmail(email, "Todo App OTP Code", `Otp verification code for Todo App is ${otp} and is valid for 5 minutes. Please don't share with anyone`);

        return res.status(200).json({
            message: "OTP sent to your email",
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "Enter a valid email",
            error: error.message,
            success: false
        });
    }
};

export const verifyOtpAndCreateAccount = async (req, res) => {
    try {
        const { name, otp, password } = req.body;

        if (!name || !otp || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }
        const email = User.email;
        const existedUser = await User.findOne({ email });
        if (existedUser) {
            return res.status(400).json({
                message: "Email already existed",
                success: false
            });
        }

        if (User.otp != otp || User.otpExpiry < Date.now()) {
            return res.status(400).json({
                message: "Invalid or expired OTP",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            email,
            password: hashedPassword,
            name
        });

        User.otp = null;
        User.otpExpiry = null;

        return res.status(201).json({
            message: "Account created successfully",
            success: true
        });

    } catch (error) {
        res.status(500).json({
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
        User.otp = otp;
        User.otpExpiry = Date.now() + 5 * 60 * 1000;
        User.email = email;

        await sendEmail(email, "Todo Password Reset OTP", `Otp reset verification code of Todo App is ${otp} . and is valid for 5 minutes. Please don't share with anyone.`);

        res.status(200).json({
            message: "OTP sent to your email",
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: "Enter a valid email",
            error: error.message,
            success: false
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { otp, newPassword } = req.body;
        if (!otp || !newPassword) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const email = User.email;
        const user = await User.findOne({ email });

        if (!user || User.otp != otp || User.otpExpiry < Date.now()) {
            return res.status(400).json({
                message: "Invalid or expired OTP",
                success: false
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        User.otp = null;
        User.otpExpiry = null;

        return res.status(200).json({
            message: "Password reset successfully",
            success: true
        });
    } catch (error) {
        res.status(500).json({
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
        let user = await User.findOne({ email });
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

        const tokenData = {
            userId: user._id,
        };
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });

        user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            profile: user.profile,
        };

        return res
            .status(200)
            .cookie("token", token, {
                maxAge: 1 * 24 * 60 * 60 * 1000,
                httpsOnly: true,
                saneSite: "strict",
            })
            .json({
                message: `Welcome back ${user.name}`,
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
        const userId = req.id;

        if (!password) {
            return res.status(400).json({
                message: "Password is required to delete the account",
                success: false,
            });
        }

        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
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

        await User.findByIdAndDelete(userId);

        res.clearCookie("token");

        return res.status(200).json({
            message: "Account deleted successfully",
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
