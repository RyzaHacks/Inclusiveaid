import React, { useState } from 'react';
import { FaTrash, FaPlus } from 'react-icons/fa';
import api from '../../../utils/api';

const SupportTeamModal = ({ 
  isOpen, 
  onClose, 
  supportTeamMembers, 
  setSupportTeamMembers, 
  updateSupportTeam, 
  selectedUser, 
  services, 
  availableServiceWorkers = [] // Provide a default empty array
}) => {
  if (!isOpen || !selectedUser) return null;

  const [newMember, setNewMember] = useState({ id: '', name: '', role: 'Service Worker' });

  const handleUpdateTeam = async () => {
    try {
      const updatedTeam = supportTeamMembers.map(member => ({
        userId: member.id,
        role: member.role
      }));
      await api.put(`/api/users/admin/support-team/${selectedUser.id}`, updatedTeam);
      updateSupportTeam(updatedTeam);
      onClose();
    } catch (error) {
      console.error('Error updating support team:', error);
    }
  };

  const handleAddMember = async () => {
    if (newMember.id) {
      try {
        const response = await api.post(`/api/users/admin/support-team/${selectedUser.id}`, {
          userId: newMember.id,
          role: newMember.role
        });
        if (response.status === 200) {
          setSupportTeamMembers([...supportTeamMembers, response.data]);
          setNewMember({ id: '', name: '', role: 'Service Worker' });
        }
      } catch (error) {
        console.error('Error adding support team member:', error);
      }
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await api.delete(`/api/users/admin/support-team/${selectedUser.id}/${memberId}`);
      const updatedTeam = supportTeamMembers.filter(member => member.id !== memberId);
      setSupportTeamMembers(updatedTeam);
    } catch (error) {
      console.error('Error removing support team member:', error);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl">
        <h3 className="font-bold text-lg">Support Team Management</h3>
        <p>User: {selectedUser.name}</p>
        
        <h4 className="font-bold mt-4">Support Team Members:</h4>
        {supportTeamMembers.map((member, index) => (
          <div key={index} className="flex items-center mt-2">
            <input
              type="text"
              className="input input-bordered w-full"
              value={member.name}
              readOnly
            />
            <select
              className="select select-bordered ml-2"
              value={member.role}
              onChange={(e) => {
                const updatedTeam = [...supportTeamMembers];
                updatedTeam[index].role = e.target.value;
                setSupportTeamMembers(updatedTeam);
              }}
            >
              <option value="Service Worker">Service Worker</option>
              {/* Only Service Worker is selectable */}
            </select>
            <button
              className="btn btn-ghost btn-sm text-error ml-2"
              onClick={() => handleRemoveMember(member.id)}
            >
              <FaTrash />
            </button>
          </div>
        ))}

        <div className="flex items-center mt-4">
          <select
            className="select select-bordered w-full"
            value={newMember.id}
            onChange={(e) => {
              const selected = availableServiceWorkers.find(w => w.id === parseInt(e.target.value));
              if (selected) {
                setNewMember({ ...newMember, id: selected.id, name: selected.name });
              } else {
                console.warn('No matching service worker found');
                setNewMember({ id: '', name: '', role: 'Service Worker' });
              }
            }}
          >
            <option value="">Select a service worker</option>
            {availableServiceWorkers
              .filter(worker => !supportTeamMembers.some(member => member.id === worker.id))
              .map(worker => (
                <option key={worker.id} value={worker.id}>{worker.name}</option>
              ))
            }
          </select>
          <select
            className="select select-bordered ml-2"
            value={newMember.role}
            onChange={(e) => setNewMember({ ...newMember, role: 'Service Worker' })}
            disabled
          >
            <option value="Service Worker">Service Worker</option>
            {/* Role is fixed to Service Worker */}
          </select>
          <button
            className="btn btn-primary ml-2"
            onClick={handleAddMember}
          >
            <FaPlus /> Add
          </button>
        </div>
        
        <h4 className="font-bold mt-6">Assigned Services:</h4>
        {services.map((service, index) => (
          <div key={index} className="mt-2 p-2 bg-gray-100 rounded">
            <p className="font-semibold">{service.name} - {service.category}</p>
            <p>Date: {service.date}, Time: {service.time}</p>
          </div>
        ))}
        
        <div className="modal-action">
          <button className="btn btn-primary" onClick={handleUpdateTeam}>Update Support Team</button>
          <button className="btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default SupportTeamModal;
