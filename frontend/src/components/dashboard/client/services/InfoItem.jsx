import React from 'react';

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center text-sm">
    <span className="text-primary-500 mr-2">{icon}</span>
    <span className="font-medium mr-2">{label}:</span>
    <span className="text-gray-600">{value}</span>
  </div>
);

export default InfoItem;
