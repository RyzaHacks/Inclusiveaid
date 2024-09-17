// hooks/useServicesManagement.js
import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const useServicesManagement = (userId) => {
  const [services, setServices] = useState([]);
  const [supportTeam, setSupportTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/v3/services/client/${userId}`);
      setServices(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again later.');
      setLoading(false);
    }
  }, [userId]);

  const fetchSupportTeam = useCallback(async () => {
    try {
      const response = await api.get(`/api/v3/support-team/${userId}`);
      setSupportTeam(response.data);
    } catch (err) {
      console.error('Error fetching support team:', err);
      setError('Failed to load support team. Please try again later.');
    }
  }, [userId]);

  useEffect(() => {
    fetchServices();
    fetchSupportTeam();
  }, [fetchServices, fetchSupportTeam]);

  const scheduleService = async (serviceData) => {
    try {
      const response = await api.post('/api/v3/service-assignments', serviceData);
      setServices([...services, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error scheduling service:', err);
      throw err;
    }
  };

  const updateServiceAssignment = async (assignmentId, updateData) => {
    try {
      const response = await api.put(`/api/v3/service-assignments/${assignmentId}`, updateData);
      setServices(services.map(service => 
        service.id === assignmentId ? { ...service, ...response.data } : service
      ));
      return response.data;
    } catch (err) {
      console.error('Error updating service assignment:', err);
      throw err;
    }
  };

  const cancelServiceAssignment = async (assignmentId) => {
    try {
      await api.delete(`/api/v3/service-assignments/${assignmentId}`);
      setServices(services.filter(service => service.id !== assignmentId));
    } catch (err) {
      console.error('Error canceling service assignment:', err);
      throw err;
    }
  };

  return {
    services,
    supportTeam,
    loading,
    error,
    scheduleService,
    updateServiceAssignment,
    cancelServiceAssignment,
    refreshServices: fetchServices,
    refreshSupportTeam: fetchSupportTeam
  };
};

export default useServicesManagement;