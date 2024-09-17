import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Default to using /api/v4 unless a specific version is specified
    if (!config.url.startsWith('/api/v2') && !config.url.startsWith('/api/v3') && !config.url.startsWith('/api/v4')) {
      config.url = `/api/v4${config.url}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 404 on v4, v3, or v2, fallback to the previous version
    if (error.response && error.response.status === 404) {
      if (originalRequest.url.startsWith('/api/v4')) {
        originalRequest.url = originalRequest.url.replace('/api/v4', '/api/v3');
      } else if (originalRequest.url.startsWith('/api/v3')) {
        originalRequest.url = originalRequest.url.replace('/api/v3', '/api/v2');
      } else if (originalRequest.url.startsWith('/api/v2')) {
        originalRequest.url = originalRequest.url.replace('/api/v2', '');
      }
      return api(originalRequest);
    }

    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;