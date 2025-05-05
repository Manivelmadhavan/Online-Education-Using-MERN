import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Video, MessageCircle } from 'lucide-react';

const HomeContent = () => {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Digital Library',
      description: 'Access a vast collection of educational resources and books.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Interactive Learning',
      description: 'Engage with peers and instructors in a collaborative environment.'
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: 'Virtual Meetings',
      description: 'Participate in live sessions and virtual classrooms.'
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Real-time Chat',
      description: 'Connect instantly with mentors and fellow learners.'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen p-8 bg-gray-900"
    >
      {/* Hero Section */}
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text"
        >
          Welcome to Interactive Learning
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-300 max-w-2xl mx-auto"
        >
          Discover a new way of learning with our interactive platform.
          Connect, collaborate, and grow together.
        </motion.p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-green-500 transition-colors"
          >
            <div className="text-green-500 mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Statistics Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {[
          { number: '1000+', label: 'Active Users' },
          { number: '500+', label: 'Course Materials' },
          { number: '24/7', label: 'Support Available' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center"
          >
            <motion.h4
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-green-500 mb-2"
            >
              {stat.number}
            </motion.h4>
            <p className="text-gray-300">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default HomeContent;