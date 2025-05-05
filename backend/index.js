import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { createServer } from "http";
import multer from "multer";
import { initSocket } from "./socket/socket.js";
import fs from "fs";

import { connectDB } from "./db/connectDB.js";

import authRoutes from "./routes/auth.route.js";
import chatRoutes from "./routes/chat.route.js";
import compilerRoutes from "./routes/compiler.route.js";

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = 5000;
const __dirname = path.resolve();

// Initialize socket.io
initSocket(server);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });


app.use(cors({
  origin: process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : 'https://your-production-domain.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/compiler", compilerRoutes);

// File upload endpoint
app.post('/api/chat/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, fileUrl });
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

if (process.env.NODE_ENV === "development") {
	app.get("/", (req, res) => {
		res.redirect(process.env.CLIENT_URL);
	});
} else if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

server.listen(PORT, () => {
	connectDB();
	console.log("Server is running on port:", PORT);
});
