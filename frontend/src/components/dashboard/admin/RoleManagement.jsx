import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaCog, FaSearch, FaCopy } from 'react-icons/fa';
import useRoleManagement from '../../../hooks/consolidated/useRoleManagement';
import DashboardConfigModal from './DashboardConfigModal';

const AlertComponent = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-md shadow-md ${type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white z-50`}>
      {message}
    </div>
  );
};

const RoleManagement = () => {
  const { 
    roles, 
    permissions, 
    loading, 
    error, 
    createRole, 
    updateRole, 
    deleteRole,
    updateRoleDashboard,
    updateRoleSidebar,
    refreshRolesAndPermissions,
  } = useRoleManagement();

  const [newRole, setNewRole] = useState({ name: '', description: '', permissions: [] });
  const [editingRole, setEditingRole] = useState(null);
  const [showDashboardConfig, setShowDashboardConfig] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    refreshRolesAndPermissions();
  }, []);

  useEffect(() => {
    setFilteredRoles(
      roles.filter(role => 
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [roles, searchTerm]);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
  };

  const handleCreateRole = async () => {
    if (!newRole.name.trim()) {
      showAlert('Please enter a name for the new role', 'error');
      return;
    }

    try {
      await createRole(newRole);
      setNewRole({ name: '', description: '', permissions: [] });
      refreshRolesAndPermissions();
      showAlert('Role created successfully');
    } catch (err) {
      console.error('Error creating role:', err);
      showAlert('Failed to create role. Please try again.', 'error');
    }
  };

  const handleUpdateRole = async () => {
    try {
      const updatedRole = {
        ...editingRole,
        permissions: editingRole.permissions.map(p => p.id)
      };
      await updateRole(editingRole.id, updatedRole);
      setEditingRole(null);
      refreshRolesAndPermissions();
      showAlert('Role updated successfully');
    } catch (err) {
      console.error('Error updating role:', err);
      showAlert('Failed to update role. Please try again.', 'error');
    }
  };

  const handleDeleteRole = async (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await deleteRole(id);
        refreshRolesAndPermissions();
        showAlert('Role deleted successfully');
      } catch (err) {
        console.error('Error deleting role:', err);
        showAlert('Failed to delete role. Please try again.', 'error');
      }
    }
  };

  const handleSaveConfig = async (roleId, newConfig) => {
    try {
      await updateRole(roleId, { 
        dashboardConfig: newConfig.dashboardConfig, 
        sidebarItems: newConfig.sidebarItems, 
        permissions: newConfig.permissions 
      });
      refreshRolesAndPermissions();
      showAlert('Role configuration updated successfully');
    } catch (error) {
      console.error('Error updating role configuration:', error);
      showAlert('Failed to update role configuration. Please try again.', 'error');
    }
  };

  const handlePermissionChange = (permissionId) => {
    if (editingRole) {
      const updatedPermissions = editingRole.permissions.some(p => p.id === permissionId)
        ? editingRole.permissions.filter(p => p.id !== permissionId)
        : [...editingRole.permissions, permissions.find(p => p.id === permissionId)];
      setEditingRole({ ...editingRole, permissions: updatedPermissions });
    } else {
      const updatedPermissions = newRole.permissions.includes(permissionId)
        ? newRole.permissions.filter(id => id !== permissionId)
        : [...newRole.permissions, permissionId];
      setNewRole({ ...newRole, permissions: updatedPermissions });
    }
  };

  const openDashboardConfig = (role) => {
    setCurrentRole(role);
    setShowDashboardConfig(true);
  };

  const handleDuplicateRole = (role) => {
    setNewRole({
      name: `${role.name} (Copy)`,
      description: role.description,
      permissions: role.permissions.map(p => p.id)
    });
    showAlert('Role duplicated. Please edit and save the new role.');
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading roles and permissions...</div>;
  if (error) return <div className="text-red-500 flex items-center justify-center h-screen">{error}</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      {alert && (
        <AlertComponent
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Create New Role Form */}
      <div className="w-1/3 p-6 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Create New Role</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={newRole.name}
              onChange={(e) => setNewRole({...newRole, name: e.target.value})}
              placeholder="Role Name"
              className="input input-bordered w-full"
            />
            <input
              type="text"
              value={newRole.description}
              onChange={(e) => setNewRole({...newRole, description: e.target.value})}
              placeholder="Role Description"
              className="input input-bordered w-full"
            />
            <div className="max-h-60 overflow-y-auto">
              <h4 className="font-semibold mb-2">Permissions</h4>
              <div className="space-y-2">
                {permissions.map(permission => (
                  <label key={permission.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newRole.permissions.includes(permission.id)}
                      onChange={() => handlePermissionChange(permission.id)}
                      className="checkbox"
                    />
                    <span>{permission.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateRole}
              className="btn btn-primary w-full"
            >
              <FaPlus className="mr-2" /> Create Role
            </motion.button>
          </div>
        </div>
      </div>

      {/* Existing Roles Table */}
      <div className="w-2/3 p-6 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Existing Roles</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full pl-10"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Permissions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map(role => (
                  <tr key={role.id}>
                    <td>{editingRole?.id === role.id ? 
                      <input 
                        type="text" 
                        value={editingRole.name} 
                        onChange={(e) => setEditingRole({...editingRole, name: e.target.value})}
                        className="input input-bordered w-full"
                      /> : role.name}
                    </td>
                    <td>{editingRole?.id === role.id ? 
                      <input 
                        type="text" 
                        value={editingRole.description} 
                        onChange={(e) => setEditingRole({...editingRole, description: e.target.value})}
                        className="input input-bordered w-full"
                      /> : role.description}
                    </td>
                    <td>
                      {editingRole?.id === role.id ? (
                        <div className="flex flex-wrap gap-2">
                          {permissions.map(permission => (
                            <label key={permission.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={editingRole.permissions.some(p => p.id === permission.id)}
                                onChange={() => handlePermissionChange(permission.id)}
                                className="checkbox"
                              />
                              <span>{permission.name}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {role.permissions && role.permissions.map(permission => (
                            <span key={permission.id} className="badge badge-primary">{permission.name}</span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        {editingRole?.id === role.id ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleUpdateRole}
                            className="btn btn-success btn-sm"
                          >
                            Save
                          </motion.button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setEditingRole({...role, permissions: role.permissions || []})}
                            className="btn btn-info btn-sm"
                          >
                            <FaEdit />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteRole(role.id)}
                          className="btn btn-error btn-sm"
                        >
                          <FaTrash />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openDashboardConfig(role)}
                          className="btn btn-warning btn-sm"
                        >
                          <FaCog />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDuplicateRole(role)}
                          className="btn btn-secondary btn-sm"
                        >
                          <FaCopy />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showDashboardConfig && (
        <DashboardConfigModal
          role={currentRole}
          onClose={() => setShowDashboardConfig(false)}
          onSave={handleSaveConfig}
          allPermissions={permissions}  
        />
      )}
    </div>
  );
};

export default RoleManagement;