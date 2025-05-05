const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Book = require('../models/Book');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set different destinations based on file type
    const dest = file.fieldname === 'coverImage' 
      ? 'uploads/covers'
      : 'uploads/books';
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Handle book upload
router.post('/upload', 
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'bookFile', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      if (!req.files || !req.files.coverImage || !req.files.bookFile) {
        return res.status(400).json({ error: 'Please upload both cover image and book file' });
      }

      const book = new Book({
        title: req.body.title,
        coverImagePath: req.files.coverImage[0].path,
        bookFilePath: req.files.bookFile[0].path
      });

      await book.save();
      res.status(201).json({ message: 'Book uploaded successfully', book });

    } catch (error) {
      console.error('Error uploading book:', error);
      res.status(500).json({ error: 'Error uploading book' });
    }
  }
);

module.exports = router;