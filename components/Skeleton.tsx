'use client';

/**
 * Skeleton Components
 *
 * Reusable skeleton loaders for various components.
 * Uses animate-pulse for loading animation.
 * Matches dimensions of actual content for smooth transitions.
 */

/**
 * TableRowSkeleton - Matches TokenRow dimensions
 */
export function TableRowSkeleton() {
  return (
    <tr className="border-b border-border-secondary">
      {/* Rank */}
      <td className="px-4 py-4">
        <div className="h-4 w-6 bg-background-tertiary rounded animate-pulse" />
      </td>
      {/* Token */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-background-tertiary rounded-full animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-background-tertiary rounded animate-pulse" />
            <div className="h-3 w-12 bg-background-tertiary rounded animate-pulse" />
          </div>
        </div>
      </td>
      {/* Price XCH */}
      <td className="px-4 py-4">
        <div className="h-4 w-20 bg-background-tertiary rounded animate-pulse ml-auto" />
      </td>
      {/* Price USD */}
      <td className="px-4 py-4">
        <div className="h-4 w-16 bg-background-tertiary rounded animate-pulse ml-auto" />
      </td>
      {/* 24h % */}
      <td className="px-4 py-4">
        <div className="h-4 w-14 bg-background-tertiary rounded animate-pulse ml-auto" />
      </td>
      {/* 7d % */}
      <td className="px-4 py-4">
        <div className="h-4 w-14 bg-background-tertiary rounded animate-pulse ml-auto" />
      </td>
      {/* Volume */}
      <td className="px-4 py-4">
        <div className="space-y-2">
          <div className="h-4 w-20 bg-background-tertiary rounded animate-pulse ml-auto" />
          <div className="h-3 w-14 bg-background-tertiary rounded animate-pulse ml-auto" />
        </div>
      </td>
      {/* Sparkline */}
      <td className="px-4 py-4">
        <div className="h-6 w-20 bg-background-tertiary rounded animate-pulse ml-auto" />
      </td>
      {/* Watchlist */}
      <td className="px-2 py-4">
        <div className="h-8 w-8 bg-background-tertiary rounded-lg animate-pulse mx-auto" />
      </td>
      {/* Alert */}
      <td className="px-2 py-4">
        <div className="h-8 w-8 bg-background-tertiary rounded-lg animate-pulse mx-auto" />
      </td>
    </tr>
  );
}

/**
 * CardSkeleton - Matches TokenCard dimensions
 */
export function CardSkeleton() {
  return (
    <div className="bg-background-secondary border border-border-primary rounded-lg p-4 min-h-[240px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 w-8 bg-background-tertiary rounded animate-pulse" />
        <div className="flex gap-1">
          <div className="h-10 w-10 bg-background-tertiary rounded-lg animate-pulse" />
          <div className="h-10 w-10 bg-background-tertiary rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Token info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 bg-background-tertiary rounded-full animate-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-24 bg-background-tertiary rounded animate-pulse" />
          <div className="h-3 w-12 bg-background-tertiary rounded animate-pulse" />
        </div>
      </div>

      {/* Price */}
      <div className="mb-4 space-y-2">
        <div className="h-5 w-28 bg-background-tertiary rounded animate-pulse" />
        <div className="h-4 w-16 bg-background-tertiary rounded animate-pulse" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-background-tertiary rounded-lg p-2 h-14 animate-pulse" />
        <div className="bg-background-tertiary rounded-lg p-2 h-14 animate-pulse" />
        <div className="bg-background-tertiary rounded-lg p-2 h-14 animate-pulse col-span-2" />
      </div>

      {/* Sparkline */}
      <div className="mt-auto pt-2 border-t border-border-primary">
        <div className="h-8 w-36 bg-background-tertiary rounded animate-pulse mx-auto" />
      </div>
    </div>
  );
}

/**
 * ChartSkeleton - For price chart loading state
 */
export function ChartSkeleton() {
  return (
    <div className="bg-background-secondary border border-border-primary rounded-lg p-4">
      {/* Chart header */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-32 bg-background-tertiary rounded animate-pulse" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-8 w-12 bg-background-tertiary rounded animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Chart area */}
      <div className="h-[300px] bg-background-tertiary rounded animate-pulse flex items-end justify-around p-4">
        {/* Fake bars to give shape */}
        {[40, 65, 45, 80, 60, 75, 55, 70, 50, 85].map((height, i) => (
          <div
            key={i}
            className="w-[8%] bg-border-primary rounded-t"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * TrendingSectionSkeleton - For trending section loading state
 */
export function TrendingSectionSkeleton() {
  return (
    <section className="mb-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="h-5 w-5 bg-background-tertiary rounded animate-pulse" />
        <div className="h-5 w-24 bg-background-tertiary rounded animate-pulse" />
      </div>

      {/* Cards - Desktop */}
      <div className="hidden lg:grid grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <TrendingCardSkeleton key={i} />
        ))}
      </div>

      {/* Cards - Mobile */}
      <div className="lg:hidden flex gap-3 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <TrendingCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

/**
 * TrendingCardSkeleton - Single trending card skeleton
 */
function TrendingCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[160px] sm:w-[180px]">
      <div className="bg-background-secondary border border-border-primary rounded-lg p-3">
        {/* Token Info */}
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 bg-background-tertiary rounded-full animate-pulse" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3.5 w-10 bg-background-tertiary rounded animate-pulse" />
            <div className="h-2.5 w-16 bg-background-tertiary rounded animate-pulse" />
          </div>
        </div>

        {/* Price */}
        <div className="h-4 w-20 bg-background-tertiary rounded animate-pulse mb-1" />

        {/* Change */}
        <div className="h-3 w-12 bg-background-tertiary rounded animate-pulse mb-2" />

        {/* Sparkline */}
        <div className="h-7 w-full bg-background-tertiary rounded animate-pulse" />
      </div>
    </div>
  );
}

/**
 * StatCardSkeleton - For dashboard stat cards
 */
export function StatCardSkeleton() {
  return (
    <div className="bg-background-secondary border border-border-primary rounded-lg p-4">
      <div className="h-4 w-20 bg-background-tertiary rounded animate-pulse mb-2" />
      <div className="h-8 w-16 bg-background-tertiary rounded animate-pulse" />
    </div>
  );
}
