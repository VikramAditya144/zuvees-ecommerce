// src/recoil/atoms/authAtom.js
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
  key: 'zuvees-auth',
  storage: typeof window !== 'undefined' ? localStorage : null,
});

export const authState = atom({
  key: 'authState',
  default: {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true,
  },
  effects_UNSTABLE: [persistAtom],
});