'use client';

/**
 * usePolling Hook
 *
 * Manages automatic data polling for live updates.
 * Fetches fresh data at specified intervals.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { DashboardData, UsePollingResult } from '@/contracts/types';

const DEFAULT_INTERVAL = 30000; // 30 seconds

interface UsePollingOptions {
  /** Polling interval in milliseconds */
  interval?: number;
  /** Initial data from server-side render */
  initialData: DashboardData;
  /** Callback when new data is received */
  onDataUpdate?: (prevData: DashboardData, newData: DashboardData) => void;
}

export function usePolling({
  interval = DEFAULT_INTERVAL,
  initialData,
  onDataUpdate,
}: UsePollingOptions): UsePollingResult {
  const [data, setData] = useState<DashboardData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(
    new Date(initialData.fetchedAt)
  );

  // Ref to track previous data for comparison
  const prevDataRef = useRef<DashboardData>(initialData);

  // Fetch function
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/dashboard');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch data');
      }

      const newData: DashboardData = result.data;

      // Call update callback before setting state
      if (onDataUpdate) {
        onDataUpdate(prevDataRef.current, newData);
      }

      prevDataRef.current = newData;
      setData(newData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [onDataUpdate]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Set up polling interval
  useEffect(() => {
    // Don't poll if interval is 0 or negative
    if (interval <= 0) return;

    const intervalId = setInterval(fetchData, interval);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [interval, fetchData]);

  // Update when initial data changes (e.g., navigation)
  useEffect(() => {
    setData(initialData);
    prevDataRef.current = initialData;
    setLastUpdated(new Date(initialData.fetchedAt));
  }, [initialData]);

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    refresh,
  };
}
