import { useEffect } from 'react';
import api from '../utils/api';
import { useAppContext } from '../contexts/AppContext';

const useServices = (userRole) => {
  const { dispatch } = useAppContext();

  const fetchServices = async () => {
    try {
      const response = await api.get('/api/users/services');
      dispatch({ type: 'SET_SERVICES', payload: response.data });
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  useEffect(() => {
    if (userRole === 'client') {
      fetchServices();
    }
  }, [userRole]);

  return { fetchServices };
};

export default useServices;
