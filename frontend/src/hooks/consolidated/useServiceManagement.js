// src/hooks/useServiceManagement.js
import { useState, useCallback } from 'react';
import api from '../../utils/api';

const useServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchServices = useCallback(async (page = 1, search = '', category = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/v3/services', {
        params: { page, search, category }
      });
      const servicesWithNumberPrices = response.data.services.map(service => ({
        ...service,
        price: parseFloat(service.price) || 0 // Convert price to a number, default to 0 if invalid
      }));
      setServices(servicesWithNumberPrices);
      setCategories(response.data.categories);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (err) {
      setError('Failed to fetch services');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  

  const createService = async (serviceData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/v3/services', serviceData);
      setServices(prevServices => [...prevServices, response.data]);
      return response.data;
    } catch (err) {
      setError('Failed to create service');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (id, serviceData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/api/v3/services/${id}`, serviceData);
      setServices(prevServices => 
        prevServices.map(service => service.id === id ? response.data : service)
      );
      return response.data;
    } catch (err) {
      setError('Failed to update service');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/v3/services/${id}`);
      setServices(prevServices => prevServices.filter(service => service.id !== id));
    } catch (err) {
      setError('Failed to delete service');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/v3/services/categories');
      setCategories(response.data);
    } catch (err) {
      setError('Failed to fetch service categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addServiceCategory = async (categoryName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/v3/services/categories', { name: categoryName });
      setCategories(prevCategories => [...prevCategories, response.data]);
      return response.data;
    } catch (err) {
      setError('Failed to add service category');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateServiceCategory = async (id, categoryName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/api/v3/services/categories/${id}`, { name: categoryName });
      setCategories(prevCategories => 
        prevCategories.map(category => category.id === id ? response.data : category)
      );
      return response.data;
    } catch (err) {
      setError('Failed to update service category');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteServiceCategory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/v3/services/categories/${id}`);
      setCategories(prevCategories => prevCategories.filter(category => category.id !== id));
    } catch (err) {
      setError('Failed to delete service category');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    services,
    categories,
    loading,
    error,
    totalPages,
    currentPage,
    fetchServices,
    createService,
    updateService,
    deleteService,
    fetchServiceCategories,
    addServiceCategory,
    updateServiceCategory,
    deleteServiceCategory
  };
};

export default useServiceManagement;