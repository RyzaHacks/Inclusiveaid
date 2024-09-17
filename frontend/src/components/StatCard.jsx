// src/components/StatCard.js
import React from 'react';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className={`p-4 rounded-lg shadow-md ${color}`}>
    <div className="flex items-center">
      <Icon className="w-6 h-6" />
      <div className="ml-4">
        <p className="text-gray-700">{label}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

export default StatCard;


