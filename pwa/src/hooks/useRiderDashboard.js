// src/hooks/useRiderDashboard.js
import { useCallback } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { dashboardState } from '../recoil/atoms/dashboardAtom';
import { getRiderDashboard } from '../services/rider';

export const useRiderDashboard = () => {
  const dashboard = useRecoilValue(dashboardState);
  const setDashboard = useSetRecoilState(dashboardState);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setDashboard(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await getRiderDashboard();
      
      if (response.success) {
        setDashboard(prev => ({
          ...prev,
          stats: response.data.counts,
          performance: response.data.performance,
          recentOrders: response.data.recentOrders,
          loading: false
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setDashboard(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load dashboard statistics'
      }));
    }
  }, [setDashboard]);

  return {
    stats: dashboard.stats,
    performance: dashboard.performance,
    recentOrders: dashboard.recentOrders,
    loading: dashboard.loading,
    error: dashboard.error,
    fetchDashboardStats
  };
};