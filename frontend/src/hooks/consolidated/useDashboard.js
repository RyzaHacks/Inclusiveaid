import { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';
import { useAuth } from './useAuth';

const useDashboard = (roleName) => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    if (!user || !roleName) {
      console.log('User or roleName not available, skipping fetch');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const endpoints = [
        { key: 'adminusergrowthcomponent', endpoint: '/api/v3/admin/user-growth' },
        { key: 'adminrecentappointmentscomponent', endpoint: '/api/v3/admin/recent-appointments' },
        { key: 'adminsystemhealthcomponent', endpoint: '/api/v3/admin/system-health' },
        { key: 'adminuseractivitycomponent', endpoint: '/api/v3/admin/user-activity' },
        { key: 'adminserviceutilizationcomponent', endpoint: '/api/v3/admin/service-utilization' },
        { key: 'adminndisplananalyticscomponent', endpoint: '/api/v3/admin/ndis-plan-analytics' }
      ];

      const results = await Promise.all(
        endpoints.map(async ({ key, endpoint }) => {
          try {
            console.log(`Fetching data for ${key} from ${endpoint}`);
            const response = await api.get(endpoint);
            console.log(`Received data for ${key}:`, response.data);
            return { [key]: { data: response.data, error: null } };
          } catch (err) {
            console.error(`Error fetching ${endpoint}:`, err);
            return { [key]: { data: null, error: err.message } };
          }
        })
      );

      const newDashboardData = Object.assign({}, ...results);
      console.log('Compiled dashboard data:', newDashboardData);
      setDashboardData(newDashboardData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [user, roleName]);

  useEffect(() => {
    console.log('useDashboard effect triggered', { user, roleName });
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { dashboardData, loading, error };
};

export default useDashboard;