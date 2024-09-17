//inclusive-aid\frontend\src\hooks\consolidated\useUserManagement.js
import { useState, useCallback, useEffect } from 'react';
import api from '../../utils/api';

const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRoles, setUserRoles] = useState([]);

  const fetchUsers = useCallback(async (page = 1, limit = 10, search = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/v3/users?page=${page}&limit=${limit}&search=${search}`);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      setTotalUsers(response.data.totalUsers);
    } catch (err) {
      setError('Failed to fetch users: ' + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/v3/users/register', userData);
      setUsers(prevUsers => [...prevUsers, response.data]);
      return response.data;
    } catch (err) {
      setError('Failed to create user: ' + (err.response?.data?.message || err.message));
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/api/v3/users/${id}`, userData);
      setUsers(prevUsers => prevUsers.map(user => user.id === id ? response.data : user));
      return response.data;
    } catch (err) {
      setError('Failed to update user: ' + (err.response?.data?.message || err.message));
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/v3/users/${id}`);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    } catch (err) {
      setError('Failed to delete user: ' + (err.response?.data?.message || err.message));
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/v3/users/roles');
      setUserRoles(response.data);
    } catch (err) {
      setError('Failed to fetch user roles: ' + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchUserRoles();
  }, [fetchUsers, fetchUserRoles]);

  return {
    users,
    totalPages,
    currentPage,
    totalUsers,
    loading,
    error,
    userRoles,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    fetchUserRoles
  };
};

export default useUserManagement;