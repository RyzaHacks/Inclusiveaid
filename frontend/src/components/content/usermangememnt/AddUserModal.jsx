import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaUserTag, FaCalendarAlt, FaDollarSign, FaClock } from 'react-icons/fa';

const AddUserModal = ({ isOpen, onClose, onAddUser, newUser, setNewUser, availableServiceWorkers }) => {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNdisPlanChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      ndisPlan: {
        ...prev.ndisPlan,
        [name]: value
      }
    }));
  };

  const handleInitialServiceChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      initialService: {
        ...prev.initialService,
        [name]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddUser();
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div 
        className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white"
        variants={modalVariants}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Add New User</h3>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <FaUser className="inline mr-2" />
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <FaEnvelope className="inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <FaLock className="inline mr-2" />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <FaUserTag className="inline mr-2" />
                  Role
                </label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="client">Client</option>
                  <option value="service_worker">Service Worker</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && newUser.role === 'client' && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">NDIS Plan</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <FaDollarSign className="inline mr-2" />
                  Total Budget
                </label>
                <input
                  type="number"
                  name="totalBudget"
                  value={newUser.ndisPlan.totalBudget}
                  onChange={handleNdisPlanChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <FaCalendarAlt className="inline mr-2" />
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={newUser.ndisPlan.endDate}
                  onChange={handleNdisPlanChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
          )}

          {step === 3 && newUser.role === 'client' && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Initial Service</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <FaUser className="inline mr-2" />
                  Service Type
                </label>
                <input
                  type="text"
                  name="type"
                  value={newUser.initialService.type}
                  onChange={handleInitialServiceChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <FaCalendarAlt className="inline mr-2" />
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={newUser.initialService.date}
                  onChange={handleInitialServiceChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <FaClock className="inline mr-2" />
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={newUser.initialService.time}
                  onChange={handleInitialServiceChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Previous
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Add User
              </button>
            )}
          </div>
        </form>
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-700"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default AddUserModal;