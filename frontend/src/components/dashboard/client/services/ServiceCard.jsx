import React from 'react';
import { FaUser, FaCalendar, FaClock, FaMapMarkerAlt, FaDollarSign, FaComments, FaEye } from 'react-icons/fa';
import InfoItem from './InfoItem';

const ServiceCard = ({ service, onViewDetails, serviceName }) => {
  const clientName = service.client?.name || 'Unknown Client';
  const serviceWorkerName = service.serviceWorker?.name || 'No Worker Assigned';

  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    default: 'bg-blue-100 text-blue-800'
  };

  const statusColor = statusColors[service.status] || statusColors.default;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary-600">{service[serviceName]}</h2>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${statusColor}`}>
            {service.status}
          </div>
        </div>
        
        <p className="text-gray-600 mb-6 text-sm">{service.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <InfoItem icon={<FaUser />} label="Client" value={clientName} />
          <InfoItem icon={<FaUser />} label="Service Worker" value={serviceWorkerName} />
          <InfoItem icon={<FaCalendar />} label="Date" value={new Date(service.date).toLocaleDateString()} />
          <InfoItem icon={<FaClock />} label="Time" value={service.time} />
          <InfoItem icon={<FaMapMarkerAlt />} label="Location" value={service.location || 'No location specified'} />
          <InfoItem icon={<FaDollarSign />} label="Price" value={`$${service.price}`} />
          <InfoItem icon={<FaClock />} label="Duration" value={`${service.duration} minutes`} />
          <InfoItem icon={<FaComments />} label="Notes" value={service.notesContent || 'No notes'} />
        </div>
        
        <div className="flex justify-end space-x-2">
          <button 
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            onClick={() => onViewDetails(service)}
          >
            <FaEye className="mr-2" /> View Details
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors duration-200">Edit</button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;