import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ExamComponent = () => {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [userInfo, setUserInfo] = useState({
        username: '',
        email: ''
    });

    // Get questions from the admin (in a real app, these would come from the backend)
    const questions = [
        {
            id: 1,
            question: 'What is React?',
            options: [
                'A JavaScript library for building user interfaces',
                'A programming language',
                'A database management system',
                'An operating system'
            ],
            correctAnswer: 'A JavaScript library for building user interfaces'
        },
        {
            id: 2,
            question: 'What is a React Hook?',
            options: [
                'A way to add state to functional components',
                'A type of React component',
                'A debugging tool',
                'A third-party library'
            ],
            correctAnswer: 'A way to add state to functional components'
        },
        {
            id: 3,
            question: 'Which hook is used to perform side effects in React?',
            options: [
                'useEffect',
                'useState',
                'useContext',
                'useReducer'
            ],
            correctAnswer: 'useEffect'
        },
        {
            id: 4,
            question: 'What is JSX?',
            options: [
                'A syntax extension for JavaScript that allows writing HTML-like code',
                'A JavaScript compiler',
                'A new programming language',
                'A package manager'
            ],
            correctAnswer: 'A syntax extension for JavaScript that allows writing HTML-like code'
        },
        {
            id: 5,
            question: 'What is the virtual DOM in React?',
            options: [
                'A lightweight copy of the actual DOM for performance optimization',
                'A new web browser feature',
                'A type of JavaScript engine',
                'A database structure'
            ],
            correctAnswer: 'A lightweight copy of the actual DOM for performance optimization'
        },
        {
            id: 6,
            question: 'What is the purpose of React Router?',
            options: [
                'To handle routing and navigation in React applications',
                'To manage state in React applications',
                'To optimize React performance',
                'To handle API calls in React'
            ],
            correctAnswer: 'To handle routing and navigation in React applications'
        },
        {
            id: 7,
            question: 'What is the purpose of the useState hook?',
            options: [
                'To manage state in functional components',
                'To handle side effects',
                'To create custom hooks',
                'To optimize rendering'
            ],
            correctAnswer: 'To manage state in functional components'
        },
        {
            id: 8,
            question: 'What is prop drilling in React?',
            options: [
                'Passing props through multiple levels of components',
                'A way to create props',
                'A debugging technique',
                'A performance optimization'
            ],
            correctAnswer: 'Passing props through multiple levels of components'
        },
        {
            id: 9,
            question: 'What is the Context API used for?',
            options: [
                'To share data across components without prop drilling',
                'To create new components',
                'To handle routing',
                'To optimize performance'
            ],
            correctAnswer: 'To share data across components without prop drilling'
        },
        {
            id: 10,
            question: 'What is a controlled component in React?',
            options: [
                'A component where form data is controlled by React state',
                'A component with no state',
                'A component that controls other components',
                'A component with only props'
            ],
            correctAnswer: 'A component where form data is controlled by React state'
        }
    ];

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleUserInfoChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        let correctAnswers = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.correctAnswer) {
                correctAnswers++;
            }
        });
        setScore((correctAnswers / questions.length) * 100);
        setSubmitted(true);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 space-y-8 print:p-0 print:max-w-none print:space-y-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text mb-8">
                    Online Examination
                </h2>

                {!submitted ? (
                    <div className="space-y-6">
                        <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl border border-gray-700 rounded-lg p-6">
                            <h3 className="text-white text-lg font-medium mb-4">User Information</h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Enter your username"
                                    value={userInfo.username}
                                    onChange={handleUserInfoChange}
                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={userInfo.email}
                                    onChange={handleUserInfoChange}
                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                />
                            </div>
                        </div>
                        {questions.map((q) => (
                            <div key={q.id} className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl border border-gray-700 rounded-lg p-6">
                                <p className="text-white text-lg font-medium mb-4">{q.question}</p>
                                <div className="space-y-3">
                                    {q.options.map((option, index) => (
                                        <label key={index} className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer">
                                            <input
                                                type="radio"
                                                name={`question-${q.id}`}
                                                value={option}
                                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                className="form-radio text-green-500 focus:ring-green-500"
                                            />
                                            <span>{option}</span>
                                        </label>
                                    ))}                                    
                                </div>
                            </div>
                        ))}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
                            font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
                            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900
                            transition duration-200"
                        >
                            Submit Exam
                        </motion.button>
                    </div>
                ) : (
                    <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl border border-gray-700 rounded-lg p-6 print:bg-white print:text-black print:border-none print:shadow-none print:p-4">
                        <div className="print:text-black">
                            <h3 className="text-2xl font-bold text-green-400 mb-4 print:text-black">Exam Results</h3>
                            <div className="mb-4">
                                <p className="text-white print:text-black">Username: {userInfo.username}</p>
                                <p className="text-white print:text-black">Email: {userInfo.email}</p>
                            </div>
                            <p className="text-xl text-white mb-4 print:text-black">Score: {score.toFixed(2)}%</p>
                            <div className="space-y-4 mb-6">
                                {questions.map((q) => (
                                    <div key={q.id} className="border-b border-gray-700 pb-4 print:border-gray-300">
                                        <p className="text-white font-medium print:text-black">{q.question}</p>
                                        <p className="text-gray-400 print:text-gray-600 print:hidden">Your Answer: {answers[q.id] || 'Not answered'}</p>
                                        <p className={`${answers[q.id] === q.correctAnswer ? 'text-green-400' : 'text-red-400'} print:text-black print:hidden`}>
                                            {answers[q.id] === q.correctAnswer ? '✓ Correct' : '✗ Incorrect'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handlePrint}
                            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
                            font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
                            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900
                            transition duration-200 print:hidden"
                        >
                            Print Results
                        </motion.button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ExamComponent;