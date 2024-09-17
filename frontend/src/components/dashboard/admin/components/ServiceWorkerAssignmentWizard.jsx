import React, { useState, useEffect } from 'react';

const ServiceWorkerAssignmentWizard = ({ isOpen, onClose, onSave, serviceWorkers, services }) => {
  const [selectedWorker, setSelectedWorker] = useState('');
  const [assignedServices, setAssignedServices] = useState([]);

  useEffect(() => {
    if (selectedWorker) {
      const worker = serviceWorkers.find(w => w.id === selectedWorker);
      setAssignedServices(worker && worker.assignedServices ? worker.assignedServices.map(s => s.id) : []);
    } else {
      setAssignedServices([]);
    }
  }, [selectedWorker, serviceWorkers]);

  const handleWorkerChange = (e) => {
    setSelectedWorker(e.target.value);
  };

  const handleServiceToggle = (serviceId) => {
    setAssignedServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(selectedWorker, assignedServices);
  };

  if (!isOpen) return null;

  // Check if services is an array and not empty
  const hasServices = Array.isArray(services) && services.length > 0;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Manage Service Worker Assignments</h3>
          <div className="mt-2 px-7 py-3">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="serviceWorker">
                  Select Service Worker
                </label>
                <select
                  id="serviceWorker"
                  value={selectedWorker}
                  onChange={handleWorkerChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select a worker</option>
                  {serviceWorkers.map(worker => (
                    <option key={worker.id} value={worker.id}>{worker.name}</option>
                  ))}
                </select>
              </div>

              {selectedWorker && hasServices && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Assign Services
                  </label>
                  <div className="mt-2">
                    {services.map(service => (
                      <div key={service.id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={`service-${service.id}`}
                          checked={assignedServices.includes(service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <label htmlFor={`service-${service.id}`} className="ml-2 text-gray-700">
                          {service.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedWorker && !hasServices && (
                <div className="mb-4 text-red-500">
                  No services available to assign.
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={!selectedWorker || !hasServices}
                >
                  Save Assignments
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceWorkerAssignmentWizard;