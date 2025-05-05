import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Create temp directory if it doesn't exist
const tempDir = path.join(process.cwd(), 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
import compilerRouter from './routes/compiler.route.js';
app.use('/api/compiler', compilerRouter);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/bookstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = file.fieldname === 'coverImage' ? 'uploads/covers' : 'uploads/books';
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'coverImage') {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed for cover!'));
      }
    }
    cb(null, true);
  }
});

// Book Schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  coverImagePath: { type: String, required: true },
  bookFilePath: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now }
});

const Book = mongoose.model('Book', bookSchema);

// Upload endpoint
app.post('/api/books/upload', 
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'bookFile', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      if (!req.files || !req.files.coverImage || !req.files.bookFile) {
        return res.status(400).json({ error: 'Both cover image and book file are required' });
      }

      const book = new Book({
        title: req.body.title,
        coverImagePath: req.files.coverImage[0].path,
        bookFilePath: req.files.bookFile[0].path
      });

      await book.save();
      res.status(201).json({ message: 'Book uploaded successfully', book });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Error uploading book' });
    }
  }
);

// Create upload directories if they don't exist
const uploadDirs = ['uploads/covers', 'uploads/books'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});