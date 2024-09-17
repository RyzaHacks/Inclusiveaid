import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendar, FaClock, FaUser, FaClipboard } from 'react-icons/fa';
import api from '../../utils/api';

const ServiceWorkerServicesView = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/api/service-worker/appointments');
        setAppointments(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (isLoading) return <div>Loading appointments...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Your Appointments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>
    </div>
  );
};

const AppointmentCard = ({ appointment }) => {
  const [isAddingNotes, setIsAddingNotes] = useState(false);
  const [notes, setNotes] = useState(appointment.notes || '');

  const handleAddNotes = async () => {
    try {
      await api.post('/api/service-worker/add-notes', {
        appointmentId: appointment.id,
        notes: notes
      });
      setIsAddingNotes(false);
    } catch (error) {
      console.error('Error adding notes:', error);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6"
      whileHover={{ boxShadow: "0 0 15px rgba(0,0,0,0.2)" }}
    >
      <h3 className="text-xl font-semibold mb-4 text-primary-600">{appointment.service.name}</h3>
      <p className="flex items-center mb-2"><FaUser className="mr-2 text-primary-500" /> {appointment.client.name}</p>
      <p className="flex items-center mb-2"><FaCalendar className="mr-2 text-primary-500" /> {appointment.date}</p>
      <p className="flex items-center mb-4"><FaClock className="mr-2 text-primary-500" /> {appointment.time}</p>
      {isAddingNotes ? (
        <div>
          <textarea
            className="w-full p-2 border rounded mb-2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your notes here..."
          />
          <button className="btn btn-primary btn-sm" onClick={handleAddNotes}>Save Notes</button>
          <button className="btn btn-ghost btn-sm ml-2" onClick={() => setIsAddingNotes(false)}>Cancel</button>
        </div>
      ) : (
        <button className="btn btn-primary btn-sm w-full" onClick={() => setIsAddingNotes(true)}>
          <FaClipboard className="mr-2" /> Add Notes
        </button>
      )}
    </motion.div>
  );
};

export default ServiceWorkerServicesView;