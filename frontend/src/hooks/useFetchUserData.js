const fetchDashboardData = useCallback(async () => {
  try {
    setLoading(true);
    const [
      ndisPlanRes,
      servicesRes,
      notificationsRes,
      activityLogRes,
      supportTeamRes,
      serviceWorkersRes
    ] = await Promise.all([
      api.get('/api/v3/ndis-plans/ndis-plans'), // Updated API version to v3
      api.get(`/api/v3/users/admin/services/user/${userId}`), // Updated API version to v3
      api.get('/api/v3/users/notifications'), // Updated API version to v3
      api.get(`/api/v3/users/${userId}/activity-logs`), // Updated API version to v3
      api.get(`/api/v3/users/${userId}/support-team/`), // Updated API version to v3
      api.get(`/api/v3/users/${userId}/support-workers`) // Updated API version to v3
    ]);

    setNdisPlan(ndisPlanRes.data);
    setUpcomingServices(servicesRes.data.services || []);
    setNotifications(notificationsRes.data || []);
    setActivityLog(activityLogRes.data || []);
    setSupportTeam(supportTeamRes.data.team || []);
    setAssignedServiceWorkers(serviceWorkersRes.data.workers || []);

    setLoading(false);
  } catch (err) {
    console.error('Error fetching dashboard data:', err.response ? err.response.data : err.message);
    setError('Failed to load dashboard data. Please try again later.');
    setLoading(false);
  }
}, [userId]);
