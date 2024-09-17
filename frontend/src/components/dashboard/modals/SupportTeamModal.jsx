import React from 'react';
import { motion } from 'framer-motion';

const SupportTeamModal = ({ isOpen, onClose, team }) => {
    if (!isOpen) return null;

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
                className="bg-white rounded-xl p-6 max-w-md w-full m-4 max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-4 text-primary-600">Support Team</h2>
                {team.map((member) => (
  <li key={member.id} className="bg-gray-50 p-3 rounded-lg flex items-center space-x-3">
    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-xl flex-shrink-0">
      {member.name.charAt(0)}
    </div>
    <div>
      <h3 className="font-semibold text-primary-600">{member.name}</h3>
      <p className="text-sm text-gray-600">{member.role}</p>
      <p className="text-sm text-gray-600">{member.email}</p>
      {member.phoneNumber && <p className="text-sm text-gray-600">{member.phoneNumber}</p>}
    </div>
  </li>
))}
                <button className="mt-6 btn btn-primary w-full" onClick={onClose}>Close</button>
            </motion.div>
        </motion.div>
    );
};

export default SupportTeamModal;