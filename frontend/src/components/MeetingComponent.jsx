import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
 import io from "socket.io-client";

const MeetingComponent = () => {
  const [meetingTitle, setMeetingTitle] = useState("personal meeting");
  const [showMeetingForm, setShowMeetingForm] = useState(true);
  const [roomID, setRoomID] = useState("");
  const [joinUrl, setJoinUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messageStatus, setMessageStatus] = useState({});
  const { user } = useAuthStore();
  const meetingContainerRef = useRef(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Function to generate a random ID for the meeting
  const generateRandomID = (length = 5) => {
    let result = "";
    const chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
    const maxPos = chars.length;
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
  };

  // Function to start a new meeting
  const startMeeting = async () => {
    if (!meetingTitle.trim()) {
      alert("Please enter a meeting title");
      return;
    }

    setIsLoading(true);
    const newRoomID = generateRandomID();
    setRoomID(newRoomID);
    
    // Generate join URL for sharing
    const baseUrl = "http://localhost:3000";
    const joinMeetingUrl = `${baseUrl}/join/${meetingTitle.replace(/ /g, "%20")}?roomID=${newRoomID}`;
    setJoinUrl(joinMeetingUrl);
    
    // Navigate to the meeting URL immediately
    window.location.href = joinMeetingUrl;
  };

  // Function to join an existing meeting
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const joinMeeting = () => {
    setShowJoinDialog(true);
  };

  const handleJoinMeetingSubmit = () => {
    window.open(`${searchQuery}`, "_blank");
  };

  const handleJoinMeetingUrl = (meetingUrl) => {
    try {
      const url = new URL(meetingUrl);
      const params = new URLSearchParams(url.search);
      const roomIDFromUrl = params.get("roomID");
      
      if (!roomIDFromUrl) {
        alert("Invalid meeting URL");
        return;
      }
      
      setRoomID(roomIDFromUrl);
      setShowMeetingForm(false);
      
      // Extract meeting title from URL if possible
      const pathParts = url.pathname.split("/");
      const titleFromUrl = pathParts[pathParts.length - 1];
      if (titleFromUrl) {
        setMeetingTitle(decodeURIComponent(titleFromUrl));
      }
      
      // In a real implementation, we would initialize ZegoCloud here
      initializeVideoSDK(roomIDFromUrl, meetingTitle);
    } catch (error) {
      alert("Invalid meeting URL");
      console.error("Error parsing meeting URL:", error);
    }
  };

  useEffect(() => {
    if (roomID) {
      socketRef.current = io("http://localhost:3000");
      
      // Join room and request message history
      socketRef.current.emit("join-room", { roomID, user });
      socketRef.current.emit("get-message-history", { roomID });
      
      socketRef.current.on("message-history", (history) => {
        setMessages(history);
      });

      socketRef.current.on("user-connected", (users) => {
        setOnlineUsers(users);
      });
      
      socketRef.current.on("user-disconnected", (users) => {
        setOnlineUsers(users);
      });
      
      socketRef.current.on("message", (message) => {
        setMessages((prevMessages) => {
          // Check if message already exists to prevent duplicates
          const messageExists = prevMessages.some(msg => msg.id === message.id);
          if (messageExists) return prevMessages;
          return [...prevMessages, message];
        });

        if (message.sender !== user.name) {
          setUnreadCount(prev => prev + 1);
          if (Notification.permission === "granted") {
            new Notification("New Message", {
              body: `${message.sender}: ${message.text}`,
              icon: "/notification-icon.png"
            });
          }
        }
        socketRef.current.emit("message-received", { messageId: message.id, roomID });
      });
      
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [roomID, user]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socketRef.current) {
      const messageData = {
        id: Date.now().toString(),
        text: newMessage,
        sender: user.name,
        timestamp: new Date().toISOString(),
        roomID,
        status: "sent"
      };
      
      setMessageStatus(prev => ({
        ...prev,
        [messageData.id]: "sent"
      }));
      
      socketRef.current.emit("send-message", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage("");
    }
  };

  const initializeVideoSDK = (roomID, title) => {
    setRoomID(roomID);
    if (meetingContainerRef.current) {
      meetingContainerRef.current.innerHTML = "";
      const meetingContent = document.createElement("div");
      meetingContent.className = "flex flex-col h-full bg-gray-800 rounded-lg p-4 text-white";
      meetingContent.innerHTML = `
        <div class="flex-none mb-4">
          <h2 class="text-2xl font-bold">Meeting: ${title}</h2>
          <p class="text-sm text-gray-400">Room ID: ${roomID}</p>
        </div>
        <div class="flex-1 overflow-y-auto mb-4 bg-gray-700 rounded-lg p-4" id="messages-container">
          <div class="space-y-4" id="messages-list"></div>
        </div>
        <form class="flex-none flex gap-2" id="message-form">
          <input
            type="text"
            placeholder="Type your message..."
            class="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Send
          </button>
        </form>
      `;
      
      meetingContainerRef.current.appendChild(meetingContent);
      
      const messagesList = document.getElementById("messages-list");
      const messageForm = document.getElementById("message-form");
      const messageInput = messageForm.querySelector("input");
      
      messageForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (messageInput.value.trim()) {
          const messageData = {
            text: messageInput.value,
            sender: user.name,
            timestamp: new Date().toISOString(),
            roomID
          };
          
          socketRef.current.emit("send-message", messageData);
          setMessages((prevMessages) => [...prevMessages, messageData]);
          messageInput.value = "";
        }
      });
      
      const renderMessage = (message) => {
        const messageElement = document.createElement("div");
        messageElement.className = `flex flex-col ${message.sender === user.name ? "items-end" : "items-start"}`;
        const statusIcon = message.sender === user.name ? `
          <span class="text-xs text-gray-400 ml-2">
            ${messageStatus[message.id] === "sent" ? "✓" : "✓✓"}
          </span>` : "";
        messageElement.innerHTML = `
          <div class="${message.sender === user.name ? "bg-green-500" : "bg-gray-600"} rounded-lg px-4 py-2 max-w-[80%]">
            <p class="text-sm font-semibold">${message.sender}</p>
            <p>${message.text}</p>
            <p class="text-xs opacity-75">${new Date(message.timestamp).toLocaleTimeString()} ${statusIcon}</p>
            ${onlineUsers.includes(message.sender) ? '<span class="text-xs text-green-500 ml-2">●</span>' : '<span class="text-xs text-gray-500 ml-2">●</span>'}
          </div>
        `;
        messagesList.appendChild(messageElement);
        messageElement.scrollIntoView({ behavior: "smooth" });
      };
      
      socketRef.current.on("message", renderMessage);
    }
  };

  return (
    <div className="h-full w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-lg overflow-hidden">
      {showMeetingForm ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center h-full p-8"
        >
          {showJoinDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <div className="bg-gray-800 rounded-lg p-8 flex flex-col items-center w-96">
                <h3 className="text-white text-xl mb-4">Search Google</h3>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your search query"
                />
                <div className="flex gap-4">
                  <button
                    onClick={handleJoinMeetingSubmit}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Search
                  </button>
                  <button
                    onClick={() => {
                      setShowJoinDialog(false);
                      setSearchQuery("");
                    }}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <div className="bg-gray-800 rounded-lg p-8 flex flex-col items-center">
                <div className="w-16 h-16 border-t-4 border-green-500 border-solid rounded-full animate-spin mb-4"></div>
                <p className="text-white text-lg">Starting your meeting...</p>
              </div>
            </motion.div>
          )}
          <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-center text-white mb-6">Start or Join a Meeting</h2>
            
            {/* Meeting Title Input */}
            <div className="mb-6">
              <label className="block text-gray-300 mb-2" htmlFor="meeting-title">
                Meeting Title
              </label>
              <input
                id="meeting-title"
                type="text"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter meeting title"
              />
            </div>
            
            {/* Start Meeting Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startMeeting}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
              font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900
              transition duration-200 mb-4"
            >
              Start Meeting
            </motion.button>
            
            {/* Join Meeting Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={joinMeeting}
              className="w-full py-3 px-4 bg-gray-700 text-white 
              font-bold rounded-lg shadow-lg hover:bg-gray-600
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900
              transition duration-200"
            >
              Join Meeting
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <div 
          ref={meetingContainerRef} 
          className="w-full h-full"
        ></div>
      )}
    </div>
  );
};

export default MeetingComponent;
