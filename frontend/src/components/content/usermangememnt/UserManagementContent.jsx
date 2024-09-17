// src/components/content/usermanagement/UserManagementContent.jsx

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEdit, FaTrash, FaPlus, FaEye, FaFileAlt, FaUsers, FaSearch, FaSort } from 'react-icons/fa';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import ViewServicesModal from './ViewServicesModal';
import NdisPlanModal from './NDISPlanModal';
import SupportTeamModal from './SupportTeamModal';
import useUserManagement from '../../../hooks/useUserManagement';

const UserManagementContent = () => {
  const {
    users,
    services,
    isLoading,
    error,
    isLoadingServices,
    servicesError,
    ndisPlan,
    supportTeamMembers,
    availableServiceWorkers,
    availableServices,
    userStats,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    viewNdisPlan,
    viewUserServices,
    viewSupportTeam,
    updateNdisPlan,
    updateSupportTeam,
    fetchUsers,
  } = useUserManagement();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewServicesModalOpen, setIsViewServicesModalOpen] = useState(false);
  const [isNdisPlanModalOpen, setIsNdisPlanModalOpen] = useState(false);
  const [isSupportTeamModalOpen, setIsSupportTeamModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const usersPerPage = 10;

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = filteredUsers.sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleViewUserServices = useCallback(async (userId) => {
    await viewUserServices(userId);
    setIsViewServicesModalOpen(true);
  }, [viewUserServices]);

  const handleViewNdisPlan = useCallback(async (userId) => {
    const plan = await viewNdisPlan(userId);
    if (plan) {
      setSelectedUser(users.find(u => u.id === userId));
      setIsNdisPlanModalOpen(true);
    }
  }, [viewNdisPlan, users]);

  const handleViewSupportTeam = useCallback(async (userId) => {
    const { supportTeam } = await viewSupportTeam(userId);
    if (supportTeam) {
      setSelectedUser(users.find(u => u.id === userId));
      setIsSupportTeamModalOpen(true);
    }
  }, [viewSupportTeam, users]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) return <div className="flex items-center justify-center h-full">Loading users...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <motion.h1 
        className="text-2xl font-bold mb-4 text-primary-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        User Management
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Users</h2>
          <p className="text-3xl font-bold">{userStats.totalUsers || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Active Clients</h2>
          <p className="text-3xl font-bold">{userStats.activeClients || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Service Workers</h2>
          <p className="text-3xl font-bold">{userStats.serviceWorkers || 0}</p>
        </div>
      </motion.div>

      <div className="flex justify-between items-center mb-4">
        <motion.button
          className="btn btn-primary"
          onClick={() => setIsAddModalOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus className="mr-2" /> Add New User
        </motion.button>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {sortedUsers.length === 0 ? (
        <motion.p
          className="text-center text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          No users found.
        </motion.p>
      ) : (
        <>
          <motion.div 
            className="overflow-x-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <table className="table w-full">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')} className="cursor-pointer">
                    Name {sortField === 'name' && <FaSort className="inline" />}
                  </th><th onClick={() => handleSort('email')} className="cursor-pointer">
                    Email {sortField === 'email' && <FaSort className="inline" />}
                  </th>
                  <th onClick={() => handleSort('role')} className="cursor-pointer">
                    Role {sortField === 'role' && <FaSort className="inline" />}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * currentUsers.indexOf(user) }}
                  >
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="badge badge-primary">{user.role}</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm text-error"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this user?')) {
                            handleDeleteUser(user.id);
                          }
                        }}
                      >
                        <FaTrash />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleViewUserServices(user.id)}
                      >
                        <FaEye /> Services
                      </button>
                      {user.role === 'client' && (
                        <>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleViewNdisPlan(user.id)}
                          >
                            <FaFileAlt /> NDIS Plan
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleViewSupportTeam(user.id)}
                          >
                            <FaUsers /> Support Team
                          </button>
                        </>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
          <motion.div 
            className="flex justify-center mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {Array.from({ length: Math.ceil(sortedUsers.length / usersPerPage) }, (_, i) => (
              <button
                key={i}
                className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </motion.div>
        </>
      )}

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddUser={async (newUser) => {
          const success = await handleAddUser(newUser);
          if (success) {
            setIsAddModalOpen(false);
            fetchUsers();
          }
        }}
        availableServiceWorkers={availableServiceWorkers}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEditUser={async (updatedUser) => {
          const success = await handleEditUser(updatedUser);
          if (success) {
            setIsEditModalOpen(false);
            fetchUsers();
          }
        }}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        availableServiceWorkers={availableServiceWorkers}
        availableServices={availableServices}
        users={users}
      />

      <ViewServicesModal
        isOpen={isViewServicesModalOpen}
        onClose={() => setIsViewServicesModalOpen(false)}
        services={services}
        isLoading={isLoadingServices}
        error={servicesError}
      />

      <NdisPlanModal
        isOpen={isNdisPlanModalOpen}
        onClose={() => setIsNdisPlanModalOpen(false)}
        ndisPlan={ndisPlan}
        updateNdisPlan={async (updatedPlan) => {
          const success = await updateNdisPlan(selectedUser.id, updatedPlan);
          if (success) {
            setIsNdisPlanModalOpen(false);
            fetchUsers();
          }
        }}
      />

      <SupportTeamModal
        isOpen={isSupportTeamModalOpen}
        onClose={() => setIsSupportTeamModalOpen(false)}
        supportTeamMembers={supportTeamMembers}
        updateSupportTeam={async (updatedTeam) => {
          const success = await updateSupportTeam(selectedUser.id, updatedTeam);
          if (success) {
            setIsSupportTeamModalOpen(false);
            fetchUsers();
          }
        }}
        selectedUser={selectedUser}
        services={services}
        availableServiceWorkers={availableServiceWorkers}
      />
    </div>
  );
};

export default UserManagementContent;