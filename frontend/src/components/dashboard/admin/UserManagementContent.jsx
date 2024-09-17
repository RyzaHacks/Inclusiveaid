import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaSearch, FaEdit, FaTrash, FaFilter } from 'react-icons/fa';
import useUserManagement from '../../../hooks/consolidated/useUserManagement';
import UserFormModal from './UserFormModal';

const UserManagementContent = () => {
  const {
    users,
    totalPages,
    currentPage,
    totalUsers,
    loading,
    error,
    userRoles,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  } = useUserManagement();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(1, 10, searchTerm, filterRole);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterRole, fetchUsers]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterRole(e.target.value);
  };

  const handlePageChange = (page) => {
    fetchUsers(page, 10, searchTerm, filterRole);
  };

  const openModal = (user = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleUserSubmit = async (userData) => {
    if (selectedUser) {
      await updateUser(selectedUser.id, userData);
    } else {
      await createUser(userData);
    }
    closeModal();
    fetchUsers(currentPage, 10, searchTerm, filterRole);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUser(userId);
      fetchUsers(currentPage, 10, searchTerm, filterRole);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full">Loading users...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      <div className="flex justify-between items-center space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search users..."
            className="input input-bordered w-full pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex items-center space-x-2">
          <FaFilter className="text-gray-400" />
          <select
            value={filterRole}
            onChange={handleFilterChange}
            className="select select-bordered"
          >
            <option value="">All Roles</option>
            {userRoles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary"
          onClick={() => openModal()}
        >
          <FaUserPlus className="mr-2" /> Add New User
        </motion.button>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role?.name}</td>
                <td>
                  <span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-ghost" onClick={() => openModal(user)}>
                    <FaEdit />
                  </button>
                  <button className="btn btn-sm btn-ghost text-red-500" onClick={() => handleDeleteUser(user.id)}>
                    <FaTrash />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <span>Total Users: {totalUsers}</span>
        <div className="btn-group">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${currentPage === i + 1 ? 'btn-active' : ''}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <UserFormModal
          user={selectedUser}
          roles={userRoles}
          onClose={closeModal}
          onSubmit={handleUserSubmit}
        />
      )}
    </div>
  );
};

export default UserManagementContent;