'use client';

/**
 * AlertToggle Component
 *
 * Button to enable/disable price alerts for a token.
 */

interface AlertToggleProps {
  tokenId: string;
  isEnabled: boolean;
  onToggle: (tokenId: string) => void;
  isSupported: boolean;
}

export function AlertToggle({
  tokenId,
  isEnabled,
  onToggle,
  isSupported,
}: AlertToggleProps) {
  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={() => onToggle(tokenId)}
      className={`p-1.5 rounded-md transition-colors ${
        isEnabled
          ? 'text-accent-yellow bg-accent-yellow/10 hover:bg-accent-yellow/20'
          : 'text-text-muted hover:text-text-secondary hover:bg-background-tertiary'
      }`}
      title={isEnabled ? 'Disable price alert' : 'Enable price alert'}
      aria-label={isEnabled ? 'Disable price alert' : 'Enable price alert'}
    >
      <svg
        className="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        {isEnabled ? (
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        ) : (
          <path
            fillRule="evenodd"
            d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
            clipRule="evenodd"
            opacity={0.4}
          />
        )}
      </svg>
    </button>
  );
}
