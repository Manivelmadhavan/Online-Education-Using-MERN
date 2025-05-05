import React, { useState, useEffect, useRef } from "react";
import { User, Circle, File, Send, Upload } from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";
import { useAuthStore } from "../store/authStore";
import UserList from "./UserList";


const ChatComponent = () => {
	const [users, setUsers] = useState([]);
	const [error, setError] = useState(null);
	const [selectedUser, setSelectedUser] = useState(null);
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [selectedFile, setSelectedFile] = useState(null);
	const socket = useRef();
	const { user } = useAuthStore();
	const fileInputRef = useRef();

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get(`${import.meta.env.MODE === "development" ? "http://localhost:5000" : ""}/api/auth/users`, { withCredentials: true });
				if (response.data && response.data.users) {
					const filteredUsers = response.data.users.filter(u => u._id !== user?._id);
					setUsers(filteredUsers);
				} else {
					setError("No users found");
				}
			} catch (err) {
				setError(err.response?.data?.message || "Error fetching users");
			}
		};

		if (user) {
			fetchUsers();

			// Initialize socket connection
			socket.current = io(import.meta.env.MODE === "development" ? "http://localhost:5000" : "/", {
				withCredentials: true,
				transports: ['websocket']
			});
			socket.current.emit("addUser", user._id);

			// Listen for online users
			socket.current.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			// Listen for incoming messages
			socket.current.on("getMessage", (message) => {
				if (selectedUser?._id === message.sender._id) {
					setMessages(prev => [...prev, message]);
				}
			});
		}

		return () => {
			socket.current?.disconnect();
		};
	}, [user]);

	useEffect(() => {
		if (selectedUser) {
			const fetchMessages = async () => {
				try {
					setIsLoading(true);
					const response = await axios.get(`${import.meta.env.MODE === "development" ? "http://localhost:5000" : ""}/api/chat/messages/${selectedUser._id}`, { withCredentials: true });
					if (response.data.success) {
						setMessages(response.data.messages);
					}
				} catch (err) {
					setError(err.response?.data?.message || "Error fetching messages");
				} finally {
					setIsLoading(false);
				}
			};
			fetchMessages();
		}
	}, [selectedUser]);

	const handleSendMessage = async () => {
		if ((!newMessage.trim() && !selectedFile) || !selectedUser) return;

		try {
			let messageData = {
				receiverId: selectedUser._id,
				type: selectedFile ? "document" : "text",
				content: newMessage.trim() || selectedFile.name,
			};

			if (selectedFile) {
				const formData = new FormData();
				formData.append("file", selectedFile);
				const uploadResponse = await axios.post(`${import.meta.env.MODE === "development" ? "http://localhost:5000" : ""}/api/chat/upload`, formData, { withCredentials: true });
				messageData.fileUrl = uploadResponse.data.fileUrl;
			}

			const response = await axios.post(`${import.meta.env.MODE === "development" ? "http://localhost:5000" : ""}/api/chat/messages`, messageData, { withCredentials: true });

			if (response.data.success) {
				setMessages([...messages, response.data.message]);
				setNewMessage("");
				setSelectedFile(null);
				
				// Emit message through socket
				socket.current.emit("sendMessage", {
					receiverId: selectedUser._id,
					...messageData
				});
			}
		} catch (err) {
			setError(err.response?.data?.message || "Error sending message");
		}
	};

	const handleFileSelect = (e) => {
		const file = e.target.files[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	return (
		<div className="flex h-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-lg overflow-hidden">
			{/* Users List */}
			<div className="w-72 border-r border-gray-700">
				<div className="p-4">
					<div className="space-y-2">
						{users.map((user) => (
							<div
								key={user._id}
								className={`flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg cursor-pointer ${selectedUser?._id === user._id ? 'bg-gray-700' : ''}`}
								onClick={() => setSelectedUser(user)}
							>
								<div className="relative">
									<User className="w-10 h-10 text-gray-400" />
									<Circle className={`w-3 h-3 ${onlineUsers.includes(user._id) ? 'bg-green-500' : 'bg-gray-500'} rounded-full absolute bottom-0 right-0`} />
								</div>
								<div>
									<h4 className="text-white font-medium">{user.name}</h4>
									<p className="text-gray-400 text-sm">{user.email}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Chat Window */}
			<div className="flex-1 flex flex-col">
				{/* Chat Header */}
				<div className="p-4 border-b border-gray-700 flex items-center space-x-3">
					<User className="w-8 h-8 text-gray-400" />
					<div>
						<h4 className="text-white font-medium">
							{selectedUser ? selectedUser.name : "Select a user to chat"}
						</h4>
					</div>
				</div>

				{/* Messages */}
				<div className="flex-1 overflow-y-auto p-4 space-y-4">
					{isLoading ? (
						<div className="flex justify-center items-center h-full">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
						</div>
					) : (
						messages.map((message) => (
							<div
								key={message._id}
								className={`flex ${message.sender._id === selectedUser?._id ? 'justify-start' : 'justify-end'}`}
							>
								<div
									className={`max-w-xs px-4 py-2 rounded-lg ${message.sender._id !== selectedUser?._id ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 'bg-gray-700 text-white'}`}
								>
									<p>{message.content}</p>
									<span className="text-xs opacity-75 mt-1 block">
										{new Date(message.createdAt).toLocaleTimeString()}
									</span>
								</div>
							</div>
						))
					)}
				</div>

				{/* Message Input */}
				<div className="p-4 border-t border-gray-700">
					<div className="flex space-x-2">
						<input
							type="text"
							placeholder="Type a message..."
							value={newMessage}
							onChange={(e) => setNewMessage(e.target.value)}
							onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
							className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
						/>
						<input
							type="file"
							ref={fileInputRef}
							className="hidden"
							onChange={handleFileSelect}
						/>
						<button
							onClick={() => fileInputRef.current.click()}
							className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200"
						>
							<Upload className="w-6 h-6" />
						</button>
						<button
							onClick={handleSendMessage}
							className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 transition duration-200 flex items-center gap-2"
						>
							<Send className="w-5 h-5" />
							Send
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatComponent;