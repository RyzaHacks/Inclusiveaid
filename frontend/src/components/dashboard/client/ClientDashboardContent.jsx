// src/components/dashboard/client/ClientDashboardContent.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendar, FaClock, FaBell, FaClipboardList, FaWheelchair, FaHandsHelping, FaCog, FaSearch, FaList, FaPalette } from 'react-icons/fa';
import ServiceModal from '../admin/services/ServiceModal';
import NDISPlanModal from '../modals/NDISPlanModalc';
import ServicesModal from '../modals/ServicesModal';
import SupportTeamModal from '../modals/SupportTeamModal';
import ActivityLogModal from '../modals/ActivityLogModal';
import { useDashboard } from '../../../hooks/consolidated/useDashboard';

const themes = {
  default: 'bg-gray-100',
  blue: 'bg-blue-100',
  green: 'bg-green-100',
  purple: 'bg-purple-100',
  pink: 'bg-pink-100',
};

const ClientDashboardContent = ({ userData, dashboardData }) => {
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');

  const {
    loading,
    error,
    updateNDISPlan,
    scheduleService,
    refreshDashboard
  } = useDashboard();

  const {
    ndisPlan,
    upcomingServices,
    supportTeam,
    notifications,
    activityLog,
    assignedServiceWorkers
  } = dashboardData;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) return <div className="flex items-center justify-center h-full">Loading dashboard data...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  const themeClass = themes[currentTheme];

  return (
    <div className={`${themeClass} min-h-screen p-4 transition-colors duration-300`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          className="col-span-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl shadow-lg p-4 text-white"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">Welcome, {userData.name}</h3>
              <p className="text-sm opacity-80">Here's your InclusiveAid overview</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaClock className="text-lg" />
              <span className="text-sm">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-lg p-4 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold mb-2 text-primary-600">NDIS Plan</h3>
          {ndisPlan ? (
            <div className="space-y-2 flex-grow">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Budget:</span>
                <span className="text-lg font-bold text-primary-600">
                  ${ndisPlan.totalBudget.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full" 
                  style={{ 
                    width: `${(ndisPlan.usedBudget / ndisPlan.totalBudget) * 100}%`
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Used: ${ndisPlan.usedBudget.toLocaleString()}</span>
                <span>Remaining: ${(ndisPlan.totalBudget - ndisPlan.usedBudget).toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Plan End: {new Date(ndisPlan.endDate).toLocaleDateString()}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No NDIS plan data available.</p>
          )}
          <button 
            className="mt-2 btn btn-xs btn-outline btn-primary"
            onClick={() => setSelectedCard('ndisPlan')}
          >
            View Full Plan
          </button>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-lg p-4 flex flex-col hover:shadow-xl transition-shadow duration-300"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-primary-600">Upcoming Services</h3>
          </div>
          {upcomingServices.length > 0 ? (
            <ul className="space-y-2 flex-grow">
              {upcomingServices.slice(0, 2).map((service, index) => (
                <li key={index} className="flex items-center space-x-2 text-sm bg-gray-50 p-2 rounded-lg">
                  <FaCalendar className="text-primary-500 flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="font-semibold">{service.serviceName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(service.date).toLocaleDateString()}, {new Date(`2000-01-01T${service.time}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 flex-grow">No upcoming services.</p>
          )}
          <button 
            className="mt-2 btn btn-xs btn-outline btn-primary self-start"
            onClick={() => setSelectedCard('upcomingServices')}
          >
            View All Services
          </button>
        </motion.div>

        <motion.div
  className="bg-white rounded-xl shadow-lg p-4 flex flex-col hover:shadow-xl transition-shadow duration-300"
  variants={cardVariants}
  initial="hidden"
  animate="visible"
  transition={{ duration: 0.3, delay: 0.3 }}
>
  <div className="flex justify-between items-center mb-2">
    <h3 className="text-lg font-semibold text-primary-600">Support Team</h3>
    <button className="btn btn-ghost btn-xs"><FaSearch /></button>
  </div>
  {supportTeam && supportTeam.length > 0 ? (
    <ul className="space-y-2 flex-grow">
      {supportTeam.slice(0, 2).map((member, index) => (
        <li key={index} className="flex items-center space-x-2 text-sm bg-gray-50 p-2 rounded-lg">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm flex-shrink-0">
            {member.name ? member.name.charAt(0) : '?'}
          </div>
          <div className="flex-grow">
            <p className="font-semibold">{member.name || 'Unknown'}</p>
            <p className="text-xs text-gray-500">{member.role || 'No role specified'}</p>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-sm text-gray-500 flex-grow">No support team assigned.</p>
  )}
  <button 
    className="mt-2 btn btn-xs btn-outline btn-primary self-start"
    onClick={() => setSelectedCard('supportTeam')}
  >
    View All Team Members
  </button>
</motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-lg p-4 flex flex-col"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold mb-2 text-primary-600">Recent Notifications</h3>
          <ul className="space-y-2 flex-grow">
            {(showAllNotifications ? notifications : notifications.slice(0, 3)).map((notification, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm bg-gray-50 p-2 rounded-lg">
                <FaBell className="text-primary-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">{notification.title}</p>
                  <p className="text-xs text-gray-500">{notification.message}</p>
                </div>
              </li>
            ))}
          </ul>
          <button 
            className="mt-2 btn btn-xs btn-outline btn-primary self-start"
            onClick={() => setShowAllNotifications(!showAllNotifications)}
          >
            {showAllNotifications ? "Show Less" : "View All Notifications"}
          </button>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-lg p-4 flex flex-col hover:shadow-xl transition-shadow duration-300"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-primary-600">Activity Log</h3>
            <FaList className="text-primary-600 text-lg" />
          </div>
          {activityLog && activityLog.length > 0 ? (
            <ul className="space-y-2 flex-grow">
              {activityLog.slice(0, 3).map((activity, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm bg-gray-50 p-2 rounded-lg">
                  <div className="text-primary-500 flex-shrink-0 mt-1">
                    <FaClipboardList />
                  </div>
                  <div>
                    <p className="font-semibold">{activity.type}</p>
                    <p className="text-xs text-gray-500">{activity.description}</p>
                    <p className="text-xs text-gray-400">{new Date(activity.timestamp).toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 flex-grow">No recent activity.</p>
          )}
          <button 
            className="mt-2 btn btn-xs btn-outline btn-primary self-start"
            onClick={() => setSelectedCard('activityLog')}
          >
            View All Activity
          </button>
        </motion.div>

        <motion.div
          className="col-span-full bg-white rounded-xl shadow-lg p-4"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-2 text-primary-600">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="btn btn-sm btn-outline btn-primary" onClick={() => scheduleService()}>Schedule Service</button>
            <button className="btn btn-sm btn-outline btn-secondary">Request Support</button>
            <button className="btn btn-sm btn-outline btn-accent" onClick={() => setSelectedCard('ndisPlan')}>Update Goals</button>
            <button className="btn btn-sm btn-outline" onClick={refreshDashboard}>Refresh Dashboard</button>
          </div>
        </motion.div>

        <motion.div
          className="col-span-full bg-white rounded-xl shadow-lg p-4"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold mb-2 text-primary-600 flex items-center">
            <FaPalette className="mr-2" /> Theme Selection
          </h3>
          <div className="flex space-x-2">
            {Object.keys(themes).map((theme) => (
              <button
                key={theme}
                className={`w-8 h-8 rounded-full ${themes[theme]} ${currentTheme === theme ? 'ring-2 ring-primary-500' : ''}`}
                onClick={() => setCurrentTheme(theme)}
              ></button>
            ))}
          </div>
        </motion.div>
      </div>

      <ServiceModal 
        isOpen={isServiceModalOpen} 
        onClose={() => setIsServiceModalOpen(false)} 
      />

      <NDISPlanModal
        isOpen={selectedCard === 'ndisPlan'}
        onClose={() => setSelectedCard(null)}
        ndisPlan={ndisPlan}
        assignedServiceWorkers={assignedServiceWorkers}
        onUpdate={handleNDISPlanUpdate}
      />

      <ServicesModal
        isOpen={selectedCard === 'upcomingServices'}
        onClose={() => setSelectedCard(null)}
        services={upcomingServices}
      />

      <SupportTeamModal
        isOpen={selectedCard === 'supportTeam'}
        onClose={() => setSelectedCard(null)}
        team={supportTeam}
      />

      <ActivityLogModal
        isOpen={selectedCard === 'activityLog'}
        onClose={() => setSelectedCard(null)}
        activityLog={activityLog}
      />
    </div>
  );
};

export default ClientDashboardContent;