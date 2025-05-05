import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

const router = express.Router();

// Get chat history between two users
router.get("/messages/:userId", verifyToken, async (req, res) => {
	try {
		const { userId } = req.params;
		const messages = await Message.find({
			$or: [
				{ sender: req.user._id, receiver: userId },
				{ sender: userId, receiver: req.user._id },
			],
		})
			.sort({ createdAt: 1 })
			.populate("sender", "name")
			.populate("receiver", "name");

		res.status(200).json({ success: true, messages });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

// Send a new message
router.post("/messages", verifyToken, async (req, res) => {
	try {
		const { receiverId, type, content, fileUrl } = req.body;

		const newMessage = new Message({
			sender: req.user._id,
			receiver: receiverId,
			type,
			content,
			fileUrl,
		});

		await newMessage.save();

		// Populate sender and receiver information
		await newMessage.populate("sender", "name");
		await newMessage.populate("receiver", "name");

		res.status(201).json({ success: true, message: newMessage });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

// Mark messages as read
router.put("/messages/read/:senderId", verifyToken, async (req, res) => {
	try {
		const { senderId } = req.params;
		await Message.updateMany(
			{
				sender: senderId,
				receiver: req.user._id,
				read: false,
			},
			{ read: true }
		);

		res.status(200).json({ success: true });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

export default router;