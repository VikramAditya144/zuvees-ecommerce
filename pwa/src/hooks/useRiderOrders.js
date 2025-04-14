// src/hooks/useRiderOrders.js
import { useState, useCallback } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { ordersState } from '../recoil/atoms/ordersAtom';
import { getAssignedOrders, getOrderDetails, updateOrderStatus } from '../services/rider';
import { filteredOrdersSelector } from '../recoil/selectors/orderSelectors';

export const useRiderOrders = () => {
  const [loadingAction, setLoadingAction] = useState(false);
  const orderState = useRecoilValue(ordersState);
  const filteredOrders = useRecoilValue(filteredOrdersSelector);
  const setOrderState = useSetRecoilState(ordersState);

  // Fetch all assigned orders
  const fetchAssignedOrders = useCallback(async (params = {}) => {
    try {
      setOrderState(prev => ({ ...prev, loading: true, error: null }));
      
      const { page = 1, limit = 10, status = '' } = params;
      
      const response = await getAssignedOrders({
        page,
        limit,
        status
      });
      
      if (response.success) {
        setOrderState(prev => ({
          ...prev,
          orders: response.data,
          loading: false,
          pagination: {
            page: response.meta.page,
            totalPages: response.meta.pages,
            totalItems: response.meta.total,
            limit: response.meta.limit
          },
          filter: {
            ...prev.filter,
            status
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching assigned orders:', error);
      setOrderState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load assigned orders'
      }));
    }
  }, [setOrderState]);

  // Fetch single order details
  const fetchOrderDetails = useCallback(async (orderId) => {
    try {
      setOrderState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await getOrderDetails(orderId);
      
      if (response.success) {
        setOrderState(prev => ({
          ...prev,
          selectedOrder: response.data,
          loading: false
        }));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      setOrderState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load order details'
      }));
      throw error;
    }
  }, [setOrderState]);

  // Update order status
  const changeOrderStatus = useCallback(async (orderId, status) => {
    try {
      setLoadingAction(true);
      
      const response = await updateOrderStatus(orderId, status);
      
      if (response.success) {
        // Update order in state
        setOrderState(prev => {
          const updatedOrders = prev.orders.map(order => 
            order._id === orderId 
              ? { ...order, status, updatedAt: new Date().toISOString() }
              : order
          );
          
          return {
            ...prev,
            orders: updatedOrders,
            selectedOrder: prev.selectedOrder?._id === orderId 
              ? { ...prev.selectedOrder, status, updatedAt: new Date().toISOString() }
              : prev.selectedOrder
          };
        });
        
        setLoadingAction(false);
        return true;
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setLoadingAction(false);
      throw error;
    }
  }, [setOrderState]);

  // Set filter status
  const setFilterStatus = useCallback((status) => {
    setOrderState(prev => ({
      ...prev,
      filter: {
        ...prev.filter,
        status
      }
    }));
  }, [setOrderState]);

  // Clear selected order
  const clearSelectedOrder = useCallback(() => {
    setOrderState(prev => ({
      ...prev,
      selectedOrder: null
    }));
  }, [setOrderState]);

  return {
    orders: orderState.orders,
    filteredOrders,
    selectedOrder: orderState.selectedOrder,
    loading: orderState.loading,
    loadingAction,
    error: orderState.error,
    pagination: orderState.pagination,
    filter: orderState.filter,
    fetchAssignedOrders,
    fetchOrderDetails,
    changeOrderStatus,
    setFilterStatus,
    clearSelectedOrder
  };
};
