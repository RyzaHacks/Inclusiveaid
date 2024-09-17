import React from 'react';
import { motion } from 'framer-motion';
import { FaClipboardList } from 'react-icons/fa';

const ActivityLogModal = ({ isOpen, onClose, activityLog }) => {
  if (!isOpen || !activityLog) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-gray-100 rounded-xl p-8 max-w-3xl w-full m-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold mb-6 text-primary-600">
          <FaClipboardList className="inline mr-2" />
          Activity Log
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {activityLog && activityLog.length > 0 ? (
            <ul className="space-y-4">
              {activityLog.map((activity, index) => (
                <li key={index} className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold text-primary-600">{activity.type}</h3>
                    <span className="text-sm text-gray-500">{new Date(activity.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-700">{activity.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No activity log available.</p>
          )}
        </div>
        <div className="mt-8 flex justify-end">
          <button className="btn btn-primary px-6 py-3 text-lg" onClick={onClose}>
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ActivityLogModal;