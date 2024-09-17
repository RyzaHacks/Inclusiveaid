import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAppContext } from '../contexts/AppContext';

const useUserData = () => {
  const { state, dispatch } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const response = await api.get('/api/v3/users/profile');
        dispatch({ type: 'SET_USER', payload: response.data });
      } catch (err) {
        setError('Failed to fetch user data');
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch user data' });
      } finally {
        setLoading(false);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchUserData();
  }, [dispatch]);

  return { user: state.user, loading, error };
};

export default useUserData;
