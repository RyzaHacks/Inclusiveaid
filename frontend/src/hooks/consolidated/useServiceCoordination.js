import { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';

export const useServiceCoordination = () => {
  const [state, setState] = useState({
    activeClients: [],
    pendingTasks: [],
    upcomingAppointments: [],
    serviceMetrics: null,
    supportTeam: [],
    serviceWorkers: [],
    services: [],
    assignments: [],
    clients: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (endpoint) => {
    try {
      const response = await api.get(endpoint);
      return response.data;
    } catch (err) {
      console.error(`Error fetching data from ${endpoint}:`, err);
      return null;
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        activeClients,
        pendingTasks,
        upcomingAppointments,
        serviceMetrics,
        supportTeam,
        serviceWorkers,
        services,
        assignments,
        clients,
      ] = await Promise.all([
        fetchData('/service-coordination/active-clients'),
        fetchData('/service-coordination/pending-tasks'),
        fetchData('/service-coordination/upcoming-appointments'),
        fetchData('/service-coordination/service-metrics'),
        fetchData('/service-coordination/support-team'),
        fetchData('/service-workers'),
        fetchData('/services'),
        fetchData('/service-assignments'),
        fetchData('/service-coordination/clients-with-services'),
      ]);

      setState({
        activeClients: activeClients || [],
        pendingTasks: pendingTasks || [],
        upcomingAppointments: upcomingAppointments || [],
        serviceMetrics: serviceMetrics || null,
        supportTeam: supportTeam || [],
        serviceWorkers: serviceWorkers || [],
        services: services || [],
        assignments: assignments || [],
        clients: clients || [],
      });
    } catch (err) {
      setError('Failed to load service coordination data. Please try again later.');
      console.error('Error in fetchAllData:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const updateEntity = useCallback(async (entityType, entityData) => {
    try {
      let endpoint;
      let method;

      switch (entityType) {
        case 'service':
          endpoint = entityData.id ? `/services/${entityData.id}` : '/services';
          method = entityData.id ? 'put' : 'post';
          break;
        case 'service-assignment':
          endpoint = entityData.id ? `/service-assignments/${entityData.id}` : '/service-assignments';
          method = entityData.id ? 'put' : 'post';
          break;
        case 'service-worker':
          endpoint = entityData.id ? `/service-workers/${entityData.id}` : '/service-workers';
          method = entityData.id ? 'put' : 'post';
          break;
        default:
          throw new Error(`Unknown entity type: ${entityType}`);
      }

      const response = await api[method](endpoint, entityData);
      await fetchAllData(); // Refresh all data after update
      return response.data;
    } catch (error) {
      console.error(`Error ${entityData.id ? 'updating' : 'creating'} ${entityType}:`, error);
      throw error;
    }
  }, [fetchAllData]);

  const deleteEntity = useCallback(async (entityType, entityId) => {
    try {
      let endpoint;

      switch (entityType) {
        case 'service':
          endpoint = `/services/${entityId}`;
          break;
        case 'service-assignment':
          endpoint = `/service-assignments/${entityId}`;
          break;
        case 'service-worker':
          endpoint = `/service-workers/${entityId}`;
          break;
        default:
          throw new Error(`Unknown entity type: ${entityType}`);
      }

      await api.delete(endpoint);
      await fetchAllData(); // Refresh all data after deletion
    } catch (error) {
      console.error(`Error deleting ${entityType}:`, error);
      throw error;
    }
  }, [fetchAllData]);

  const updateService = useCallback((data) => updateEntity('service', data), [updateEntity]);
  const updateAssignment = useCallback((data) => updateEntity('service-assignment', data), [updateEntity]);
  const deleteAssignment = useCallback((id) => deleteEntity('service-assignment', id), [deleteEntity]);
  const createAssignment = useCallback((data) => updateEntity('service-assignment', data), [updateEntity]);

  const updateServiceWorkerAssignments = useCallback(async (serviceWorkerId, assignedServiceIds) => {
    try {
      await api.put(`/service-workers/${serviceWorkerId}/assignments`, { serviceIds: assignedServiceIds });
      await fetchAllData();
    } catch (error) {
      console.error('Error updating service worker assignments:', error);
      throw error;
    }
  }, [fetchAllData]);

  return {
    data: state,
    loading,
    error,
    refreshData: fetchAllData,
    updateService,
    updateAssignment,
    deleteAssignment,
    createAssignment,
    updateServiceWorkerAssignments,
  };
};

export default useServiceCoordination;