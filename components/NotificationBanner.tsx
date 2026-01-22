'use client';

/**
 * NotificationBanner Component
 *
 * Banner prompting users to enable notifications.
 */

import { useState } from 'react';

interface NotificationBannerProps {
  permission: NotificationPermission | 'unsupported';
  onRequestPermission: () => Promise<boolean>;
}

export function NotificationBanner({
  permission,
  onRequestPermission,
}: NotificationBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  // Don't show if already granted, denied, unsupported, or dismissed
  if (permission !== 'default' || isDismissed) {
    return null;
  }

  const handleEnable = async () => {
    setIsRequesting(true);
    await onRequestPermission();
    setIsRequesting(false);
  };

  return (
    <div className="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-accent-blue/20 flex items-center justify-center flex-shrink-0">
            <svg
              className="h-5 w-5 text-accent-blue"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-text-primary">Enable Price Alerts</p>
            <p className="text-sm text-text-secondary">
              Get notified when tokens you are watching have significant price changes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setIsDismissed(true)}
            className="px-3 py-1.5 text-sm text-text-muted hover:text-text-secondary transition-colors"
          >
            Dismiss
          </button>
          <button
            onClick={handleEnable}
            disabled={isRequesting}
            className="px-4 py-1.5 bg-accent-blue text-white text-sm font-medium rounded-lg hover:bg-accent-blue/90 transition-colors disabled:opacity-50"
          >
            {isRequesting ? 'Enabling...' : 'Enable'}
          </button>
        </div>
      </div>
    </div>
  );
}
