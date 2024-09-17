import { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';

const useRoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRolesAndPermissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [rolesResponse, permissionsResponse] = await Promise.all([
        api.get('/api/v4/roles'),
        api.get('/api/v4/roles/permissions'),
      ]);
      setRoles(rolesResponse.data);
      setPermissions(permissionsResponse.data);
    } catch (err) {
      console.error('Error fetching roles and permissions:', err);
      setError('Failed to load roles and permissions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRolesAndPermissions();
  }, [fetchRolesAndPermissions]);

  const createRole = async (newRole) => {
    try {
      const response = await api.post('/api/v4/roles', newRole);
      setRoles(prevRoles => [...prevRoles, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error creating role:', err);
      throw new Error(err.response?.data?.message || 'Failed to create role');
    }
  };

  const updateRole = async (roleId, updatedRole) => {
    try {
      const response = await api.put(`/api/v4/roles/${roleId}`, updatedRole);
      setRoles(prevRoles => prevRoles.map(role => (role.id === roleId ? response.data : role)));
      return response.data;
    } catch (err) {
      console.error('Error updating role:', err);
      throw new Error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const deleteRole = async (roleId) => {
    try {
      await api.delete(`/api/v4/roles/${roleId}`);
      setRoles(prevRoles => prevRoles.filter(role => role.id !== roleId));
    } catch (err) {
      console.error('Error deleting role:', err);
      throw new Error(err.response?.data?.message || 'Failed to delete role');
    }
  };

  const updateRoleDashboard = async (roleId, dashboardConfig) => {
    try {
      const response = await api.put(`/api/v4/roles/${roleId}/dashboard`, { dashboardConfig });
      setRoles(prevRoles => prevRoles.map(role => 
        role.id === roleId ? { ...role, dashboardConfig: response.data.dashboardConfig } : role
      ));
      return response.data;
    } catch (err) {
      console.error('Error updating role dashboard:', err);
      throw new Error(err.response?.data?.message || 'Failed to update role dashboard');
    }
  };

  const updateRoleSidebar = async (roleId, sidebarItems) => {
    try {
      const response = await api.put(`/api/v4/roles/${roleId}/sidebar`, { sidebarItems });
      setRoles(prevRoles => prevRoles.map(role => 
        role.id === roleId ? { ...role, sidebarItems: response.data.sidebarItems } : role
      ));
      return response.data;
    } catch (err) {
      console.error('Error updating role sidebar:', err);
      throw new Error(err.response?.data?.message || 'Failed to update role sidebar');
    }
  };

  const updateRolePermissions = async (roleId, permissions) => {
    try {
      const response = await api.put(`/api/v4/roles/${roleId}/permissions`, { permissions });
      setRoles(prevRoles => prevRoles.map(role => 
        role.id === roleId ? { ...role, permissions: response.data.permissions } : role
      ));
      return response.data;
    } catch (err) {
      console.error('Error updating role permissions:', err);
      throw new Error(err.response?.data?.message || 'Failed to update role permissions');
    }
  };

  const getRoleById = (roleId) => {
    return roles.find(role => role.id === roleId);
  };

  return {
    roles,
    permissions,
    loading,
    error,
    createRole,
    updateRole,
    deleteRole,
    updateRoleDashboard,
    updateRoleSidebar,
    updateRolePermissions,
    getRoleById,
    refreshRolesAndPermissions: fetchRolesAndPermissions,
  };
};

export default useRoleManagement;