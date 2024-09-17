import React, { useEffect, useState } from 'react';
import { FaUser, FaClipboardList, FaUsers, FaTimes, FaPlus } from 'react-icons/fa';
import api from '../../../utils/api';

const EditUserModal = ({ isOpen, onClose, onEditUser, selectedUser, setSelectedUser, availableServiceWorkers, availableServices, users }) => {
  const [supportTeam, setSupportTeam] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (selectedUser) {
      setSupportTeam(selectedUser.supportTeam || selectedUser.supportWorkers || []);
      setServices(selectedUser.assignedServices || []);
    }
  }, [selectedUser]);

  const handleSupportWorkerChange = async (workerId) => {
    try {
      const response = await api.post(`/api/users/admin/support-team/${selectedUser.id}`, {
        supportWorker: workerId
      });
      if (response.status === 200) {
        setSupportTeam([...supportTeam, response.data]);
      }
    } catch (error) {
      console.error('Error adding support worker:', error);
    }
  };

  const handleServiceChange = async (serviceId) => {
    try {
      const response = await api.post(`/api/users/admin/services/assign/${selectedUser.id}`, {
        service: serviceId
      });
      if (response.status === 200) {
        setServices([...services, response.data]);
      }
    } catch (error) {
      console.error('Error assigning service:', error);
    }
  };

  const removeSupportWorker = async (workerId) => {
    try {
      await api.delete(`/api/users/admin/support-team/${selectedUser.id}/${workerId}`);
      const updatedTeam = supportTeam.filter(member => member.userId !== workerId);
      setSupportTeam(updatedTeam);
    } catch (error) {
      console.error('Error removing support worker:', error);
    }
  };

  const removeService = async (serviceId) => {
    try {
      await api.delete(`/api/users/admin/services/assign/${selectedUser.id}/${serviceId}`);  
      const updatedServices = services.filter(s => s.id !== serviceId);
      setServices(updatedServices);
    } catch (error) {
      console.error('Error removing service:', error);
    }
  };

  const handleSubmit = () => {
    const updatedUser = {
      ...selectedUser,
      supportTeam: supportTeam.map(member => member.userId),
      assignedServices: services.map(s => s.id)
    };
    onEditUser(updatedUser);
  };

  if (!isOpen || !selectedUser) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-8 border w-11/12 max-w-4xl shadow-lg rounded-lg bg-white">
        <h3 className="text-3xl font-bold text-gray-900 mb-6">Edit User</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedUser.name}
                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedUser.role}
                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
              >
                <option value="client">Client</option>
                <option value="service_worker">Service Worker</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {selectedUser.role === 'client' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-lg mb-2"><FaUsers className="inline mr-2" />Support Team</h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  {supportTeam.map(member => (
                    <div key={member.userId} className="bg-blue-100 px-3 py-1 rounded-full flex items-center">
                      <span>{member.name}</span>
                      <FaTimes className="ml-2 cursor-pointer text-red-500" onClick={() => removeSupportWorker(member.userId)} />
                    </div>
                  ))}
                </div>
                <div className="flex items-center">
                  <select
                    className="flex-grow border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    onChange={(e) => handleSupportWorkerChange(parseInt(e.target.value))}
                    value=""
                  >
                    <option value="">Select Support Worker</option>
                    {availableServiceWorkers
                      .filter(worker => !supportTeam.some(m => m.userId === worker.id))
                      .map(worker => (
                        <option key={worker.id} value={worker.id}>{worker.name}</option>
                      ))
                    }
                  </select>
                  <button
                    className="bg-blue-500 text-white rounded-r-md px-4 py-2 hover:bg-blue-600"
                    onClick={() => {
                      const select = document.querySelector('select');
                      if (select.value) handleSupportWorkerChange(parseInt(select.value));
                    }}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-2"><FaClipboardList className="inline mr-2" />Assigned Services</h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  {services.map(service => (
                    <div key={service.id} className="bg-green-100 px-3 py-1 rounded-full flex items-center">
                      <span>{service.name} - ${service.price}</span>
                      <FaTimes className="ml-2 cursor-pointer text-red-500" onClick={() => removeService(service.id)} />
                    </div>
                  ))}
                </div>
                <div className="flex items-center">
                  <select
                    className="flex-grow border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    onChange={(e) => handleServiceChange(parseInt(e.target.value))}
                    value=""
                  >
                    <option value="">Select Service</option>
                    {availableServices
                      .filter(service => !services.some(s => s.id === service.id))
                      .map(service => (
                        <option key={service.id} value={service.id}>{service.name} - ${service.price}</option>
                      ))
                    }
                  </select>
                  <button
                    className="bg-green-500 text-white rounded-r-md px-4 py-2 hover:bg-green-600"
                    onClick={() => {
                      const select = document.querySelector('select:last-of-type');
                      if (select.value) handleServiceChange(parseInt(select.value));
                    }}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedUser.role === 'service_worker' && (
            <div>
              <h4 className="font-bold text-lg mb-2"><FaUser className="inline mr-2" />Assigned Clients</h4>
              <select
                multiple
                className="w-full h-32 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedUser.clients?.map(c => c.id) || []}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  clients: Array.from(e.target.selectedOptions, option => ({ id: parseInt(option.value) }))
                })}
              >
                {users.filter(user => user.role === 'client').map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="flex justify-end items-center space-x-4 mt-8">
          <button 
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Update User
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-700 font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;