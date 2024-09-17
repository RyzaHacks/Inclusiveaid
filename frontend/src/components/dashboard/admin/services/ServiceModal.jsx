// src/components/dashboard/admin/services/ServiceModal.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const ServiceModal = ({ isOpen, onClose, onSubmit, service }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Service Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="serviceName">
              Service Name
            </label>
            <input
              type="text"
              id="serviceName"
              value={service.name}
              readOnly
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="serviceDescription">
              Description
            </label>
            <textarea
              id="serviceDescription"
              value={service.description}
              readOnly
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="serviceDate">
              Date
            </label>
            <input
              type="date"
              id="serviceDate"
              value={service.date}
              readOnly
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 mr-2"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Confirm
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ServiceModal;
