import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarPlus, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../../../utils/api';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v2/admin/appointments');
      setAppointments(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full">Loading appointments...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Appointment Management</h2>
      <motion.button
        className="btn btn-primary"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {/* Open add appointment modal */}}
      >
        <FaCalendarPlus className="mr-2" /> Schedule New Appointment
      </motion.button>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Client</th>
            <th>Service</th>
            <th>Date & Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.client.name}</td>
              <td>{appointment.service.name}</td>
              <td>{new Date(appointment.dateTime).toLocaleString()}</td>
              <td>{appointment.status}</td>
              <td>
                <button className="btn btn-ghost btn-sm" onClick={() => {/* Open edit appointment modal */}}>
                  <FaEdit />
                </button>
                <button className="btn btn-ghost btn-sm text-red-500" onClick={() => {/* Confirm and delete appointment */}}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAppointments;