import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import api from '../../utils/api';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);

        if (token) {
            try {
                const response = await api.get('/api/v3/users/profile', {
                    params: {
                        include: 'role.dashboardConfig,role.sidebarItems'
                    }
                });
                const userData = response.data;
                setUser(userData);
                setUserRole(userData.role?.name);
                localStorage.setItem('user', JSON.stringify(userData));
            } catch (error) {
                console.error('Error checking auth:', error);
                handleLogout();
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (email, password) => {
        try {
            const response = await api.post('/api/v3/auth/login', { email, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setIsAuthenticated(true);
            setUser(user);
            setUserRole(user.role?.name);
            return user;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const handleLogout = useCallback(async () => {
        try {
            await api.post('/api/v3/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            setUserRole(null);
            setUser(null);
            router.push('/login');
        }
    }, [router]);

    const updateUserProfile = async (updatedData) => {
        try {
            const response = await api.put('/api/v3/users/profile', updatedData);
            const updatedUser = response.data;
            setUser(updatedUser);
            setUserRole(updatedUser.role?.name);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    };

    return { 
        isAuthenticated, 
        userRole, 
        user, 
        loading, 
        login, 
        logout: handleLogout,
        checkAuth,
        updateUserProfile
    };
};

export default useAuth;