// src/recoil/atoms/dashboardAtom.js
import { atom } from 'recoil';

export const dashboardState = atom({
  key: 'dashboardState',
  default: {
    stats: {
      totalAssigned: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      undeliveredOrders: 0,
      todayOrders: 0
    },
    performance: {
      deliveryRate: 0
    },
    recentOrders: [],
    loading: false,
    error: null
  }
});