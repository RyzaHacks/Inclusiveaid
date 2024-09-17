import React from 'react';
import { FaCalendar, FaClock, FaDollarSign, FaTag, FaUser, FaUsers } from 'react-icons/fa';

const ViewServicesModal = ({ isOpen, onClose, services }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">User Services</h3>
        {services.length === 0 ? (
          <p className="text-gray-600 text-center py-4">No services found for this user.</p>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="bg-gray-100 p-4 rounded-lg shadow">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <FaTag className="text-gray-500 mr-2" />
                    <span className="text-gray-700">{service.category}</span>
                  </div>
                  <div className="flex items-center">
                    <FaDollarSign className="text-gray-500 mr-2" />
                    <span className="text-gray-700">${service.price}</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="text-gray-500 mr-2" />
                    <span className="text-gray-700">{service.duration} minutes</span>
                  </div>
                  <div className="flex items-center">
                    <FaUser className="text-gray-500 mr-2" />
                    <span className="text-gray-700">{service.status}</span>
                  </div>
                </div>
                {service.description && (
                  <p className="text-gray-600 mt-2">{service.description}</p>
                )}
                <div className="mt-4">
                  {service.clients && service.clients.length > 0 && (
                    <div className="text-gray-700">
                      <strong>Clients:</strong>
                      <ul className="list-disc list-inside ml-4">
                        {service.clients.map(client => (
                          <li key={client.id}>{client.name} ({client.email})</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {service.workers && service.workers.length > 0 && (
                    <div className="text-gray-700 mt-2">
                      <strong>Workers:</strong>
                      <ul className="list-disc list-inside ml-4">
                        {service.workers.map(worker => (
                          <li key={worker.id}>{worker.name} ({worker.email}) - {worker.ServiceWorker.role}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <button 
            className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewServicesModal;