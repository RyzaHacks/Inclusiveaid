import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaUserPlus, FaUserMinus, FaTimes } from 'react-icons/fa';
import api from '../../utils/api';

const AssignUsersModal = ({ isOpen, onClose, selectedCourse, onAssignUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [enrolledUserIds, setEnrolledUserIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && selectedCourse) {
      fetchUsersAndCourse();
    }
  }, [isOpen, selectedCourse]);

  const fetchUsersAndCourse = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [allUsersResponse, enrolledUsersResponse] = await Promise.all([
        api.get('/api/users/admin/users'),
        api.get(`/api/users/courses/${selectedCourse.id}/users`)
      ]);

      setAllUsers(allUsersResponse.data);
      setEnrolledUserIds(enrolledUsersResponse.data.map(user => user.id));
    } catch (err) {
      console.error('Error fetching users and course:', err);
      setError('Failed to fetch users and course details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserToggle = (userId) => {
    setEnrolledUserIds(prevIds => 
      prevIds.includes(userId)
        ? prevIds.filter(id => id !== userId)
        : [...prevIds, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onAssignUsers(selectedCourse.id, enrolledUserIds);
  };

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Assign Users to Course</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-primary-200 transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>
            <p className="mt-2 text-primary-100">{selectedCourse?.title}</p>
          </div>

          <div className="p-6">
            <div className="mb-6 relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 px-4 pl-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center my-4 p-4 bg-red-100 rounded-lg">
                {error}
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredUsers.map(user => (
                  <div
                    key={user.id}
                    onClick={() => handleUserToggle(user.id)}
                    className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all ${
                      enrolledUserIds.includes(user.id)
                        ? 'bg-primary-100 hover:bg-primary-200'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    {enrolledUserIds.includes(user.id) ? (
                      <FaUserMinus className="text-red-500" size={20} />
                    ) : (
                      <FaUserPlus className="text-green-500" size={20} />
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
              >
                Assign Users
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AssignUsersModal;