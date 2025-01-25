import express from "express";
import { deleteAccount, getUserDetails, login, logout, register, resetPassword, sendResetPasswordOtp, updateProfile, verifyOtpAndCreateAccount } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/register").post(register); //For sending Otp only
router.route("/createaccount").post(verifyOtpAndCreateAccount);
router.route("/sendotp").post(sendResetPasswordOtp);  //For sending Otp only
router.route("/resetpassword").put(resetPassword);
router.route("/login").post(login);
router.route("/logout").get(authMiddleware, logout);
router.route("/deleteaccount").delete(authMiddleware, deleteAccount);
router.route("/profile/update").put(authMiddleware, updateProfile);
router.route("/getUserDetails").get(authMiddleware, getUserDetails);

export default router;
