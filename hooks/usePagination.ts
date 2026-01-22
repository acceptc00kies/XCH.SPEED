'use client';

/**
 * usePagination Hook
 *
 * Generic pagination hook for paginating arrays of items.
 *
 * @module hooks/usePagination
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { PaginationState, UsePaginationResult } from '@/contracts/types';

/**
 * Default page sizes available
 */
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

/**
 * Default page size
 */
const DEFAULT_PAGE_SIZE = 25;

/**
 * Hook options
 */
interface UsePaginationOptions {
  /** Initial page size */
  initialPageSize?: number;
  /** Total items count (optional, can be set later) */
  totalItems?: number;
  /** Reset to page 1 when total items changes */
  resetOnItemsChange?: boolean;
}

/**
 * Hook for managing pagination state
 *
 * @param options - Pagination options
 * @returns UsePaginationResult with pagination state and actions
 */
export function usePagination(
  options: UsePaginationOptions = {}
): UsePaginationResult {
  const {
    initialPageSize = DEFAULT_PAGE_SIZE,
    totalItems: initialTotalItems = 0,
    resetOnItemsChange = true,
  } = options;

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState(initialTotalItems);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / pageSize));
  }, [totalItems, pageSize]);

  // Build pagination state
  const pagination: PaginationState = useMemo(
    () => ({
      currentPage,
      pageSize,
      totalItems,
      totalPages,
    }),
    [currentPage, pageSize, totalItems, totalPages]
  );

  // Reset to page 1 when total items changes significantly
  useEffect(() => {
    if (resetOnItemsChange && currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [totalPages, currentPage, resetOnItemsChange]);

  // Go to specific page
  const goToPage = useCallback(
    (page: number): void => {
      const targetPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(targetPage);
    },
    [totalPages]
  );

  // Go to next page
  const nextPage = useCallback((): void => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  // Go to previous page
  const prevPage = useCallback((): void => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  // Change page size
  const setPageSize = useCallback((size: number): void => {
    setPageSizeState(size);
    setCurrentPage(1); // Reset to first page when changing size
  }, []);

  // Get paginated slice of items
  const paginateItems = useCallback(
    <T>(items: T[]): T[] => {
      // Update total items count
      if (items.length !== totalItems) {
        setTotalItems(items.length);
      }

      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return items.slice(startIndex, endIndex);
    },
    [currentPage, pageSize, totalItems]
  );

  // Navigation state
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return {
    pagination,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    paginateItems,
    canGoPrev,
    canGoNext,
  };
}

/**
 * Calculate pagination info without hooks (utility function)
 *
 * @param currentPage - Current page number
 * @param pageSize - Items per page
 * @param totalItems - Total number of items
 * @returns Pagination state
 */
export function calculatePagination(
  currentPage: number,
  pageSize: number,
  totalItems: number
): PaginationState {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

  return {
    currentPage: validCurrentPage,
    pageSize,
    totalItems,
    totalPages,
  };
}

/**
 * Get page range for pagination display
 *
 * @param currentPage - Current page number
 * @param totalPages - Total number of pages
 * @param maxVisible - Maximum number of page numbers to show
 * @returns Array of page numbers to display
 */
export function getPageRange(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): number[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const halfVisible = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - halfVisible);
  let end = Math.min(totalPages, start + maxVisible - 1);

  // Adjust start if we're near the end
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
