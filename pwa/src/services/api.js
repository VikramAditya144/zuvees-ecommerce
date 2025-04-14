// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('zuvees-rider-auth') 
      ? JSON.parse(localStorage.getItem('zuvees-rider-auth')).authState.token 
      : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Check if error is due to expired token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear auth data and redirect to login
      localStorage.removeItem('zuvees-rider-auth');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;