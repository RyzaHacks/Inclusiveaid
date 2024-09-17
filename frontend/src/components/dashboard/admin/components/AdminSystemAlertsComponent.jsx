import React from 'react';
import { FaExclamationTriangle, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';

const AlertItem = ({ type, message, date }) => {
  const iconMap = {
    error: <FaExclamationTriangle className="text-red-500" />,
    warning: <FaExclamationTriangle className="text-yellow-500" />,
    info: <FaInfoCircle className="text-blue-500" />,
    success: <FaCheckCircle className="text-green-500" />,
  };

  return (
    <div className={`flex items-start p-3 rounded-lg mb-2 bg-${type}-100`}>
      <div className="mr-3 mt-1">{iconMap[type]}</div>
      <div>
        <p className="font-semibold">{message}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
    </div>
  );
};

const AdminSystemAlertsComponent = ({ data }) => {
  const dummyAlerts = [
    { id: 1, type: 'error', message: 'Database connection error', date: '2023-08-15 14:30' },
    { id: 2, type: 'warning', message: 'High server load detected', date: '2023-08-15 13:45' },
    { id: 3, type: 'info', message: 'System update scheduled', date: '2023-08-15 12:00' },
    { id: 4, type: 'success', message: 'Backup completed successfully', date: '2023-08-15 11:30' },
  ];

  const alertsToRender = data?.alerts || dummyAlerts;

  return (
    <div>
      {alertsToRender.map((alert) => (
        <AlertItem key={alert.id} {...alert} />
      ))}
      {alertsToRender.length === 0 && (
        <p className="text-center text-gray-500">No active alerts at this time.</p>
      )}
    </div>
  );
};

export default AdminSystemAlertsComponent;