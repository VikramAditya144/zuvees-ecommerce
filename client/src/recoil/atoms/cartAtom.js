// src/recoil/atoms/cartAtom.js
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
  key: 'zuvees-cart',
  storage: typeof window !== 'undefined' ? localStorage : null,
});

export const cartState = atom({
  key: 'cartState',
  default: {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  },
  effects_UNSTABLE: [persistAtom],
});