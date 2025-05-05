import express from "express";
import {
	login,
	logout,
	signup,
	forgotPassword,
	resetPassword,
	checkAuth,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { User } from "../models/user.model.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/users", verifyToken, async (req, res) => {
	try {
		const users = await User.find().select("-password");
		res.status(200).json({ success: true, users });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

export default router;
