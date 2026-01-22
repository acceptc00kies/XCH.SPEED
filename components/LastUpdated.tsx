'use client';

/**
 * LastUpdated Component
 *
 * Displays the last data update timestamp.
 */

import { useEffect, useState } from 'react';

interface LastUpdatedProps {
  timestamp: Date | null;
  isLoading?: boolean;
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export function LastUpdated({ timestamp, isLoading = false }: LastUpdatedProps) {
  const [timeAgo, setTimeAgo] = useState<string>('');

  // Update the "time ago" display every 5 seconds
  useEffect(() => {
    if (!timestamp) return;

    const updateTimeAgo = () => {
      setTimeAgo(formatTimeAgo(timestamp));
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 5000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return (
    <div className="flex items-center gap-2 text-sm text-text-muted">
      {isLoading ? (
        <>
          <span className="inline-block h-2 w-2 rounded-full bg-accent-yellow animate-pulse" />
          <span>Updating...</span>
        </>
      ) : timestamp ? (
        <>
          <span className="inline-block h-2 w-2 rounded-full bg-accent-green" />
          <span>Updated {timeAgo}</span>
        </>
      ) : (
        <>
          <span className="inline-block h-2 w-2 rounded-full bg-text-muted" />
          <span>No data</span>
        </>
      )}
    </div>
  );
}
