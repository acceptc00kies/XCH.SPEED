'use client';

/**
 * ChartTimeframeSelector Component
 *
 * Buttons for selecting chart timeframe (1D, 7D, 1M, 1Y, ALL).
 */

import { ChartTimeframe } from '@/contracts/types';

interface ChartTimeframeSelectorProps {
  currentTimeframe: ChartTimeframe;
  onTimeframeChange: (timeframe: ChartTimeframe) => void;
}

const TIMEFRAMES: { value: ChartTimeframe; label: string }[] = [
  { value: '1D', label: '1D' },
  { value: '7D', label: '7D' },
  { value: '1M', label: '1M' },
  { value: '1Y', label: '1Y' },
  { value: 'ALL', label: 'ALL' },
];

export function ChartTimeframeSelector({
  currentTimeframe,
  onTimeframeChange,
}: ChartTimeframeSelectorProps) {
  return (
    <div className="flex items-center bg-background-tertiary rounded-lg p-1">
      {TIMEFRAMES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onTimeframeChange(value)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            currentTimeframe === value
              ? 'bg-accent-blue text-white'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
