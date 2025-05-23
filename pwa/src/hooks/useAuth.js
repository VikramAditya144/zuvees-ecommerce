// src/hooks/useAuth.js
import { useEffect } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { authState } from '../recoil/atoms/authAtom';
import { getCurrentUser } from '../services/auth';

export const useAuth = () => {
  const auth = useRecoilValue(authState);
  const setAuth = useSetRecoilState(authState);

  const login = (userData, token) => {
    setAuth({
      isAuthenticated: true,
      user: userData,
      token,
      loading: false,
    });
  };

  const logout = () => {
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
    });
  };

  useEffect(() => {
    const loadUser = async () => {
      if (auth.token) {
        try {
          const response = await getCurrentUser();
          if (response.success) {
            setAuth({
              ...auth,
              user: response.data,
              loading: false,
            });
          } else {
            logout();
          }
        } catch (error) {
          console.error('Error loading user:', error);
          logout();
        }
      } else {
        setAuth({ ...auth, loading: false });
      }
    };

    if (auth.loading) {
      loadUser();
    }
  }, []);

  return {
    ...auth,
    login,
    logout,
  };
};