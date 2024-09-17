// src/hooks/useRoleManagement.js
import { useState, useEffect } from 'react';
import api from '../utils/api';

const useRoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRolesAndPermissions();
  }, []);

  const fetchRolesAndPermissions = async () => {
    try {
      setLoading(true);
      const [rolesResponse, permissionsResponse] = await Promise.all([
        api.get('/api/v4/roles'),
        api.get('/api/v4/permissions')
      ]);
      setRoles(rolesResponse.data);
      setPermissions(permissionsResponse.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching roles and permissions:', err);
      setError('Failed to fetch roles and permissions');
      setLoading(false);
    }
  };

  const createRole = async (roleData) => {
    try {
      const response = await api.post('/api/v3/admin/roles', roleData);
      setRoles([...roles, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error creating role:', err);
      throw new Error('Failed to create role');
    }
  };

  const updateRole = async (id, roleData) => {
    try {
      const response = await api.put(`/api/v3/admin/roles/${id}`, roleData);
      setRoles(roles.map(role => role.id === id ? response.data : role));
      return response.data;
    } catch (err) {
      console.error('Error updating role:', err);
      throw new Error('Failed to update role');
    }
  };

  const deleteRole = async (id) => {
    try {
      await api.delete(`/api/v3/admin/roles/${id}`);
      setRoles(roles.filter(role => role.id !== id));
    } catch (err) {
      console.error('Error deleting role:', err);
      throw new Error('Failed to delete role');
    }
  };

  const updateRoleDashboard = async (id, dashboardConfig) => {
    try {
      const response = await api.put(`/api/v3/admin/roles/${id}/dashboard`, { dashboardConfig });
      setRoles(roles.map(role => role.id === id ? { ...role, dashboardConfig: response.data.dashboardConfig } : role));
      return response.data;
    } catch (err) {
      console.error('Error updating role dashboard:', err);
      throw new Error('Failed to update role dashboard');
    }
  };

  const updateRoleSidebar = async (id, sidebarItems) => {
    try {
      const response = await api.put(`/api/v3/admin/roles/${id}/sidebar`, { sidebarItems });
      setRoles(roles.map(role => role.id === id ? { ...role, sidebarItems: response.data.sidebarItems } : role));
      return response.data;
    } catch (err) {
      console.error('Error updating role sidebar:', err);
      throw new Error('Failed to update role sidebar');
    }
  };

  const createPermission = async (permissionData) => {
    try {
      const response = await api.post('/api/v3/admin/permissions', permissionData);
      setPermissions([...permissions, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error creating permission:', err);
      throw new Error('Failed to create permission');
    }
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
    createPermission,
    refreshRolesAndPermissions: fetchRolesAndPermissions,
  };
};

export default useRoleManagement;