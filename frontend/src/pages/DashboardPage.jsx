import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
	const { user, logout } = useAuthStore();
	const navigate = useNavigate();

	// Mock data for educational metrics
	const educationMetrics = {
		activeCourses: 12,
		completedCourses: 8,
		upcomingClasses: 3,
		overallProgress: 75
	};

	const handleLogout = () => {
		logout();
	};

	const handleOpen = () => {
		navigate("/home");
	};

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.5 }}
			className='max-w-6xl w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
		>
			<motion.h2
				initial={{ y: -20 }}
				animate={{ y: 0 }}
				transition={{ type: "spring", stiffness: 300 }}
				className='text-4xl font-bold mb-8 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text'
			>
				Education Dashboard
			</motion.h2>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
				<motion.div
					whileHover={{ scale: 1.05 }}
					className='p-6 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 text-center'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
				>
					<h3 className='text-xl font-semibold text-green-400 mb-2'>Active Courses</h3>
					<p className='text-4xl font-bold text-white'>{educationMetrics.activeCourses}</p>
				</motion.div>
				<motion.div
					whileHover={{ scale: 1.05 }}
					className='p-6 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 text-center'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<h3 className='text-xl font-semibold text-green-400 mb-2'>Completed Courses</h3>
					<p className='text-4xl font-bold text-white'>{educationMetrics.completedCourses}</p>
				</motion.div>
				<motion.div
					whileHover={{ scale: 1.05 }}
					className='p-6 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 text-center'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					<h3 className='text-xl font-semibold text-green-400 mb-2'>Upcoming Classes</h3>
					<p className='text-4xl font-bold text-white'>{educationMetrics.upcomingClasses}</p>
				</motion.div>
				<motion.div
					whileHover={{ scale: 1.05 }}
					className='p-6 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 text-center'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<h3 className='text-xl font-semibold text-green-400 mb-2'>Overall Progress</h3>
					<p className='text-4xl font-bold text-white'>{educationMetrics.overallProgress}%</p>
				</motion.div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<motion.div
					className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<h3 className='text-xl font-semibold text-green-400 mb-3'>Profile Information</h3>
					<p className='text-gray-300'>Name: {user.name}</p>
					<p className='text-gray-300'>Email: {user.email}</p>
				</motion.div>
				<motion.div
					className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<h3 className='text-xl font-semibold text-green-400 mb-3'>Account Activity</h3>
					<p className='text-gray-300'>
						<span className='font-bold'>Joined: </span>
						{new Date(user.createdAt).toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</p>
					<p className='text-gray-300'>
						<span className='font-bold'>Last Login: </span>

						{formatDate(user.lastLogin)}
					</p>
				</motion.div>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6 }}
				className='mt-4 space-y-3'
			>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleOpen}
					className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
				font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
				 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900'
				>
					Open Home
				</motion.button>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleLogout}
					className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
				font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
				 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900'
				>
					Logout
				</motion.button>
			</motion.div>
		</motion.div>
	);
};
export default DashboardPage;
