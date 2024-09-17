import React from 'react';
import { motion } from 'framer-motion';

const ServicesModal = ({ isOpen, onClose, services }) => {
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
                <h2 className="text-2xl font-bold mb-4 text-primary-600">All Services</h2>
                <ul className="space-y-4">
                    {services.map((service, index) => (
                        <li key={index} className="bg-gray-50 p-3 rounded-lg">
                            <h3 className="font-semibold text-primary-600">{service.serviceName}</h3>
                            <p className="text-sm text-gray-600">
                                {new Date(service.date).toLocaleDateString()}, {new Date(`2000-01-01T${service.time}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                        </li>
                    ))}
                </ul>
                <button className="mt-6 btn btn-primary w-full" onClick={onClose}>Close</button>
            </motion.div>
        </motion.div>
    );
};

export default ServicesModal;