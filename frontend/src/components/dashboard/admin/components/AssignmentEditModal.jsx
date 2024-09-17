import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';

const AssignmentEditModal = ({ isOpen, onClose, assignment, onSave, clients, serviceWorkers, services }) => {
  const [editedAssignment, setEditedAssignment] = useState(assignment || {});
  const [error, setError] = useState('');

  useEffect(() => {
    setEditedAssignment(assignment || {});
    setError('');
  }, [assignment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedAssignment(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editedAssignment.clientId || !editedAssignment.serviceId || !editedAssignment.serviceWorkerId) {
      setError('Please fill in all required fields.');
      return;
    }
    onSave(editedAssignment);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="relative p-8 bg-white w-full max-w-md m-auto rounded-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4">{assignment ? 'Edit' : 'Add'} Assignment</h2>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <FaTimes size={24} />
        </button>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clientId">
              Client
            </label>
            <select
              id="clientId"
              name="clientId"
              value={editedAssignment.clientId || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a client</option>
              {Array.isArray(clients) ? clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              )) : <option value="">No clients available</option>}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="serviceId">
              Service
            </label>
            <select
              id="serviceId"
              name="serviceId"
              value={editedAssignment.serviceId || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a service</option>
              {Array.isArray(services) ? services.map(service => (
                <option key={service.id} value={service.id}>{service.name}</option>
              )) : <option value="">No services available</option>}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="serviceWorkerId">
              Service Worker
            </label>
            <select
              id="serviceWorkerId"
              name="serviceWorkerId"
              value={editedAssignment.serviceWorkerId || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a service worker</option>
              {Array.isArray(serviceWorkers) ? serviceWorkers.map(worker => (
                <option key={worker.id} value={worker.id}>{worker.user?.name || 'Unnamed Worker'}</option>
              )) : <option value="">No service workers available</option>}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateTime">
              Date and Time
            </label>
            <input
              type="datetime-local"
              id="dateTime"
              name="dateTime"
              value={editedAssignment.dateTime || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={editedAssignment.status || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
            >
              <FaSave className="mr-2" /> Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentEditModal;