'use client';

/**
 * FilterPanel Component
 *
 * Advanced filter UI for filtering tokens by price, volume, change, and watchlist.
 * Collapsible panel with range inputs.
 */

import { useState } from 'react';
import { AdvancedFilters } from '@/contracts/types';

interface FilterPanelProps {
  filters: AdvancedFilters;
  onPriceRangeChange: (min: number, max: number) => void;
  onVolumeRangeChange: (min: number, max: number) => void;
  onChangeRangeChange: (min: number, max: number) => void;
  onWatchlistChange: (enabled: boolean) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  watchlistCount: number;
}

export function FilterPanel({
  filters,
  onPriceRangeChange,
  onVolumeRangeChange,
  onChangeRangeChange,
  onWatchlistChange,
  onClearFilters,
  hasActiveFilters,
  watchlistCount,
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Local state for range inputs
  const [priceMin, setPriceMin] = useState(filters.priceRange?.min.toString() || '');
  const [priceMax, setPriceMax] = useState(filters.priceRange?.max.toString() || '');
  const [volumeMin, setVolumeMin] = useState(filters.volumeRange?.min.toString() || '');
  const [volumeMax, setVolumeMax] = useState(filters.volumeRange?.max.toString() || '');
  const [changeMin, setChangeMin] = useState(filters.changeRange?.min.toString() || '');
  const [changeMax, setChangeMax] = useState(filters.changeRange?.max.toString() || '');

  const handlePriceApply = () => {
    const min = parseFloat(priceMin) || 0;
    const max = parseFloat(priceMax) || Infinity;
    onPriceRangeChange(min, max === Infinity ? 999999999 : max);
  };

  const handleVolumeApply = () => {
    const min = parseFloat(volumeMin) || 0;
    const max = parseFloat(volumeMax) || Infinity;
    onVolumeRangeChange(min, max === Infinity ? 999999999 : max);
  };

  const handleChangeApply = () => {
    const min = parseFloat(changeMin) || -100;
    const max = parseFloat(changeMax) || 1000;
    onChangeRangeChange(min, max);
  };

  const handleClear = () => {
    setPriceMin('');
    setPriceMax('');
    setVolumeMin('');
    setVolumeMax('');
    setChangeMin('');
    setChangeMax('');
    onClearFilters();
  };

  return (
    <div className="bg-background-secondary border border-border-primary rounded-lg overflow-hidden">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-background-tertiary transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-text-secondary"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium text-text-primary">Advanced Filters</span>
          {hasActiveFilters && (
            <span className="bg-accent-blue text-white text-xs px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </div>
        <svg
          className={`h-5 w-5 text-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Expandable content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border-primary">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {/* Price Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">
                Price Range (XCH)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue"
                  step="0.000001"
                />
                <span className="text-text-muted">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue"
                  step="0.000001"
                />
              </div>
              <button
                onClick={handlePriceApply}
                className="w-full py-1.5 text-xs bg-background-tertiary hover:bg-border-primary rounded transition-colors text-text-secondary"
              >
                Apply
              </button>
            </div>

            {/* Volume Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">
                24h Volume (XCH)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={volumeMin}
                  onChange={(e) => setVolumeMin(e.target.value)}
                  className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue"
                  step="0.01"
                />
                <span className="text-text-muted">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={volumeMax}
                  onChange={(e) => setVolumeMax(e.target.value)}
                  className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue"
                  step="0.01"
                />
              </div>
              <button
                onClick={handleVolumeApply}
                className="w-full py-1.5 text-xs bg-background-tertiary hover:bg-border-primary rounded transition-colors text-text-secondary"
              >
                Apply
              </button>
            </div>

            {/* Change Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">
                24h Change (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min %"
                  value={changeMin}
                  onChange={(e) => setChangeMin(e.target.value)}
                  className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue"
                  step="0.1"
                />
                <span className="text-text-muted">-</span>
                <input
                  type="number"
                  placeholder="Max %"
                  value={changeMax}
                  onChange={(e) => setChangeMax(e.target.value)}
                  className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue"
                  step="0.1"
                />
              </div>
              <button
                onClick={handleChangeApply}
                className="w-full py-1.5 text-xs bg-background-tertiary hover:bg-border-primary rounded transition-colors text-text-secondary"
              >
                Apply
              </button>
            </div>

            {/* Watchlist Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">
                Watchlist
              </label>
              <button
                onClick={() => onWatchlistChange(!filters.onlyWatchlist)}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  filters.onlyWatchlist
                    ? 'bg-accent-yellow/20 border-accent-yellow text-accent-yellow'
                    : 'bg-background-tertiary border-border-primary text-text-secondary hover:border-accent-yellow'
                }`}
              >
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>
                  {filters.onlyWatchlist ? 'Showing Watchlist' : 'Show Watchlist Only'}
                </span>
                <span className="text-xs">({watchlistCount})</span>
              </button>
              <div className="h-[30px]" /> {/* Spacer to align with other columns */}
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-border-secondary">
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-4 py-2 text-sm text-accent-red hover:bg-accent-red/10 rounded-lg transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
