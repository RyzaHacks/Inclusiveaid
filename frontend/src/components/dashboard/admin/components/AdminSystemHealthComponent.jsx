import React from 'react';

const AdminSystemHealthComponent = ({ data }) => {
  console.log("AdminSystemHealthComponent received data:", data);

  if (!data || !data.data) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-2 text-primary-600">System Health</h3>
        <p className="text-gray-500">No system health data available.</p>
      </div>
    );
  }

  const { uptime, cpuUsage, memoryUsage, diskSpace } = data.data;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-2 text-primary-600">System Health</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-base-200 p-3 rounded-lg">
          <h4 className="font-semibold mb-1">Uptime</h4>
          <p>{uptime}</p>
        </div>
        <div className="bg-base-200 p-3 rounded-lg">
          <h4 className="font-semibold mb-1">CPU Usage</h4>
          <p>{cpuUsage}</p>
        </div>
        <div className="bg-base-200 p-3 rounded-lg">
          <h4 className="font-semibold mb-1">Memory Usage</h4>
          <p>{memoryUsage}</p>
        </div>
        <div className="bg-base-200 p-3 rounded-lg">
          <h4 className="font-semibold mb-1">Disk Space</h4>
          <p>{diskSpace}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSystemHealthComponent;