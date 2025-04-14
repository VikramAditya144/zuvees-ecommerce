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

export const getRiders = async () => {
  try {
    const response = await api.get('/users/riders');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};