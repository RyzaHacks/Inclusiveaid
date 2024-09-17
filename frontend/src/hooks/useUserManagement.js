import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [servicesError, setServicesError] = useState(null);
  const [ndisPlan, setNdisPlan] = useState(null);
  const [supportTeamMembers, setSupportTeamMembers] = useState([]);
  const [availableServiceWorkers, setAvailableServiceWorkers] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [userStats, setUserStats] = useState({});

  useEffect(() => {
    fetchUsers();
    fetchAvailableServiceWorkers();
    fetchAvailableServices();
    fetchUserStats();
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/users/admin/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAvailableServiceWorkers = async () => {
    try {
      const response = await api.get('/api/users/admin/available-service-workers');
      setAvailableServiceWorkers(response.data);
    } catch (error) {
      console.error('Error fetching available service workers:', error);
    }
  };

  const fetchAvailableServices = async () => {
    try {
      const response = await api.get('/api/users/services');
      setAvailableServices(response.data);
    } catch (error) {
      console.error('Error fetching available services:', error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await api.get('/api/users/admin/dashboard-stats');
      setUserStats(response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleAddUser = async (newUser) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.post('/api/users/admin/users', newUser);
      if (response.status === 201) {
        await fetchUsers();
        return true;
      } else {
        throw new Error('Failed to add user. Please try again.');
      }
    } catch (err) {
      console.error('Error adding user:', err);
      setError(err.response?.data?.message || err.message || 'Failed to add user. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async (updatedUser) => {
    try {
      const response = await api.put(`/api/users/admin/users/${updatedUser.id}`, updatedUser);
      if (response.status === 200) {
        await fetchUsers();
        return true;
      } else {
        throw new Error('Failed to update user. Please try again.');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user. Please try again.');
      return false;
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await api.delete(`/api/users/admin/users/${userId}`);
      if (response.status === 200) {
        await fetchUsers();
        return true;
      } else {
        throw new Error('Failed to delete user. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
      return false;
    }
  };

  const viewNdisPlan = async (userId) => {
    try {
      const response = await api.get(`/api/ndis-plans/admin/ndis-plan/${userId}`);
      if (response.data) {
        setNdisPlan(response.data);
        return response.data;
      } else {
        throw new Error('No NDIS plan data found for this user.');
      }
    } catch (error) {
      console.error('Error fetching NDIS plan:', error);
      setError(error.response?.data?.message || 'Failed to fetch NDIS plan. Please try again later.');
      return null;
    }
  };

  const viewUserServices = async (userId) => {
    setIsLoadingServices(true);
    setServicesError(null);
    try {
      const response = await api.get(`/api/users/services/${userId}`);
      setServices(response.data);
      return response.data;
    } catch (error) { 
      console.error('Error fetching user services:', error);
      setServicesError('Failed to fetch user services. Please try again later.');
      return [];
    } finally {
      setIsLoadingServices(false);
    }
  };

  const viewSupportTeam = async (userId) => {
    try {
      const [servicesResponse, supportTeamResponse] = await Promise.all([
        api.get(`/api/users/services/${userId}`),
        api.get(`/api/users/admin/support-team/${userId}`)
      ]);
  
      const services = servicesResponse.data || [];
      const supportTeam = supportTeamResponse.data || [];
  
      setServices(services);
      setSupportTeamMembers(supportTeam);
  
      return { services, supportTeam };
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to fetch user data. Please try again later.');
      return { services: [], supportTeam: [] };
    }
  };

  const updateNdisPlan = async (userId, updatedPlan) => {
    try {
      await api.put(`/api/users/ndis-plans/ndis-plan/${userId}`, updatedPlan);
      await fetchUsers();
      return true;
    } catch (error) {
      console.error('Error updating NDIS plan:', error);
      setError('Failed to update NDIS plan. Please try again later.');
      return false;
    }
  };

  const updateSupportTeam = async (userId, updatedTeam) => {
    try {
      const response = await api.post(`/api/users/admin/support-team/${userId}`, {
        supportTeam: updatedTeam
      });
      if (response.status === 200) {
        await fetchUsers();
        return true;
      } else {
        throw new Error('Failed to update support team. Please try again.');
      }
    } catch (error) {
      console.error('Error updating support team:', error);
      setError('Failed to update support team. Please try again later.');
      return false;
    }
  };

  return {
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
  };
};

export default useUserManagement;