import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';
import api from '../../../utils/api';

const CommunityContent = ({ userData }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchCommunityEvents = async () => {
      try {
        const response = await api.get('/api/community-events');
        setEvents(response.data);
      } catch (err) {
        console.error('Error fetching community events:', err);
      }
    };

    fetchCommunityEvents();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event, index) => (
        <motion.div
          key={index}
          className="bg-white rounded-xl shadow-lg p-6"
          whileHover={{ boxShadow: "0 0 15px rgba(0,0,0,0.2)" }}
        >
          <h3 className="text-xl font-semibold mb-4 text-primary-600">{event.name}</h3>
          <p className="flex items-center mb-2"><FaCalendar className="mr-2 text-primary-500" /> {event.date}</p>
          <p className="flex items-center mb-2"><FaMapMarkerAlt className="mr-2 text-primary-500" /> {event.location}</p>
          <p className="flex items-center mb-4"><FaUser className="mr-2 text-primary-500" /> {event.organizer}</p>
          <p className="mb-4">{event.description}</p>
          <button className="btn btn-primary btn-sm w-full">RSVP</button>
        </motion.div>
      ))}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center"
        whileHover={{ boxShadow: "0 0 15px rgba(0,0,0,0.2)" }}
      >
        <button className="btn btn-secondary btn-lg">Suggest New Event</button>
      </motion.div>
    </div>
  );
};

export default CommunityContent;