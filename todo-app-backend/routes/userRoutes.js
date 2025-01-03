import express from "express";
import { login, logout, register, resetPassword, sendResetPasswordOtp, updateProfile, verifyOtpAndCreateAccount } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/verifyAndCreateAccount").post(verifyOtpAndCreateAccount);
router.route("/login").post(login);
router.route("/resetPassword").post(resetPassword);
router.route("/sendResetPasswordOtp").post(sendResetPasswordOtp);
router.route("/logout").get(logout);
router
    .route("/profile/update")
    .post(authMiddleware, updateProfile);

export default router;
