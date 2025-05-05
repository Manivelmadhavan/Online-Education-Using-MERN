import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Trash2 } from 'lucide-react';

const CompilerComponent = ({ language }) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRunCode = async () => {
    if (!code.trim()) {
      setError('Please enter some code to run');
      return;
    }

    setIsLoading(true);
    setError('');
    setOutput('');

    try {
      const response = await fetch('http://localhost:5000/api/compiler/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language: language.toLowerCase(),
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setOutput(data.output || 'No output generated');
      }
    } catch (err) {
      setError(err.message || 'Failed to execute code. Please try again.');
      console.error('Code execution error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCode = () => {
    setCode('');
    setOutput('');
    setError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 bg-gray-900 rounded-xl shadow-xl"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-500 mb-2">{language} Compiler</h2>
        <p className="text-gray-400">Write your {language} code below and click Run to execute</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Editor Section */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Code Editor</h3>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRunCode}
                disabled={isLoading}
                className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
              >
                <Play className="w-4 h-4" />
                {isLoading ? 'Running...' : 'Run'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearCode}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </motion.button>
            </div>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-[400px] bg-gray-900 text-green-500 p-4 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder={`# Enter your ${language} code here\n\n# Example:\nprint("Hello, World!")`}
          />
        </div>

        {/* Output Section */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Output</h3>
          <div className="h-[400px] bg-gray-900 rounded-lg p-4 overflow-auto">
            {error ? (
              <pre className="text-red-500 font-mono text-sm">{error}</pre>
            ) : output ? (
              <pre className="text-green-500 font-mono text-sm">{output}</pre>
            ) : (
              <p className="text-gray-500 italic">Output will appear here after running the code</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CompilerComponent;