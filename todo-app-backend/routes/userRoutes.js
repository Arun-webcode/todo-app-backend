import express from "express";
import { login, logout, register, updateProfile } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router
    .route("/profile/update")
    .post(authMiddleware, updateProfile);

export default router;
