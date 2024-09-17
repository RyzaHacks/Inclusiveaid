import React from 'react';
import PropTypes from 'prop-types';
import { FaFile } from 'react-icons/fa';

const ContactItem = ({ contact, onClick, bgColor }) => (
  <div 
    className="flex items-center mb-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
    onClick={onClick}
  >
    <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center mr-3`}>
      {contact.name.charAt(0).toUpperCase()}
    </div>
    <div>
      <p className="font-medium">{contact.name}</p>
      <p className="text-sm text-gray-500">{contact.email}</p>
      <p className="text-xs text-gray-400">{contact.role}</p>
    </div>
    <div className="ml-auto">
      <span className={`inline-block w-3 h-3 rounded-full ${contact.status === 'available' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
    </div>
  </div>
);

ContactItem.propTypes = {
  contact: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  bgColor: PropTypes.string.isRequired,
};

export default ContactItem;
