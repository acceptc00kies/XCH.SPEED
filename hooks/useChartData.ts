'use client';

/**
 * useChartData Hook
 *
 * Hook for fetching and managing chart data with timeframe selection.
 * Uses SWR-like pattern for data fetching.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  ChartData,
  ChartTimeframe,
  DashboardToken,
  UseChartDataResult,
} from '@/contracts/types';
import { fetchChartData } from '@/lib/chart-data';

/**
 * Hook for managing chart data fetching and state
 *
 * @param tokenId - The token ID to fetch chart data for
 * @param currentToken - Current token data for fallback generation
 * @returns Chart data state and controls
 */
export function useChartData(
  tokenId: string,
  currentToken?: DashboardToken
): UseChartDataResult {
  const [data, setData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('7D');

  // Fetch chart data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchChartData(tokenId, timeframe, currentToken);

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error);
        setData(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch chart data'));
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [tokenId, timeframe, currentToken]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle timeframe change
  const handleTimeframeChange = useCallback((newTimeframe: ChartTimeframe) => {
    setTimeframe(newTimeframe);
  }, []);

  // Manual refresh
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    timeframe,
    setTimeframe: handleTimeframeChange,
    refresh,
  };
}

/**
 * Hook for fetching chart data with SWR-like API
 * Falls back to API fetch if local data is insufficient
 */
export function useChartDataWithFetch(
  tokenId: string,
  currentToken?: DashboardToken
): UseChartDataResult {
  const [data, setData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('7D');

  // Fetch from API
  const fetchFromApi = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/charts/${tokenId}?timeframe=${timeframe}`
      );
      const result = await response.json();

      if (result.success && result.data) {
        return result.data as ChartData;
      }
      return null;
    } catch {
      return null;
    }
  }, [tokenId, timeframe]);

  // Fetch chart data - try local first, then API
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // First try local storage
      const localResult = await fetchChartData(tokenId, timeframe, currentToken);

      if (localResult.success && localResult.data.dataPoints.length > 5) {
        // Enough local data
        setData(localResult.data);
      } else {
        // Try API
        const apiData = await fetchFromApi();

        if (apiData) {
          // Merge API data with local data
          const mergedPoints = [
            ...apiData.dataPoints,
            ...(localResult.success ? localResult.data.dataPoints : []),
          ];

          // Deduplicate and sort by timestamp
          const uniquePoints = mergedPoints.reduce(
            (acc, point) => {
              const existing = acc.find((p) => p.timestamp === point.timestamp);
              if (!existing) {
                acc.push(point);
              }
              return acc;
            },
            [] as typeof mergedPoints
          );

          uniquePoints.sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

          setData({
            tokenId,
            timeframe,
            dataPoints: uniquePoints,
            fetchedAt: new Date().toISOString(),
          });
        } else if (localResult.success) {
          // Fall back to local data
          setData(localResult.data);
        } else {
          setError(new Error('No chart data available'));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch chart data'));
    } finally {
      setIsLoading(false);
    }
  }, [tokenId, timeframe, currentToken, fetchFromApi]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    timeframe,
    setTimeframe,
    refresh: fetchData,
  };
}
