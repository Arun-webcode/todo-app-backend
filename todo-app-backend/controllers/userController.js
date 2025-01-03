import { User } from "../models/user.model.js"
import { sendEmail } from "../config/sendOtp.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);
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

        console.log(User.otp + " -- " + User.otpExpiry);

        await sendEmail(email, "Your OTP Code", `Your OTP is ${otp}`);

        return res.status(200).json({
            message: "OTP sent to your email",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const verifyOtpAndCreateAccount = async (req, res) => {
    try {
        const { otp, password } = req.body;

        if (!otp || !password) {
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
            password: hashedPassword
        });

        return res.status(201).json({
            message: "Account created successfully",
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
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
        user.otp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000;
        await user.save();

        await sendEmail(email, "Password Reset OTP", `Your OTP is ${otp}`);

        res.status(200).json({
            message: "OTP sent to your email",
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
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
        if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({
                message: "Invalid or expired OTP",
                success: false
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        return res.status(200).json({
            message: "Password reset successfully",
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
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
                message: "Incorrect email and password",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email and password",
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
        console.log(error);
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name, email, bio } = req.body;
        const userId = req.id; //middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false,
            });
        }

        // updating data
        if (name) user.name = name;
        if (email) user.email = email;
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
        console.log(error);
    }
};