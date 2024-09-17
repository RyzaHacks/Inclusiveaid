import React, { useState } from 'react';
import { FaUser, FaClipboardList, FaCog, FaComments, FaEnvelope } from 'react-icons/fa';

const ZoomMeetingRoom = ({ user, meeting }) => {
  const [showNdisPlan, setShowNdisPlan] = useState(false);
  const [showSupports, setShowSupports] = useState(false);

  // Placeholder data - replace with actual data from props or API
  const ndisPlan = {
    totalBudget: 50000,
    usedBudget: 15000,
    endDate: '2023-12-31'
  };

  const supports = [
    { id: 1, type: 'Physiotherapy', frequency: 'Weekly' },
    { id: 2, type: 'Occupational Therapy', frequency: 'Bi-weekly' },
    { id: 3, type: 'Speech Therapy', frequency: 'Monthly' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-primary-600">Zoom Meeting Room</h2>
      
      {/* User Info */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <FaUser className="mr-2 text-primary-500" /> User Information
        </h3>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>NDIS Number:</strong> {user.ndisNumber}</p>
      </div>

      {/* Meeting Info */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Meeting Details</h3>
        <p><strong>Title:</strong> {meeting.title}</p>
        <p><strong>Date & Time:</strong> {new Date(meeting.startTime).toLocaleString()}</p>
        <p><strong>Duration:</strong> {meeting.duration} minutes</p>
      </div>

      {/* NDIS Plan */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <FaClipboardList className="mr-2 text-primary-500" /> NDIS Plan
        </h3>
        <button 
          onClick={() => setShowNdisPlan(!showNdisPlan)}
          className="btn btn-outline btn-sm mb-2"
        >
          {showNdisPlan ? 'Hide Details' : 'Show Details'}
        </button>
        {showNdisPlan && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <p><strong>Total Budget:</strong> ${ndisPlan.totalBudget}</p>
            <p><strong>Used Budget:</strong> ${ndisPlan.usedBudget}</p>
            <p><strong>Remaining:</strong> ${ndisPlan.totalBudget - ndisPlan.usedBudget}</p>
            <p><strong>End Date:</strong> {ndisPlan.endDate}</p>
          </div>
        )}
      </div>

      {/* Supports */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <FaCog className="mr-2 text-primary-500" /> Supports
        </h3>
        <button 
          onClick={() => setShowSupports(!showSupports)}
          className="btn btn-outline btn-sm mb-2"
        >
          {showSupports ? 'Hide Supports' : 'Show Supports'}
        </button>
        {showSupports && (
          <ul className="bg-gray-100 p-4 rounded-lg">
            {supports.map(support => (
              <li key={support.id} className="mb-2">
                <strong>{support.type}:</strong> {support.frequency}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
        <div className="flex space-x-2">
          <button className="btn btn-primary btn-sm flex-1 flex items-center justify-center">
            <FaComments className="mr-2" /> Send Message
          </button>
          <button className="btn btn-secondary btn-sm flex-1 flex items-center justify-center">
            <FaEnvelope className="mr-2" /> Send Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZoomMeetingRoom;