import React from 'react';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';

const SelectedDateCard = ({ selectedDate, setIsServiceRequestModalOpen }) => (
  <motion.div
    key="selected-date-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.3 }}
    className="bg-white rounded-lg shadow-md p-6"
  >
    <h3 className="text-xl font-bold text-primary-600 mb-4">
      {selectedDate 
        ? selectedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        : 'No Date Selected'}
    </h3>
    <button 
      className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg flex items-center justify-center transition-colors duration-200"
      onClick={() => setIsServiceRequestModalOpen(true)}
    >
      <FaPlus className="mr-2" /> Request Service for This Date
    </button>
  </motion.div>
);

export default SelectedDateCard;
