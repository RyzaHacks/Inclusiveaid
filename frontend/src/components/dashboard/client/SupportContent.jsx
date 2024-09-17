import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaPhone, FaUser, FaBriefcase, FaCircle } from 'react-icons/fa';
import api from '../../../utils/api';

const SupportContent = ({ userData }) => {
  const [supportTeam, setSupportTeam] = useState([]);
  const [ndisCoordinator, setNdisCoordinator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSupportData = async () => {
      try {
        setLoading(true);
        const [supportTeamResponse, ndisCoordinatorResponse] = await Promise.all([
          api.get(`/api/v1/support-team/${userData.id}`),
          api.get(`/api/v1/ndis-plans/ndis-plan`) // Assuming this endpoint returns NDIS plan details including the coordinator
        ]);
        setSupportTeam(supportTeamResponse.data || []);
        setNdisCoordinator(ndisCoordinatorResponse.data.assignedCareCoordinator || null);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching support data:', err);
        setError('Failed to load support information. Please try again later.');
        setLoading(false);
      }
    };
  
    fetchSupportData();
  }, [userData.id]);

  if (loading) {
    return <div className="text-center">Loading support team data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const renderTeamMember = (member) => (
    <motion.div 
      key={member.id}
      className="bg-white rounded-lg shadow-md p-4"
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="text-xl font-semibold">{member.name}</h3>
      <p className="text-gray-600">{member.role}</p>
      <div className="mt-2">
        <p className="flex items-center">
          <FaEnvelope className="mr-2" /> {member.email}
        </p>
        {member.phoneNumber && (
          <p className="flex items-center">
            <FaPhone className="mr-2" /> {member.phoneNumber}
          </p>
        )}
        <p className="flex items-center">
          <FaBriefcase className="mr-2" /> {member.role}
        </p>
        <p className="flex items-center">
          <FaCircle className={`mr-2 ${member.status === 'available' ? 'text-green-500' : 'text-gray-500'}`} />
          {member.status}
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Your Support Team</h2>
      
      {ndisCoordinator && (
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">NDIS Coordinator</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderTeamMember(ndisCoordinator)}
          </div>
        </section>
      )}

      <section>
        <h3 className="text-xl font-semibold mb-4">Support Team Members</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {supportTeam.map(renderTeamMember)}
        </div>
      </section>
    </div>
  );
};

export default SupportContent;