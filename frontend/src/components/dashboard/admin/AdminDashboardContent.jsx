// inclusive-aid\frontend\src\components\dashboard\admin\AdminDashboardContent.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaClipboardList, FaChartLine, FaCog, FaServer, FaExclamationTriangle, FaUserPlus, FaFileAlt, FaBell } from 'react-icons/fa';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { useAuth } from '../../../hooks/consolidated/useAuth';
import useDashboard from '../../../hooks/consolidated/useDashboard';

const AdminDashboardContent = () => {
  const { user } = useAuth();
  const { 
    dashboardData, 
    loading, 
    error, 
    updateNDISPlan,
    scheduleService,
    refreshDashboard 
  } = useDashboard();

  const [selectedCard, setSelectedCard] = useState(null);

  if (loading) return <div className="flex justify-center items-center h-full">Loading dashboard data...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (user?.role?.name !== 'admin') return <div className="text-red-500 text-center">Access denied. Admin role required.</div>;

  const {
    userGrowth,
    recentAppointments,
    systemHealth,
    userActivity,
    serviceUtilization,
    ndisPlanAnalytics,
    totalUsers,
    totalServices,
    activeClients
  } = dashboardData;

  const userGrowthData = {
    labels: userGrowth?.map(item => new Date(item.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'New Users',
        data: userGrowth?.map(item => item.count) || [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const renderCardContent = () => {
    switch(selectedCard) {
      case 'userGrowth':
        return (
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-4">User Growth</h3>
            {userGrowth?.length > 0 ? (
              <Line data={userGrowthData} options={{ responsive: true, maintainAspectRatio: false }} />
            ) : (
              <p className="text-gray-500 text-center">No user growth data available.</p>
            )}
          </div>
        );
      case 'appointments':
        return (
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-4">Recent Appointments</h3>
            <ul className="space-y-2">
              {recentAppointments?.length > 0 ? (
                recentAppointments.map((appointment, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{appointment.service?.name || 'Unknown Service'}</span>
                    <span>{new Date(appointment.dateTime).toLocaleDateString()}</span>
                    <span>{appointment.client?.name || 'Unknown Client'}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-center">No recent appointments available.</li>
              )}
            </ul>
          </div>
        );
      case 'systemHealth':
        return (
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-4">System Health</h3>
            {systemHealth && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>Server Uptime: {systemHealth.uptime}</p>
                  <p>CPU Usage: {systemHealth.cpuUsage}</p>
                </div>
                <div>
                  <p>Memory Usage: {systemHealth.memoryUsage}</p>
                  <p>Disk Space: {systemHealth.diskSpace}</p>
                </div>
              </div>
            )}
          </div>
        );
      case 'userActivity':
        return (
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-4">User Activity</h3>
            {userActivity && (
              <Line data={userActivity.loginData} options={{ responsive: true }} />
            )}
          </div>
        );
      case 'serviceUtilization':
        return (
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-4">Service Utilization</h3>
            {serviceUtilization && (
              <Bar data={serviceUtilization.popularServices} options={{ responsive: true }} />
            )}
          </div>
        );
      case 'ndisPlanAnalytics':
        return (
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-4">NDIS Plan Analytics</h3>
            {ndisPlanAnalytics && (
              <Pie data={ndisPlanAnalytics.budgetUtilization} options={{ responsive: true }} />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name || 'Admin'}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div className="stat bg-base-100 shadow-xl" whileHover={{ scale: 1.05 }}>
          <div className="stat-figure text-primary">
            <FaUsers className="inline-block w-8 h-8 stroke-current" />
          </div>
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-primary">{totalUsers}</div>
        </motion.div>

        <motion.div className="stat bg-base-100 shadow-xl" whileHover={{ scale: 1.05 }}>
          <div className="stat-figure text-secondary">
            <FaClipboardList className="inline-block w-8 h-8 stroke-current" />
          </div>
          <div className="stat-title">Total Services</div>
          <div className="stat-value text-secondary">{totalServices}</div>
        </motion.div>

        <motion.div className="stat bg-base-100 shadow-xl" whileHover={{ scale: 1.05 }}>
          <div className="stat-figure text-accent">
            <FaChartLine className="inline-block w-8 h-8 stroke-current" />
          </div>
          <div className="stat-title">Active Clients</div>
          <div className="stat-value text-accent">{activeClients}</div>
        </motion.div>
      </div>

      <div className="flex flex-wrap -mx-2">
        <div className="w-full md:w-1/2 px-2 mb-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Dashboard Overview</h2>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setSelectedCard('userGrowth')} className="btn btn-primary">User Growth</button>
                <button onClick={() => setSelectedCard('appointments')} className="btn btn-secondary">Recent Appointments</button>
                <button onClick={() => setSelectedCard('systemHealth')} className="btn btn-accent">System Health</button>
                <button onClick={() => setSelectedCard('userActivity')} className="btn btn-info">User Activity</button>
                <button onClick={() => setSelectedCard('serviceUtilization')} className="btn btn-success">Service Utilization</button>
                <button onClick={() => setSelectedCard('ndisPlanAnalytics')} className="btn btn-warning">NDIS Plan Analytics</button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 px-2 mb-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {renderCardContent()}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div className="card bg-base-100 shadow-xl" whileHover={{ scale: 1.05 }}>
          <div className="card-body">
            <h2 className="card-title"><FaUserPlus className="inline-block w-6 h-6 mr-2" /> Quick Actions</h2>
            <button className="btn btn-primary" onClick={() => console.log('Add New User clicked')}>Add New User</button>
            {/* TODO: Implement user addition functionality */}
            {/* <button className="btn btn-secondary mt-2" onClick={() => handleAddUser()}>Bulk Import Users</button> */}
          </div>
        </motion.div>

        <motion.div className="card bg-base-100 shadow-xl" whileHover={{ scale: 1.05 }}>
          <div className="card-body">
            <h2 className="card-title"><FaFileAlt className="inline-block w-6 h-6 mr-2" /> Reports</h2>
            <button className="btn btn-secondary" onClick={() => console.log('Create Report clicked')}>Generate Report</button>
            {/* TODO: Implement report generation functionality */}
            {/* <button className="btn btn-primary mt-2" onClick={() => handleCustomReport()}>Custom Report</button> */}
          </div>
        </motion.div>

        <motion.div className="card bg-base-100 shadow-xl" whileHover={{ scale: 1.05 }}>
          <div className="card-body">
            <h2 className="card-title"><FaBell className="inline-block w-6 h-6 mr-2" /> System Alerts</h2>
            <button className="btn btn-accent" onClick={() => console.log('View Alerts clicked')}>View Alerts</button>
            {/* TODO: Implement system alerts functionality */}
            {/* <div className="mt-2">
              <span className="badge badge-warning">2 New Alerts</span>
            </div> */}
          </div>
        </motion.div>
      </div>

      {/* TODO: Add more sections as needed */}
      {/* <div className="card bg-base-100 shadow-xl mt-6">
        <div className="card-body">
          <h2 className="card-title">Advanced Analytics</h2>
          <p>Coming soon: Deep insights into user behavior, service performance, and financial analytics.</p>
        </div>
      </div> */}

      {/* TODO: Implement real-time updates */}
      {/* <div className="toast toast-end">
        <div className="alert alert-info">
          <div>
            <span>New user registered: John Doe</span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default AdminDashboardContent;