import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../../../utils/api';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v2/admin/users');
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full">Loading users...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">User Management</h2>
      <motion.button
        className="btn btn-primary"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {/* Open add user modal */}}
      >
        <FaUserPlus className="mr-2" /> Add New User
      </motion.button>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>NDIS Plan</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.ndisPlan ? 'Active' : 'N/A'}</td>
              <td>
                <button className="btn btn-ghost btn-sm" onClick={() => {/* Open edit user modal */}}>
                  <FaEdit />
                </button>
                <button className="btn btn-ghost btn-sm text-red-500" onClick={() => {/* Confirm and delete user */}}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserManagement;