import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const AppointmentModal = ({ isOpen, onClose, onSubmit, services }) => {
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/users/schedule-appointment', { serviceId, date, time });
      onSubmit(response.data);
      onClose();
    } catch (error) {
      console.error('Error scheduling appointment:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h2 className="text-2xl font-bold mb-4">Schedule Appointment</h2>
        <form onSubmit={handleSubmit}>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Schedule</button>
            <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AppointmentModal;