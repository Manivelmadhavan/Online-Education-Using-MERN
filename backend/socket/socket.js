import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.NODE_ENV === "development" ? "http://localhost:5174" : "*",
            credentials: true,
            methods: ["GET", "POST"],
            allowedHeaders: ["Content-Type"]
        }
    });

    const onlineUsers = new Map();

    io.on("connection", (socket) => {
        console.log("User connected", socket.id);

        socket.on("addUser", (userId) => {
            onlineUsers.set(userId, socket.id);
            io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
        });

        socket.on("sendMessage", async ({ receiverId, type, content, fileUrl }) => {
            try {
                const message = new Message({
                    sender: socket.userId,
                    receiver: receiverId,
                    type,
                    content,
                    fileUrl
                });

                await message.save();
                await message.populate("sender", "name");
                await message.populate("receiver", "name");

                const receiverSocketId = onlineUsers.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("getMessage", message);
                }
            } catch (error) {
                console.error("Error sending message:", error);
            }
        });

        socket.on("disconnect", () => {
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }
            io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
        });
    });
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};