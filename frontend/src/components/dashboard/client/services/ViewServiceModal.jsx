import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes,FaUser,FaCalendar,FaClock,FaMapMarkerAlt,FaDollarSign,FaComments   } from 'react-icons/fa';
import InfoItem from './InfoItem';  // Assuming InfoItem is in the same directory or adjust the path accordingly

const ViewServiceModal = ({ isOpen, onClose, service }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-lg p-6 max-w-lg w-full"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          exit={{ y: 50 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-primary-600">Service Details</h2>
            <button className="text-gray-400 hover:text-gray-600" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
          {service ? (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <InfoItem icon={<FaUser />} label="Client" value={service.client?.name || 'Unknown Client'} />
                <InfoItem icon={<FaUser />} label="Service Worker" value={service.serviceWorker?.name || 'No Worker Assigned'} />
                <InfoItem icon={<FaCalendar />} label="Date" value={new Date(service.date).toLocaleDateString()} />
                <InfoItem icon={<FaClock />} label="Time" value={service.time} />
                <InfoItem icon={<FaMapMarkerAlt />} label="Location" value={service.location || 'No location specified'} />
                <InfoItem icon={<FaDollarSign />} label="Price" value={`$${service.price}`} />
                <InfoItem icon={<FaClock />} label="Duration" value={`${service.duration} minutes`} />
                <InfoItem icon={<FaComments />} label="Notes" value={service.notesContent || 'No notes'} />
              </div>
              <div className="flex justify-end">
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg" onClick={onClose}>
                  Close
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-600">No service selected.</p>
          )}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ViewServiceModal;
