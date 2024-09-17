import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaUserTag, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const UserFormModal = ({ user, roles, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roleId: '',
    password: '',
    status: 'active'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        roleId: user.role?.id,
        password: '',
        status: user.status || 'active'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleStatus = () => {
    setFormData(prev => ({ ...prev, status: prev.status === 'active' ? 'inactive' : 'active' }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
      >
        <h3 className="text-xl font-bold mb-4">{user ? 'Edit User' : 'Add New User'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <FaUser className="text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <FaEnvelope className="text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <FaUserTag className="text-gray-400" />
            <select
              name="roleId"
              value={formData.roleId}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
            >
              <option value="">Select a role</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>
          {!user && (
            <div className="flex items-center space-x-2">
              <FaLock className="text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="input input-bordered w-full"
                required
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">User Status</span>
            <button
              type="button"
              onClick={toggleStatus}
              className={`btn btn-sm ${formData.status === 'active' ? 'btn-success' : 'btn-error'}`}
            >
              {formData.status === 'active' ? <FaToggleOn className="mr-2" /> : <FaToggleOff className="mr-2" />}
              {formData.status === 'active' ? 'Active' : 'Inactive'}
            </button>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {user ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UserFormModal;