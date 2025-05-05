import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const UploadBookComponent = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('image', image);
      formData.append('bookPdf', pdf);

      const response = await axios.post('http://localhost:5000/api/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 'success') {
        setSuccess(true);
        setTitle('');
        setImage(null);
        setPdf(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
        Upload New Book
      </h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="title">
            Book Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="image">
            Book Cover Image (JPG, JPEG, PNG)
          </label>
          <input
            type="file"
            id="image"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="pdf">
            Book PDF
          </label>
          <input
            type="file"
            id="pdf"
            accept=".pdf"
            onChange={(e) => setPdf(e.target.files[0])}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500 text-white rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-500 text-white rounded">
            Book uploaded successfully!
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600
            text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
            focus:ring-offset-gray-900 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Uploading...' : 'Upload Book'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default UploadBookComponent;