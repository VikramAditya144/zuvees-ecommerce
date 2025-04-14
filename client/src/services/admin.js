// src/services/admin.js
import api from './api';

/**
 * Dashboard
 */
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Orders
 */
export const getAllOrders = async (params = {}) => {
  try {
    const response = await api.get('/admin/orders', { params });
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
    const response = await api.patch(`/admin/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const assignRiderToOrder = async (id, riderId) => {
  try {
    const response = await api.patch(`/admin/orders/${id}/assign`, { riderId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Approved Emails
 */
export const getApprovedEmails = async (params = {}) => {
  try {
    const response = await api.get('/admin/approved-emails', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const addApprovedEmail = async (email, role) => {
  try {
    const response = await api.post('/admin/approved-emails', { email, role });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const removeApprovedEmail = async (id) => {
  try {
    const response = await api.delete(`/admin/approved-emails/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  // Dashboard
  getDashboardStats,
  
  // Orders
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  assignRiderToOrder,
  
  // Approved Emails
  getApprovedEmails,
  addApprovedEmail,
  removeApprovedEmail
};