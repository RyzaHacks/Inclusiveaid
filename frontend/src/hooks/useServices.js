// src/hooks/useServices.js
import { useState, useCallback } from 'react';
import api from '../utils/api';

const useServices = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const fetchServices = useCallback(async (params) => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/v2/admin/services', { params });
      setServices(response.data.services || []);
      setTotalPages(response.data.totalPages || 1);
      setError(null);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services. Please try again later.');
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addService = async (serviceData) => {
    try {
      await api.post('/api/v2/admin/services', serviceData);
      return true;
    } catch (error) {
      console.error('Error adding service:', error);
      setError('Failed to add service. Please try again later.');
      return false;
    }
  };

  const updateService = async (id, serviceData) => {
    try {
      await api.put(`/api/v2/admin/services/${id}`, serviceData);
      return true;
    } catch (error) {
      console.error('Error updating service:', error);
      setError('Failed to update service. Please try again later.');
      return false;
    }
  };

  const deleteService = async (id) => {
    try {
      await api.delete(`/api/v2/admin/services/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      setError('Failed to delete service. Please try again later.');
      return false;
    }
  };

  const assignService = async (assignmentData) => {
    try {
      await api.post('/api/v2/admin/service-assignments', assignmentData);
      return true;
    } catch (error) {
      console.error('Error assigning service:', error);
      setError('Failed to assign service. Please try again later.');
      return false;
    }
  };

  return {
    services,
    isLoading,
    error,
    totalPages,
    fetchServices,
    addService,
    updateService,
    deleteService,
    assignService
  };
};

export default useServices;