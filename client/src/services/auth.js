// src/services/auth.js
import api from './api';

export const checkEmailApproval = async (email) => {
  try {
    const response = await api.post('/auth/check-approval', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const googleLogin = async (token) => {
  try {
    const response = await api.post('/auth/google', { token });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};