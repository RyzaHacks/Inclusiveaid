import React from 'react';
import PropTypes from 'prop-types';
import { FaVideo, FaPhone, FaEnvelope } from 'react-icons/fa';

const ChatHeader = ({ selectedUser }) => (
  <div className="flex items-center justify-between px-6 py-4 bg-gray-100 border-b">
    <div className="flex items-center space-x-4">
      <h3 className="text-xl font-semibold">{selectedUser.partnerName}</h3>
    </div>
    <div className="flex space-x-2">
      <button className="btn btn-ghost btn-circle text-blue-500">
        <FaVideo />
      </button>
      <button className="btn btn-ghost btn-circle text-green-500">
        <FaPhone />
      </button>
      <button className="btn btn-ghost btn-circle text-red-500">
        <FaEnvelope />
      </button>
    </div>
  </div>
);

ChatHeader.propTypes = {
  selectedUser: PropTypes.object.isRequired,
};

export default ChatHeader;
