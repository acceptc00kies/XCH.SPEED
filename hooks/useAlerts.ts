'use client';

/**
 * useAlerts Hook
 *
 * Manages browser notifications for price alerts.
 * Handles permission requests and alert triggering.
 */

import { useState, useCallback, useEffect } from 'react';
import { DashboardToken, UseAlertsResult, PriceAlert } from '@/contracts/types';

const STORAGE_KEY = 'xch-dashboard-alerts';
const DEFAULT_THRESHOLD = 5; // 5% change threshold

/**
 * Load enabled tokens from localStorage
 */
function loadEnabledTokens(): Set<string> {
  if (typeof window === 'undefined') return new Set();

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return new Set(parsed);
    }
  } catch {
    // Ignore localStorage errors
  }

  return new Set();
}

/**
 * Save enabled tokens to localStorage
 */
function saveEnabledTokens(tokens: Set<string>): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(tokens)));
  } catch {
    // Ignore localStorage errors
  }
}

export function useAlerts(threshold = DEFAULT_THRESHOLD): UseAlertsResult {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    'unsupported'
  );
  const [enabledTokens, setEnabledTokens] = useState<Set<string>>(() => new Set());

  // Initialize on mount
  useEffect(() => {
    const supported = typeof window !== 'undefined' && 'Notification' in window;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
      setEnabledTokens(loadEnabledTokens());
    }
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch {
      return false;
    }
  }, [isSupported]);

  // Toggle alert for a specific token
  const toggleAlert = useCallback((tokenId: string) => {
    setEnabledTokens((prev) => {
      const next = new Set(prev);
      if (next.has(tokenId)) {
        next.delete(tokenId);
      } else {
        next.add(tokenId);
      }
      saveEnabledTokens(next);
      return next;
    });
  }, []);

  // Send browser notification
  const sendNotification = useCallback(
    (alert: PriceAlert) => {
      if (!isSupported || permission !== 'granted') return;

      const direction = alert.direction === 'up' ? 'rose' : 'fell';
      const emoji = alert.direction === 'up' ? '📈' : '📉';

      const title = `${emoji} ${alert.tokenSymbol} Price Alert`;
      const body = `${alert.tokenName} ${direction} ${Math.abs(alert.changePercent).toFixed(1)}%`;

      try {
        new Notification(title, {
          body,
          icon: `https://icons.dexie.space/${alert.tokenId}.webp`,
          tag: `price-alert-${alert.tokenId}`,
        });
      } catch {
        // Notification failed, ignore
      }
    },
    [isSupported, permission]
  );

  // Check for alerts by comparing previous and new data
  const checkForAlerts = useCallback(
    (prevTokens: DashboardToken[], newTokens: DashboardToken[]) => {
      if (!isSupported || permission !== 'granted' || enabledTokens.size === 0) {
        return;
      }

      // Create map of previous prices
      const prevPriceMap = new Map<string, number>();
      for (const token of prevTokens) {
        prevPriceMap.set(token.id, token.priceXch);
      }

      // Check each new token for significant changes
      for (const token of newTokens) {
        // Skip if not in enabled list
        if (!enabledTokens.has(token.id)) continue;

        const prevPrice = prevPriceMap.get(token.id);
        if (prevPrice === undefined || prevPrice === 0) continue;

        // Calculate percentage change
        const changePercent = ((token.priceXch - prevPrice) / prevPrice) * 100;

        // Check if change exceeds threshold
        if (Math.abs(changePercent) >= threshold) {
          const alert: PriceAlert = {
            tokenId: token.id,
            tokenSymbol: token.symbol,
            tokenName: token.name,
            previousPrice: prevPrice,
            currentPrice: token.priceXch,
            changePercent,
            direction: changePercent >= 0 ? 'up' : 'down',
            timestamp: new Date().toISOString(),
          };

          sendNotification(alert);
        }
      }
    },
    [isSupported, permission, enabledTokens, threshold, sendNotification]
  );

  return {
    isSupported,
    permission,
    enabledTokens,
    requestPermission,
    toggleAlert,
    checkForAlerts,
  };
}
