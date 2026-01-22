'use client';

/**
 * SortControls Component
 *
 * Dropdown for selecting sort field and direction.
 */

import { SortConfig, SortField } from '@/contracts/types';

interface SortControlsProps {
  sortConfig: SortConfig;
  onSortChange: (field: SortField) => void;
  onToggleDirection: () => void;
}

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'volume24hXch', label: 'Volume (24h)' },
  { value: 'priceXch', label: 'Price (XCH)' },
  { value: 'priceUsd', label: 'Price (USD)' },
  { value: 'change24h', label: 'Change (24h)' },
  { value: 'change7d', label: 'Change (7d)' },
  { value: 'name', label: 'Name' },
  { value: 'symbol', label: 'Symbol' },
];

export function SortControls({
  sortConfig,
  onSortChange,
  onToggleDirection,
}: SortControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-text-secondary text-sm">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={sortConfig.field}
        onChange={(e) => onSortChange(e.target.value as SortField)}
        className="bg-background-secondary border border-border-primary rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent cursor-pointer"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        onClick={onToggleDirection}
        className="p-2 bg-background-secondary border border-border-primary rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-tertiary transition-colors"
        aria-label={`Sort ${sortConfig.direction === 'asc' ? 'ascending' : 'descending'}`}
        title={`Currently: ${sortConfig.direction === 'asc' ? 'Ascending' : 'Descending'}`}
      >
        {sortConfig.direction === 'asc' ? (
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
