// hooks/useClientDashboardData.js
import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const useClientDashboardData = (userId) => {
  const [dashboardData, setDashboardData] = useState({
    ndisPlan: null,
    upcomingServices: [],
    supportTeam: [],
    notifications: [],
    activityLog: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [ndisPlanResponse, servicesResponse, supportTeamResponse, notificationsResponse, activityLogResponse] = await Promise.all([
        api.get(`/api/v3/ndis-plans/${userId}`),
        api.get(`/api/v3/service-assignments?clientId=${userId}`),
        api.get(`/api/v3/support-team-members?clientId=${userId}`),
        api.get(`/api/v3/notifications?userId=${userId}`),
        api.get(`/api/v3/activity-logs?userId=${userId}`)
      ]);

      setDashboardData({
        ndisPlan: ndisPlanResponse.data.data,
        upcomingServices: servicesResponse.data.data,
        supportTeam: supportTeamResponse.data.data,
        notifications: notificationsResponse.data.data,
        activityLog: activityLogResponse.data.data
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err.response ? err.response.data : err.message);
      setError('Failed to load dashboard data. Please try again later.');
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleNDISPlanUpdate = async (updatedPlan) => {
    try {
      const response = await api.put(`/api/v3/ndis-plans/${userId}`, updatedPlan);
      setDashboardData(prevData => ({
        ...prevData,
        ndisPlan: response.data.data
      }));
      console.log('NDIS plan updated successfully');
    } catch (error) {
      console.error('Error updating NDIS plan:', error);
      throw error;
    }
  };

  const scheduleService = async (serviceData) => {
    try {
      const response = await api.post('/api/v3/service-assignments', serviceData);
      setDashboardData(prevData => ({
        ...prevData,
        upcomingServices: [...prevData.upcomingServices, response.data.data]
      }));
      return response.data.data;
    } catch (error) {
      console.error('Error scheduling service:', error);
      throw error;
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await api.put(`/api/v3/notifications/${notificationId}`, { read: true });
      setDashboardData(prevData => ({
        ...prevData,
        notifications: prevData.notifications.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  const logActivity = async (activityData) => {
    try {
      const response = await api.post('/api/v3/activity-logs', activityData);
      setDashboardData(prevData => ({
        ...prevData,
        activityLog: [response.data.data, ...prevData.activityLog]
      }));
      return response.data.data;
    } catch (error) {
      console.error('Error logging activity:', error);
      throw error;
    }
  };

  return {
    ...dashboardData,
    loading,
    error,
    handleNDISPlanUpdate,
    scheduleService,
    markNotificationAsRead,
    logActivity,
    refreshDashboard: fetchDashboardData
  };
};

export default useClientDashboardData;