// src/recoil/selectors/cartSelectors.js
import { selector } from 'recoil';
import { cartState } from '../atoms/cartAtom';

export const cartItemsSelector = selector({
  key: 'cartItemsSelector',
  get: ({ get }) => {
    const cart = get(cartState);
    return cart.items;
  },
});

export const cartTotalSelector = selector({
  key: 'cartTotalSelector',
  get: ({ get }) => {
    const cart = get(cartState);
    return cart.totalPrice;
  },
});

export const cartItemCountSelector = selector({
  key: 'cartItemCountSelector',
  get: ({ get }) => {
    const cart = get(cartState);
    return cart.totalItems;
  },
});
