import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import DashboardPage from "./DashboardPage";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [validationError, setValidationError] = useState("");

	const { login, isLoading, error } = useAuthStore();

	const navigate = useNavigate();

	const validateForm = () => {
		if (!email || !password) {
			setValidationError("Email and password are required");
			return false;
		}
		if (!email.includes("@")) {
			setValidationError("Please enter a valid email address");
			return false;
		}
		if (password.length < 6) {
			setValidationError("Password must be at least 6 characters long");
			return false;
		}
		setValidationError("");
		return true;
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		try {
			await login(email.trim(), password);
			toast.success("Login successful!");
		} catch (error) {
			// Error is already handled by the auth store
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
		>
			<div className='p-8'>
				<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
					Welcome Back
				</h2>

				<form onSubmit={handleLogin}>
					<Input
						icon={Mail}
						type='email'
						placeholder='Email Address'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>

					<Input
						icon={Lock}
						type='password'
						placeholder='Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>

					<div className='flex items-center mb-6'>
						<Link to='/forgot-password' className='text-sm text-green-400 hover:underline'>
							Forgot password?
						</Link>
					</div>
					{validationError && <p className='text-red-500 font-semibold mb-2'>{validationError}</p>}
					{error && <p className='text-red-500 font-semibold mb-2'>{error}</p>}

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
						type='submit'
						disabled={isLoading}
					>
						{isLoading ? <Loader className='w-6 h-6 animate-spin  mx-auto' /> : "Login"}
					</motion.button>
				</form>
			</div>
			<div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
				<p className='text-sm text-gray-400'>
					Don't have an account?{" "}
					<Link to='/signup' className='text-green-400 hover:underline'>
						Sign up
					</Link>
				</p>
			</div>
		</motion.div>
	);
};
export default LoginPage;
