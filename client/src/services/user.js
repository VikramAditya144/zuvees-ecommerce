// src/services/user.js
import api from './api';

export const updateProfile = async (userData) => {
  try {
    const response = await api.patch('/users/profile', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const checkEmail = async (email) => {
  try {
    const response = await api.post('/users/check-email', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Function to get all riders (simple version - backward compatible)
export const getRiders = async () => {
  try {
    const response = await api.get('/users/riders');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Function to get riders with pagination and filters
export const getRidersWithPagination = async (params = {}) => {
  try {
    // Using the existing endpoint with role=rider parameter
    const response = await api.get('/users', { 
      params: { role: 'rider', ...params } 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Function to get a single rider by ID
export const getRiderById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Function to update rider details
export const updateRider = async (id, data) => {
  try {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Function to toggle rider active status
export const toggleRiderStatus = async (id, isActive) => {
  try {
    const response = await api.patch(`/users/${id}/status`, { isActive });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  updateProfile,
  checkEmail,
  getRiders,
  getRidersWithPagination,
  getRiderById,
  updateRider,
  toggleRiderStatus
};