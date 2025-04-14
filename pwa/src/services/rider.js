// src/services/rider.js
import api from './api';

export const getAssignedOrders = async (params = {}) => {
  try {
    const response = await api.get('/rider/orders', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getOrderDetails = async (orderId) => {
  try {
    const response = await api.get(`/rider/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.patch(`/rider/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getRiderDashboard = async () => {
  try {
    const response = await api.get('/rider/dashboard');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};