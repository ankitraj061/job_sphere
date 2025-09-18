'use client';

import { useState, useEffect, useCallback } from 'react';
import { EmployerData} from './types'
import { employerDashboardApi } from './employerDashboardApi';

interface UseEmployerDashboardReturn {
  data: EmployerData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export const useEmployerDashboard = (autoRefreshInterval?: number): UseEmployerDashboardReturn => {
  const [data, setData] = useState<EmployerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async (force = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await employerDashboardApi.getDashboardData(force);
      if (response.success) {
        setData(response.data);
        setLastUpdated(new Date());
      } else {
        throw new Error(response.message || 'Failed to fetch employer dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    try {
      await employerDashboardApi.refreshDashboard();
      await fetchData(true);
    } catch (err) {
      console.error('Employer refetch failed:', err);
    }
  }, [fetchData]);

  useEffect(() => {
    const cached = employerDashboardApi.getCachedData();
    if (cached && cached.success) {
      setData(cached.data);
      setLastUpdated(new Date());
      setLoading(false);

      if (employerDashboardApi.isDataStale()) fetchData();
    } else {
      fetchData();
    }
  }, [fetchData]);

  useEffect(() => {
    if (!autoRefreshInterval) return;
    const interval = setInterval(() => {
      if (!document.hidden && data) fetchData();
    }, autoRefreshInterval);
    return () => clearInterval(interval);
  }, [autoRefreshInterval, fetchData, data]);

  return { data, loading, error, refetch, lastUpdated };
};