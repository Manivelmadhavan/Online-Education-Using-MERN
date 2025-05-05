import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		receiver: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		type: {
			type: String,
			enum: ["text", "emoji", "document", "image", "video", "voice"],
			default: "text",
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		fileUrl: {
			type: String,
			required: false,
		},
		read: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);