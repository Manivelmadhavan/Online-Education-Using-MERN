import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
	const token = req.cookies.token;
	if (!token) return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });

		req.userId = decoded.userId;
		
		// Fetch user from database and attach to request
		const user = await User.findById(decoded.userId);
		if (!user) return res.status(404).json({ success: false, message: "User not found" });
		
		req.user = user;
		next();
	} catch (error) {
		console.log("Error in verifyToken ", error);
		if (error.name === 'JsonWebTokenError') {
			return res.status(401).json({ success: false, message: "Invalid token signature" });
		} else if (error.name === 'TokenExpiredError') {
			return res.status(401).json({ success: false, message: "Token has expired" });
		}
		return res.status(500).json({ success: false, message: "Server error" });
	}
};
