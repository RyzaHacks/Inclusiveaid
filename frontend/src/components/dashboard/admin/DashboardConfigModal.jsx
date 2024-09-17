import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
import * as HeroIcons from 'react-icons/hi';
import { FaEnvelope } from 'react-icons/fa';

const DashboardConfigModal = ({ role, onClose, onSave, allPermissions = [] }) => {
  const [config, setConfig] = useState(role.dashboardConfig || {});
  const [sidebarItems, setSidebarItems] = useState(role.sidebarItems || []);
  const [selectedPermissions, setSelectedPermissions] = useState(role.permissions.map(p => p.id) || []);

  const availableComponents = [
    { name: 'User Growth', type: 'AdminUserGrowthComponent' },
    { name: 'Recent Appointments', type: 'AdminRecentAppointmentsComponent' },
    { name: 'System Health', type: 'AdminSystemHealthComponent' },
    { name: 'User Activity', type: 'AdminUserActivityComponent' },
    { name: 'Service Utilization', type: 'AdminServiceUtilizationComponent' },
    { name: 'NDIS Plan Analytics', type: 'AdminNDISPlanAnalyticsComponent' },
    { name: 'Quick Actions', type: 'AdminQuickActionsComponent' },
    { name: 'Reports', type: 'AdminReportsComponent' },
    { name: 'System Alerts', type: 'AdminSystemAlertsComponent' },
    { name: 'User Statistics', type: 'userStats' },
    { name: 'NDIS Plan Overview', type: 'ndisPlanOverview' },
    { name: 'Recent Activities', type: 'recentActivities' },
    { name: 'Upcoming Appointments', type: 'upcomingAppointments' },
  ];

  const availableSidebarItems = [
    { name: 'Dashboard', icon: 'HiHome', color: 'text-blue-500' },
    { name: 'User Management', icon: 'HiUsers', color: 'text-purple-500' },
    { name: 'Service Management', icon: 'HiHand', color: 'text-yellow-500' },
    { name: 'NDIS Plan Management', icon: 'HiClipboardList', color: 'text-pink-500' },
    { name: 'Course Management', icon: 'HiLibrary', color: 'text-red-500' },
    { name: 'Zoom Meetings', icon: 'HiVideoCamera', color: 'text-red-500' },
    { name: 'Reports', icon: 'HiChartBar', color: 'text-indigo-500' },
    { name: 'Messages', icon: 'FaEnvelope', color: 'text-cyan-500' },
    { name: 'Role Management', icon: 'HiUserGroup', color: 'text-orange-500' },
    { name: 'Assigned Clients', icon: 'HiUsers', color: 'text-purple-500' },
    { name: 'Schedule', icon: 'HiCalendar', color: 'text-yellow-500' },
    { name: 'Service Notes', icon: 'HiDocumentText', color: 'text-pink-500' },
    { name: 'Resources', icon: 'HiLibrary', color: 'text-indigo-500' },
    { name: 'Client Management', icon: 'HiUsers', color: 'text-purple-500' },
    { name: 'Service Coordination', icon: 'HiCalendar', color: 'text-yellow-500' },
  ];

  const handleSave = async () => {
    try {
      await onSave(role.id, { dashboardConfig: config, sidebarItems, permissions: selectedPermissions });
      onClose();
    } catch (error) {
      console.error('Error saving dashboard config:', error);
    }
  };

  const toggleComponent = (componentType) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      [componentType]: !prevConfig[componentType],
    }));
  };

  const addSidebarItem = (item) => {
    setSidebarItems(prev => [...prev, item]);
  };

  const removeSidebarItem = (index) => {
    setSidebarItems(prev => prev.filter((_, i) => i !== index));
  };

  const togglePermission = (permissionId) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-4xl m-4"
      >
        <h2 className="text-2xl font-bold mb-4">Dashboard Configuration for {role.name}</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Dashboard Components</h3>
            <div className="grid grid-cols-2 gap-4">
              {availableComponents.map(component => (
                <label key={component.type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config[component.type] || false}
                    onChange={() => toggleComponent(component.type)}
                    className="checkbox"
                  />
                  <span>{component.name}</span>
                </label>
              ))}</div>
              </div>
    
              <div>
                <h3 className="text-xl font-semibold mb-2">Sidebar Items</h3>
                <div className="space-y-2">
                  {sidebarItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {HeroIcons[item.icon] ? React.createElement(HeroIcons[item.icon], { className: item.color }) : <FaEnvelope className={item.color} />}
                      <span>{item.name}</span>
                      <button onClick={() => removeSidebarItem(index)} className="btn btn-sm btn-error">
                        <FaMinus />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <select 
                    className="select select-bordered w-full max-w-xs"
                    onChange={(e) => {
                      const selected = availableSidebarItems.find(item => item.name === e.target.value);
                      if (selected) addSidebarItem(selected);
                    }}
                    value=""
                  >
                    <option value="" disabled>Add sidebar item</option>
                    {availableSidebarItems.map(item => (
                      <option key={item.name} value={item.name}>{item.name}</option>
                    ))}
                  </select>
                </div>
              </div>
    
              <div>
                <h3 className="text-xl font-semibold mb-2">Permissions</h3>
                <div className="grid grid-cols-2 gap-2">
                  {allPermissions.map(permission => (
                    <label key={permission.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(permission.id)}
                        onChange={() => togglePermission(permission.id)}
                        className="checkbox"
                      />
                      <span>{permission.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
    
            <div className="flex justify-end space-x-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="btn btn-ghost"
              >
                <FaTimes className="mr-2" /> Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="btn btn-primary"
              >
                <FaSave className="mr-2" /> Save Configuration
              </motion.button>
            </div>
          </motion.div>
        </div>
      );
    };
    
    export default DashboardConfigModal;