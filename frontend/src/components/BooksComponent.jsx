import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

const BooksComponent = () => {
  // Sample books data - replace with your actual books data
  const books = [
    {
      id: 1,
      title: 'C++',
      imagePath: '/BooksImage/c++Book.jpeg',
      downloadPath: '/BooksImage/c++Book.pdf',
      description: 'Comprehensive guide to C++ programming covering fundamentals to advanced concepts.'
    },
    {
      id: 2,
      title: '.Net',
      imagePath: '/BooksImage/.netBook.jpeg',
      downloadPath: '/BooksImage/.netBook.pdf',
      description: 'Master .NET framework with practical examples and best practices.'
    },
    {
        id: 3,
        title: 'Css',
        imagePath: '/BooksImage/CssBook.jpeg',
        downloadPath: '/BooksImage/CssBook.pdf',
        description: 'Learn modern CSS techniques for responsive and beautiful web designs.'
      },
      {
        id: 4,
        title: 'Express Js',
        imagePath: '/BooksImage/ExpressJsBook.jpeg',
        downloadPath: '/BooksImage/ExpressJsBook.pdf',
        description: 'Build robust backend applications with Express.js framework.'
      },
      {
        id: 5,
        title: 'HTML',
        imagePath: '/BooksImage/HtmlBook.jpeg',
        downloadPath: '/BooksImage/HtmlBook.pdf',
        description: 'Complete reference for HTML5 with semantic markup and accessibility.'
      },
      {
        id: 6,
        title: 'Java',
        imagePath: '/BooksImage/JavaBook.jpeg',
        downloadPath: '/BooksImage/JavaBook.pdf',
        description: 'Java programming from basics to object-oriented concepts.'
      },
      {
        id: 7,
        title: 'Java Script',
        imagePath: '/BooksImage/JavascriptBook.jpeg',
        downloadPath: '/BooksImage/JavascriptBook.pdf',
        description: 'Modern JavaScript including ES6+ features and best practices.'
      },
      {
        id: 8,
        title: 'Programming in C',
        imagePath: '/BooksImage/ProgrammingCBook.jpeg',
        downloadPath: '/BooksImage/ProgrammingCBook.pdf',
        description: 'Fundamentals of C programming with practical examples.'
      },
      {
        id: 9,
        title: 'Python',
        imagePath: '/BooksImage/PythonBook.jpeg',
        downloadPath: '/BooksImage/PythonBook.pdf',
        description: 'Python programming for beginners to advanced developers.'
      },
      {
        id: 10,
        title: 'React',
        imagePath: '/BooksImage/ReactBook.jpeg',
        downloadPath: '/BooksImage/ReactBook.pdf',
        description: 'Build modern web applications with React.js framework.'
      },
      {
        id: 11,
        title: 'Php',
        imagePath: '/BooksImage/PhpBook.jpeg',
        downloadPath: '/BooksImage/PhpBook.pdf',
        description: 'Server-side scripting with PHP for dynamic web development.'
      },
      {
        id: 11,
        title: 'Go (Golang)',
        imagePath: '/BooksImage/Go.jpeg',
        downloadPath: '/BooksImage/goBook.pdf',
        description: 'Server-side scripting with PHP for dynamic web development.'
      },
      {
        id: 12,
        title: 'Swift',
        imagePath: '/BooksImage/Swift.png',
        downloadPath: '/BooksImage/Swift.pdf',
        description: 'Server-side scripting with PHP for dynamic web development.'
      },
      {
        id: 13,
        title: 'SQL',
        imagePath: '/BooksImage/SQL.jpeg',
        downloadPath: '/BooksImage/SQL.pdf',
        description: 'Database management with SQL for data storage and retrieval.'
      },
    // Add more books as needed
  ];

  const handleDownload = (downloadPath) => {
    // Create a link element
    const link = document.createElement('a');
    link.href = downloadPath;
    link.download = downloadPath.split('/').pop(); // Get the filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4"
    >
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
        Available Books
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {books.map((book) => (
          <motion.div
            key={book.id}
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 w-full max-w-xs mx-auto my-4"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src={book.imagePath}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white mb-1">{book.title}</h3>
              <p className="text-gray-400 text-sm mb-2">{book.description}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600
                text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                focus:ring-offset-gray-900 transition duration-200 flex items-center justify-center gap-2"
                onClick={() => handleDownload(book.downloadPath)}
              >
                <Download className="w-5 h-5" />
                Download
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default BooksComponent;