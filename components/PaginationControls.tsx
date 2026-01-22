'use client';

/**
 * PaginationControls Component
 *
 * Page navigation with page numbers, prev/next buttons, and page size selector.
 */

import { PaginationState } from '@/contracts/types';
import { PAGE_SIZE_OPTIONS, getPageRange } from '@/hooks/usePagination';

interface PaginationControlsProps {
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

export function PaginationControls({
  pagination,
  onPageChange,
  onPageSizeChange,
  canGoPrev,
  canGoNext,
}: PaginationControlsProps) {
  const { currentPage, pageSize, totalItems, totalPages } = pagination;

  // Get visible page numbers
  const pageRange = getPageRange(currentPage, totalPages, 5);

  // Calculate item range being displayed
  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      {/* Items info and page size selector */}
      <div className="flex items-center gap-4 text-sm text-text-secondary">
        <span>
          Showing {startItem}-{endItem} of {totalItems}
        </span>
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="sr-only">
            Items per page
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-background-tertiary border border-border-primary rounded-lg px-2 py-1 text-text-primary focus:outline-none focus:border-accent-blue"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Page navigation */}
      <div className="flex items-center gap-1">
        {/* First page button */}
        <button
          onClick={() => onPageChange(1)}
          disabled={!canGoPrev}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="First page"
        >
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Previous page button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrev}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Previous page"
        >
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Page number buttons */}
        <div className="flex items-center gap-1">
          {/* Show first page if not in range */}
          {pageRange[0] > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="min-w-[36px] h-9 px-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-background-tertiary transition-colors"
              >
                1
              </button>
              {pageRange[0] > 2 && (
                <span className="px-1 text-text-muted">...</span>
              )}
            </>
          )}

          {/* Page numbers */}
          {pageRange.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[36px] h-9 px-2 rounded-lg text-sm transition-colors ${
                page === currentPage
                  ? 'bg-accent-blue text-white font-medium'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
              }`}
            >
              {page}
            </button>
          ))}

          {/* Show last page if not in range */}
          {pageRange[pageRange.length - 1] < totalPages && (
            <>
              {pageRange[pageRange.length - 1] < totalPages - 1 && (
                <span className="px-1 text-text-muted">...</span>
              )}
              <button
                onClick={() => onPageChange(totalPages)}
                className="min-w-[36px] h-9 px-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-background-tertiary transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Next page button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Next page"
        >
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Last page button */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoNext}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Last page"
        >
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0zm6 0a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
