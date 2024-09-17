import React, { useState, useEffect, useMemo } from 'react';
import { FaArrowLeft, FaArrowRight, FaSave, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const AppointmentWizard = ({ isOpen, onClose, onSave, clients, serviceWorkers, services }) => {
  const [step, setStep] = useState(1);
  const [appointment, setAppointment] = useState({
    clientId: '',
    serviceId: '',
    serviceWorkerId: '',
    dateTime: '',
    status: 'scheduled',
    notes: '',
    duration: 60, // Default duration in minutes
  });

  const [availableServiceWorkers, setAvailableServiceWorkers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setAppointment({
        clientId: '',
        serviceId: '',
        serviceWorkerId: '',
        dateTime: '',
        status: 'scheduled',
        notes: '',
        duration: 60,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (appointment.serviceId && appointment.dateTime && Array.isArray(serviceWorkers)) {
      const availableWorkers = serviceWorkers.filter(worker => 
        worker.services && worker.services.some(service => service.id === appointment.serviceId) &&
        isWorkerAvailable(worker, appointment.dateTime, appointment.duration)
      );
      setAvailableServiceWorkers(availableWorkers);
    } else {
      setAvailableServiceWorkers([]);
    }
  }, [appointment.serviceId, appointment.dateTime, appointment.duration, serviceWorkers]);

  const isWorkerAvailable = (worker, dateTime, duration) => {
    // Placeholder function
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(appointment);
  };

  const isStepValid = useMemo(() => {
    switch (step) {
      case 1: return !!appointment.clientId;
      case 2: return !!appointment.serviceId;
      case 3: return !!appointment.dateTime && !!appointment.duration;
      case 4: return !!appointment.serviceWorkerId;
      case 5: return true; // Notes are optional
      default: return false;
    }
  }, [step, appointment]);

  const noClientsAvailable = !Array.isArray(clients) || clients.length === 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative p-8 border w-full max-w-md shadow-lg rounded-md bg-white">
        <h2 className="text-2xl font-semibold mb-6">Create New Appointment</h2>
        {noClientsAvailable ? (
          <div className="text-center py-4">
            <FaExclamationTriangle className="mx-auto text-yellow-500 text-5xl mb-4" />
            <p className="text-lg font-semibold text-gray-700">No Clients Available</p>
            <p className="text-gray-600 mt-2">Please add clients before creating an appointment.</p>
            <button
              onClick={onClose}
              className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clientId">
                  Select Client
                </label>
                <select
                  id="clientId"
                  name="clientId"
                  value={appointment.clientId}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* ... (rest of the steps remain the same) ... */}

            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                >
                  <FaArrowLeft className="mr-2" /> Previous
                </button>
              )}
              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center ${!isStepValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!isStepValid}
                >
                  Next <FaArrowRight className="ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                >
                  <FaSave className="mr-2" /> Save Appointment
                </button>
              )}
            </div>
          </form>
        )}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default AppointmentWizard;