import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Video, Home, BookOpen, LayoutDashboard, Book, Terminal } from "lucide-react";
import ChatComponent from "../components/ChatComponent";
import MeetingComponent from "../components/MeetingComponent";
import ExamComponent from "../components/ExamComponent";
import BooksComponent from "../components/BooksComponent";
import HomeContent from "../components/HomeContent";
import { Navigate, useNavigate } from "react-router-dom";
import CompilerComponent from "../components/CompilerComponent";

const HomePage = () => {
	const navigate = useNavigate();
	const [showChat, setShowChat] = useState(false);
	const [showMeeting, setShowMeeting] = useState(false);
	const [showExam, setShowExam] = useState(false);
	const [showBooks, setShowBooks] = useState(false);
	const [showCompiler, setShowCompiler] = useState(false);
	const [selectedLanguage, setSelectedLanguage] = useState(null);

	const handleChatClick = () => {
		setShowChat(true);
		setShowMeeting(false);
		setShowExam(false);
		setShowBooks(false);
		setShowCompiler(false);
	};

	const handleMeetClick = () => {
		setShowMeeting(true);
		setShowChat(false);
		setShowExam(false);
		setShowBooks(false);
		setShowCompiler(false);
	};

	const handleExamClick = () => {
		setShowExam(true);
		setShowChat(false);
		setShowMeeting(false);
		setShowBooks(false);
		setShowCompiler(false);
	};

	const handleHomeClick = () => {
		setShowChat(false);
		setShowMeeting(false);
		setShowExam(false);
		setShowBooks(false);
		setShowCompiler(false);
	};

	const handleBooksClick = () => {
		setShowBooks(true);
		setShowChat(false);
		setShowMeeting(false);
		setShowExam(false);
		setShowCompiler(false);
	};

	const handleCompilerClick = () => {
		setShowCompiler(true);
		setShowBooks(false);
		setShowChat(false);
		setShowMeeting(false);
		setShowExam(false);
		setSelectedLanguage('Python');
	};

	return (
		<div className="flex h-screen w-screen bg-gray-900 bg-opacity-50 fixed top-0 left-0 overflow-hidden">
			{/* Navigation Sidebar */}
			<motion.div
				initial={{ x: -100, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="w-64 h-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl border-r border-gray-700 p-6 space-y-4"
			>
				<h2 className="text-2xl font-bold text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text mb-6">
					Intract App
				</h2>

				{/* Home Button */}
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
					font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
					focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900
					transition duration-200 flex items-center justify-center gap-2"
					onClick={handleHomeClick}
				>
					<Home className="w-5 h-5" />
					Home
				</motion.button>

				{/* Chat Button */}
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
					font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
					focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900
					transition duration-200 flex items-center justify-center gap-2"
					onClick={handleChatClick}
				>
					<MessageCircle className="w-5 h-5" />
					Chat
				</motion.button>

				{/* Meet Button */}
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
					font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
					focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900
					transition duration-200 flex items-center justify-center gap-2"
					onClick={handleMeetClick}
				>
					<Video className="w-5 h-5" />
					Meet
				</motion.button>

				{/* Exam Button */}
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
					font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
					focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900
					transition duration-200 flex items-center justify-center gap-2"
					onClick={handleExamClick}
				>
					<BookOpen className="w-5 h-5" />
					Exam
				</motion.button>

				{/* Books Button */}
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
					font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
					focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900
					transition duration-200 flex items-center justify-center gap-2"
					onClick={handleBooksClick}
				>
					<Book className="w-5 h-5" />
					Books
				</motion.button>

				{/* Compiler Button */}
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
					font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
					focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900
					transition duration-200 flex items-center justify-center gap-2"
					onClick={handleCompilerClick}
				>
					<Terminal className="w-5 h-5" />
					Compiler
				</motion.button>

				{/* Dashboard Button */}
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
					font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
					focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900
					transition duration-200 flex items-center justify-center gap-2"
					onClick={() => navigate('/')}
				>
					<LayoutDashboard className="w-5 h-5" />
					Dashboard
				</motion.button>
			</motion.div>

			{/* Main Content Area */}
			<div className="flex-1 p-8 overflow-y-auto">
				{showChat ? (
					<ChatComponent />
				) : showMeeting ? (
					<MeetingComponent />
				) : showExam ? (
					<ExamComponent />
				) : showBooks ? (
					<BooksComponent />
				) : showCompiler ? (
					<CompilerComponent language="Python" />
				) : (
					<HomeContent />
				)}
			</div>
		</div>
	);
};

export default HomePage;