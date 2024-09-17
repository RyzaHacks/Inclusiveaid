import { useState, useEffect } from 'react';
import api from '../utils/api';

export const useFetchNDISPlan = () => {
    const [ndisPlan, setNdisPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNDISPlan = async () => {
            try {
                const response = await api.get('/api/v3/ndis-plans/ndis-plan');
                setNdisPlan(response.data);
            } catch (err) {
                setError('Failed to load NDIS plan');
                console.error('Error fetching NDIS plan:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchNDISPlan();
    }, []);

    return { ndisPlan, loading, error };
};
