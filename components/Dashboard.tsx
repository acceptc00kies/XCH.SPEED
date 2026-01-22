'use client';

/**
 * Dashboard Component
 *
 * Main client-side dashboard that handles all interactive state.
 * Receives initial data from server component and manages live updates.
 * Integrates filters, pagination, view modes, and watchlist.
 */

import { useCallback, useState, useEffect } from 'react';
import { DashboardData, DashboardToken, ViewMode } from '@/contracts/types';
import { usePolling, useAlerts, useSearch, useSort } from '@/hooks';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useAdvancedFilters } from '@/hooks/useAdvancedFilters';
import { usePagination } from '@/hooks/usePagination';
import { addPricePoints } from '@/lib/chart-data';
import {
  Header,
  SearchBar,
  SortControls,
  LastUpdated,
  TokenTable,
  NotificationBanner,
} from '@/components';
import { FilterPanel } from './FilterPanel';
import { PaginationControls } from './PaginationControls';
import { ViewModeSwitcher } from './ViewModeSwitcher';
import { TokenGrid } from './TokenGrid';

interface DashboardProps {
  initialData: DashboardData;
}

export function Dashboard({ initialData }: DashboardProps) {
  // View mode state - auto-select based on screen size
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Handle responsive view mode
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setViewMode('card');
      }
    };

    // Check on mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Price alerts management
  const {
    isSupported: isAlertSupported,
    permission,
    enabledTokens,
    requestPermission,
    toggleAlert,
    checkForAlerts,
  } = useAlerts();

  // Watchlist management
  const { watchlist, toggleWatchlist } = useWatchlist();

  // Advanced filters
  const {
    filters,
    setPriceRange,
    setVolumeRange,
    setChangeRange,
    setOnlyWatchlist,
    clearFilters,
    applyFilters,
    hasActiveFilters,
  } = useAdvancedFilters();

  // Data polling with alert checking and chart data recording
  const handleDataUpdate = useCallback(
    (prevData: DashboardData, newData: DashboardData) => {
      checkForAlerts(prevData.tokens, newData.tokens);
      // Record price points for chart history
      addPricePoints(newData.tokens);
    },
    [checkForAlerts]
  );

  const { data, isLoading, lastUpdated, refresh } = usePolling({
    initialData,
    interval: 30000, // 30 seconds
    onDataUpdate: handleDataUpdate,
  });

  // Record initial data for charts
  useEffect(() => {
    if (initialData?.tokens) {
      addPricePoints(initialData.tokens);
    }
  }, [initialData]);

  // Apply advanced filters first
  const filteredByAdvanced = applyFilters(data?.tokens ?? [], watchlist);

  // Search filtering (on top of advanced filters)
  const { searchQuery, setSearchQuery, filteredTokens } = useSearch(filteredByAdvanced);

  // Sorting
  const { sortConfig, setSortField, toggleDirection, sortedTokens } =
    useSort(filteredTokens);

  // Pagination
  const {
    pagination,
    goToPage,
    setPageSize,
    paginateItems,
    canGoPrev,
    canGoNext,
  } = usePagination({ initialPageSize: 25 });

  // Get paginated tokens
  const paginatedTokens = paginateItems(sortedTokens);

  // Calculate start rank for current page
  const startRank = (pagination.currentPage - 1) * pagination.pageSize + 1;

  return (
    <div className="min-h-screen bg-background-primary">
      <Header xchPriceUsd={data?.xchPriceUsd ?? 0} />

      <main className="container mx-auto px-4 py-6">
        {/* Notification Banner */}
        <NotificationBanner
          permission={permission}
          onRequestPermission={requestPermission}
        />

        {/* Controls Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="flex-1 lg:w-80">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by name or symbol..."
              />
            </div>
            <button
              onClick={refresh}
              disabled={isLoading}
              className="p-2.5 bg-background-secondary border border-border-primary rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-tertiary transition-colors disabled:opacity-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
              title="Refresh data"
            >
              <svg
                className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <ViewModeSwitcher currentMode={viewMode} onModeChange={setViewMode} />
            <SortControls
              sortConfig={sortConfig}
              onSortChange={setSortField}
              onToggleDirection={toggleDirection}
            />
            <LastUpdated timestamp={lastUpdated} isLoading={isLoading} />
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <div className="mb-6">
          <FilterPanel
            filters={filters}
            onPriceRangeChange={setPriceRange}
            onVolumeRangeChange={setVolumeRange}
            onChangeRangeChange={setChangeRange}
            onWatchlistChange={setOnlyWatchlist}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            watchlistCount={watchlist.length}
          />
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-background-secondary border border-border-primary rounded-lg p-4">
            <div className="text-sm text-text-muted">Total Tokens</div>
            <div className="text-2xl font-bold text-text-primary">
              {data?.tokens.length ?? 0}
            </div>
          </div>
          <div className="bg-background-secondary border border-border-primary rounded-lg p-4">
            <div className="text-sm text-text-muted">Showing</div>
            <div className="text-2xl font-bold text-text-primary">
              {sortedTokens.length}
            </div>
          </div>
          <div className="bg-background-secondary border border-border-primary rounded-lg p-4">
            <div className="text-sm text-text-muted">Watchlist</div>
            <div className="text-2xl font-bold text-accent-yellow">
              {watchlist.length}
            </div>
          </div>
          <div className="bg-background-secondary border border-border-primary rounded-lg p-4">
            <div className="text-sm text-text-muted">Alerts Active</div>
            <div className="text-2xl font-bold text-accent-blue">
              {enabledTokens.size}
            </div>
          </div>
        </div>

        {/* Stale Data Warning */}
        {data?.isStale && (
          <div className="bg-accent-yellow/10 border border-accent-yellow/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-accent-yellow"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-accent-yellow font-medium">
                Data may be stale. Refresh to get latest prices.
              </span>
            </div>
          </div>
        )}

        {/* Token List - Table or Grid based on view mode */}
        <div className="bg-background-secondary border border-border-primary rounded-lg overflow-hidden">
          {viewMode === 'table' || viewMode === 'compact' ? (
            <TokenTable
              tokens={paginatedTokens}
              sortConfig={sortConfig}
              onSortChange={setSortField}
              enabledAlerts={enabledTokens}
              onToggleAlert={toggleAlert}
              isAlertSupported={isAlertSupported}
              startRank={startRank}
              watchlist={watchlist}
              onToggleWatchlist={toggleWatchlist}
            />
          ) : (
            <div className="p-4">
              <TokenGrid
                tokens={paginatedTokens}
                startRank={startRank}
                watchlist={watchlist}
                onToggleWatchlist={toggleWatchlist}
                enabledAlerts={enabledTokens}
                onToggleAlert={toggleAlert}
                isAlertSupported={isAlertSupported}
              />
            </div>
          )}

          {/* Pagination */}
          {sortedTokens.length > 0 && (
            <div className="border-t border-border-primary px-4">
              <PaginationControls
                pagination={{ ...pagination, totalItems: sortedTokens.length, totalPages: Math.ceil(sortedTokens.length / pagination.pageSize) }}
                onPageChange={goToPage}
                onPageSizeChange={setPageSize}
                canGoPrev={canGoPrev}
                canGoNext={canGoNext}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-text-muted">
          <p>
            Data provided by{' '}
            <a
              href="https://dexie.space"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-blue hover:underline"
            >
              Dexie.space
            </a>
          </p>
          <p className="mt-1">Prices update automatically every 30 seconds</p>
        </footer>
      </main>
    </div>
  );
}
