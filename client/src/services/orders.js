// src/services/orders.js
import api from './api';

export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMyOrders = async (params = {}) => {
  
  try {
    const response = await api.get('/orders', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const cancelOrder = async (id) => {
  try {
    const response = await api.patch(`/orders/${id}/cancel`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};