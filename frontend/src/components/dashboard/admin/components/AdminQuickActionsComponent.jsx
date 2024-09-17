import React from 'react';
import { FaUserPlus, FaCalendarPlus, FaFileAlt, FaCog } from 'react-icons/fa';

const QuickActionButton = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="btn btn-sm btn-outline btn-primary flex flex-col items-center justify-center p-2"
  >
    <Icon className="text-lg mb-1" />
    <span className="text-xs">{label}</span>
  </button>
);

const AdminQuickActionsComponent = () => {
  const handleAddUser = () => console.log('Add User clicked');
  const handleScheduleAppointment = () => console.log('Schedule Appointment clicked');
  const handleGenerateReport = () => console.log('Generate Report clicked');
  const handleSystemSettings = () => console.log('System Settings clicked');

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-lg font-semibold mb-2 text-primary-600">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <QuickActionButton icon={FaUserPlus} label="Add User" onClick={handleAddUser} />
        <QuickActionButton icon={FaCalendarPlus} label="Schedule" onClick={handleScheduleAppointment} />
        <QuickActionButton icon={FaFileAlt} label="Report" onClick={handleGenerateReport} />
        <QuickActionButton icon={FaCog} label="Settings" onClick={handleSystemSettings} />
      </div>
    </div>
  );
};

export default AdminQuickActionsComponent;