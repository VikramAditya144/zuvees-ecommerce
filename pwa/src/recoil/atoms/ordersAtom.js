// src/recoil/atoms/ordersAtom.js
import { atom } from 'recoil';

export const ordersState = atom({
  key: 'ordersState',
  default: {
    orders: [],
    filteredOrders: [],
    selectedOrder: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      totalPages: 1,
      totalItems: 0,
      limit: 10
    },
    filter: {
      status: ''
    }
  }
});