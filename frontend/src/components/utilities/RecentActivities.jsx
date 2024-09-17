import React from 'react';
import { FaFileAlt, FaComments, FaHandsHelping } from 'react-icons/fa';

const RecentActivities = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'document':
        return <FaFileAlt className="text-blue-500" />;
      case 'message':
        return <FaComments className="text-green-500" />;
      case 'service':
        return <FaHandsHelping className="text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
          {getActivityIcon(activity.type)}
          <div>
            <p className="font-semibold">{activity.title}</p>
            <p className="text-sm text-gray-600">{activity.description}</p>
            <p className="text-xs text-gray-500">{activity.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivities;