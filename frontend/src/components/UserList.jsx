import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const { user } = useAuthStore();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.MODE === "development" ? "http://localhost:5173" : ""}/api/auth/users`, { withCredentials: true });
        if (response.data && response.data.users) {
          const filteredUsers = response.data.users.filter(u => u._id !== user?._id);
          setUsers(filteredUsers);
        } else {
          setError('No users found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching users');
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-4 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">User List</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg"
          >
            <User className="w-8 h-8 text-gray-400" />
            <div>
              <h4 className="text-white font-medium">{user.name}</h4>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;