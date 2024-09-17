import { useState, useEffect } from 'react';
import api from '../utils/api';

const useDynamicDashboard = (roleName) => {
  const [dashboardConfig, setDashboardConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardConfig = async () => {
      if (!roleName) return;

      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/api/v3/roles/${roleName}/dashboard-config`);
        
        console.log('Dashboard config response:', response.data);
        
        setDashboardConfig(response.data.dashboardConfig);
      } catch (err) {
        console.error('Error fetching dashboard config:', err.message);
        setError('Failed to load dashboard configuration');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardConfig();
  }, [roleName]);

  return { dashboardConfig, loading, error };
};

export default useDynamicDashboard;