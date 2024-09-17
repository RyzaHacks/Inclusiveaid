import React from 'react';
import PropTypes from 'prop-types';
import { FaTrash, FaFile } from 'react-icons/fa';

const MessageItem = ({ message, onDelete, userData }) => (
  <div className={`mb-4 ${message.senderId === userData.id ? 'text-right' : 'text-left'}`}>
    <div className={`inline-block p-3 rounded-xl shadow ${message.senderId === userData.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
      {message.content}
      {message.fileUrl && (
        <a href={message.fileUrl} target="_blank" rel="noopener noreferrer" className="block mt-2 text-sm underline">
          <FaFile className="inline mr-1" /> Attachment
        </a>
      )}
    </div>
    <div className="text-xs text-gray-500 mt-1">
      {new Date(message.createdAt).toLocaleTimeString()}
    </div>
    {message.senderId === userData.id && (
      <button className="btn btn-ghost btn-xs mt-1" onClick={() => onDelete(message.id)}>
        <FaTrash className="text-red-500" />
      </button>
    )}
  </div>
);

MessageItem.propTypes = {
  message: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  userData: PropTypes.object.isRequired,
};

export default MessageItem;
