import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInfoCircle, FaTimes } from 'react-icons/fa';

const InfoPopup = ({ showInfoPopup, setShowInfoPopup }) => (
  <AnimatePresence>
    {showInfoPopup && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={() => setShowInfoPopup(false)}
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="bg-white rounded-lg p-6 max-w-md m-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center mb-4 text-primary-600">
            <FaInfoCircle className="text-2xl mr-2" />
            <h2 className="text-xl font-bold">Service Request Submitted</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Your service request has been submitted successfully. Please note that all service requests are subject to approval. Your support team will contact you with specific dates and further details.
          </p>
          <button
            className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            onClick={() => setShowInfoPopup(false)}
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default InfoPopup;
