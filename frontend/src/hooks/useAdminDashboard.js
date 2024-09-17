// inclusive-aid\frontend\src\hooks\useAdminDashboard.js
import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './useAuth';

const useAdminDashboard = () => {
  const { userRole } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalServices: 0,
    activeClients: 0,
    userGrowth: [],
    recentAppointments: []
  });
  const [systemHealth, setSystemHealth] = useState(null);
  const [userActivity, setUserActivity] = useState(null);
  const [serviceUtilization, setServiceUtilization] = useState(null);
  const [ndisPlanAnalytics, setNdisPlanAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (userRole === 'admin') {
        const [dashboardRes, healthRes, activityRes, serviceRes, ndisRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/system-health'),
          api.get('/admin/user-activity'),
          api.get('/admin/service-utilization'),
          api.get('/admin/ndis-plan-analytics')
        ]);

        setDashboardData(dashboardRes.data);
        setSystemHealth(healthRes.data);
        setUserActivity(activityRes.data);
        setServiceUtilization(serviceRes.data);
        setNdisPlanAnalytics(ndisRes.data);
      } else {
        throw new Error('Access denied. Admin role required.');
      }
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole === 'admin') {
      fetchDashboardData();
    }
  }, [userRole]);

  return { 
    dashboardData, 
    systemHealth, 
    userActivity, 
    serviceUtilization, 
    ndisPlanAnalytics, 
    loading, 
    error, 
    refreshDashboard: fetchDashboardData 
  };
};

export default useAdminDashboard;