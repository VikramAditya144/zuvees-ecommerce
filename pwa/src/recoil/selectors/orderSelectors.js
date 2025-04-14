// src/recoil/selectors/ordersSelectors.js
import { selector } from 'recoil';
import { ordersState } from '../atoms/ordersAtom';

export const pendingOrdersSelector = selector({
  key: 'pendingOrdersSelector',
  get: ({ get }) => {
    const { orders } = get(ordersState);
    return orders.filter(order => order.status === 'SHIPPED');
  }
});

export const completedOrdersSelector = selector({
  key: 'completedOrdersSelector',
  get: ({ get }) => {
    const { orders } = get(ordersState);
    return orders.filter(order => 
      order.status === 'DELIVERED' || 
      order.status === 'UNDELIVERED'
    );
  }
});

export const filteredOrdersSelector = selector({
  key: 'filteredOrdersSelector',
  get: ({ get }) => {
    const { orders, filter } = get(ordersState);
    
    if (!filter.status) {
      return orders;
    }
    
    return orders.filter(order => order.status === filter.status);
  }
});