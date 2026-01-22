/**
 * XCH Dashboard - Type Contracts
 *
 * All interfaces defining data shapes across the application.
 * This is the single source of truth for TypeScript types.
 */

// =============================================================================
// API Response Types (External - from Dexie API)
// =============================================================================

/**
 * Raw token response from /v1/tokens
 */
export interface DexieTokenResponse {
  success: boolean;
  tokens: DexieToken[];
}

export interface DexieToken {
  id: string;
  code: string;
  name: string;
  denom: number;
  icon: string;
}

/**
 * Raw markets response from /v1/markets
 */
export interface DexieMarketsResponse {
  success: boolean;
  markets: {
    xch: DexieMarket[];
  };
}

export interface DexieMarket {
  id: string;
  name: string;
  code: string;
  pair_id: string;
  volume: {
    xch: VolumeData;
    [tokenId: string]: VolumeData;
  };
  total_offered: {
    xch: number;
    [tokenId: string]: number;
  };
  prices: MarketPrices;
  change: ChangeData;
  incentives: boolean;
  liquidity: {
    ask: number[];
    bid: number[];
  };
}

export interface VolumeData {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

export interface ChangeData {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

export interface MarketPrices {
  buy: PriceDepth[];
  sell: PriceDepth[];
  high: { daily: number };
  low: { daily: number };
  last: {
    price: number;
    date: string;
    change: ChangeData;
  };
  avg: PriceDepth[];
}

export interface PriceDepth {
  depth: number;
  price: number;
  change: ChangeData;
}

// =============================================================================
// Application Types (Internal - transformed for UI)
// =============================================================================

/**
 * Unified token data for display in the dashboard
 */
export interface DashboardToken {
  /** Unique token identifier */
  id: string;
  /** Token symbol (e.g., "SBX", "DBX") */
  symbol: string;
  /** Full token name */
  name: string;
  /** URL to token icon */
  iconUrl: string;
  /** Price in XCH */
  priceXch: number;
  /** Price in USD (calculated from XCH price) */
  priceUsd: number;
  /** 24-hour price change percentage */
  change24h: number;
  /** 7-day price change percentage */
  change7d: number;
  /** 24-hour trading volume in XCH */
  volume24hXch: number;
  /** 24-hour trading volume in USD */
  volume24hUsd: number;
  /** 24-hour high price in XCH */
  high24h: number;
  /** 24-hour low price in XCH */
  low24h: number;
  /** Market pair ID for reference */
  pairId: string;
  /** Timestamp when this data was fetched */
  lastUpdated: string;
  /** Whether token has an active market (false = no trading data) */
  hasMarket?: boolean;
}

/**
 * Complete dashboard data payload
 */
export interface DashboardData {
  /** List of all tokens with market data */
  tokens: DashboardToken[];
  /** Current XCH price in USD */
  xchPriceUsd: number;
  /** ISO timestamp of when data was fetched */
  fetchedAt: string;
  /** Whether data is from cache (stale) */
  isStale: boolean;
}

// =============================================================================
// UI State Types
// =============================================================================

/**
 * Sort configuration for token table
 */
export interface SortConfig {
  field: SortField;
  direction: 'asc' | 'desc';
}

export type SortField =
  | 'name'
  | 'symbol'
  | 'priceXch'
  | 'priceUsd'
  | 'change24h'
  | 'change7d'
  | 'volume24hXch'
  | 'volume24hUsd';

/**
 * Filter configuration
 */
export interface FilterConfig {
  searchQuery: string;
}

/**
 * Price alert configuration
 */
export interface AlertConfig {
  /** Token IDs with alerts enabled */
  enabledTokens: Set<string>;
  /** Threshold percentage for triggering alert (default 5) */
  thresholdPercent: number;
}

/**
 * Price alert event data
 */
export interface PriceAlert {
  tokenId: string;
  tokenSymbol: string;
  tokenName: string;
  previousPrice: number;
  currentPrice: number;
  changePercent: number;
  direction: 'up' | 'down';
  timestamp: string;
}

// =============================================================================
// API Route Types
// =============================================================================

/**
 * Response from /api/dashboard route
 */
export interface DashboardApiResponse {
  success: boolean;
  data?: DashboardData;
  error?: string;
}

// =============================================================================
// Hook Return Types
// =============================================================================

/**
 * Return type for usePolling hook
 */
export interface UsePollingResult {
  data: DashboardData | null;
  isLoading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

/**
 * Return type for useAlerts hook
 */
export interface UseAlertsResult {
  isSupported: boolean;
  permission: NotificationPermission | 'unsupported';
  enabledTokens: Set<string>;
  requestPermission: () => Promise<boolean>;
  toggleAlert: (tokenId: string) => void;
  checkForAlerts: (prevTokens: DashboardToken[], newTokens: DashboardToken[]) => void;
}

/**
 * Return type for useSearch hook
 */
export interface UseSearchResult {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredTokens: DashboardToken[];
}

/**
 * Return type for useSort hook
 */
export interface UseSortResult {
  sortConfig: SortConfig;
  setSortField: (field: SortField) => void;
  toggleDirection: () => void;
  sortedTokens: DashboardToken[];
}

// =============================================================================
// Utility Types
// =============================================================================

/**
 * Result type for operations that can fail
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Async result type
 */
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

// =============================================================================
// Chart Types
// =============================================================================

/**
 * Supported timeframes for chart display
 */
export type ChartTimeframe = '1D' | '7D' | '1M' | '1Y' | 'ALL';

/**
 * Single data point for price charts
 */
export interface ChartDataPoint {
  /** ISO timestamp of the data point */
  timestamp: string;
  /** Price at this timestamp */
  price: number;
  /** Optional volume at this timestamp */
  volume?: number;
}

/**
 * Complete chart data for a token
 */
export interface ChartData {
  /** Token identifier */
  tokenId: string;
  /** Selected timeframe for this data */
  timeframe: ChartTimeframe;
  /** Array of price/volume data points */
  dataPoints: ChartDataPoint[];
  /** When this data was fetched */
  fetchedAt: string;
}

// =============================================================================
// Token Detail Types
// =============================================================================

/**
 * Extended token information for detail view
 */
export interface TokenDetail extends DashboardToken {
  /** Token description if available */
  description?: string;
  /** Token website URL if available */
  website?: string;
  /** Liquidity information */
  liquidity: {
    /** Total liquidity in XCH */
    totalXch: number;
    /** Total liquidity in USD */
    totalUsd: number;
  };
  /** Market capitalization in USD if available */
  marketCap?: number;
}

// =============================================================================
// Watchlist Types
// =============================================================================

/**
 * User watchlist configuration (persisted to localStorage)
 */
export interface WatchlistConfig {
  /** Array of token IDs in the watchlist */
  tokenIds: string[];
  /** Last time watchlist was modified */
  lastUpdated: string;
}

// =============================================================================
// Pagination Types
// =============================================================================

/**
 * Pagination state for token lists
 */
export interface PaginationState {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of items */
  totalItems: number;
  /** Total number of pages */
  totalPages: number;
}

// =============================================================================
// Advanced Filter Types
// =============================================================================

/**
 * Advanced filter configuration for token search
 */
export interface AdvancedFilters {
  /** Filter by price range (in XCH) */
  priceRange?: {
    min: number;
    max: number;
  };
  /** Filter by 24h volume range (in XCH) */
  volumeRange?: {
    min: number;
    max: number;
  };
  /** Filter by 24h change percentage range */
  changeRange?: {
    min: number;
    max: number;
  };
  /** Only show tokens in watchlist */
  onlyWatchlist?: boolean;
}

// =============================================================================
// DEX Link Types
// =============================================================================

/**
 * Supported DEX platforms
 */
export type DexPlatform = 'dexie' | 'tibetswap';

/**
 * Trade link to external DEX
 */
export interface DexTradeLink {
  /** DEX platform */
  platform: DexPlatform;
  /** Full URL to trading page */
  url: string;
  /** Type of trading action */
  type: 'swap' | 'liquidity';
}

// =============================================================================
// View Mode Types
// =============================================================================

/**
 * Display mode for token list
 */
export type ViewMode = 'table' | 'card' | 'compact';

// =============================================================================
// Hook Return Types (Extended)
// =============================================================================

/**
 * Return type for useWatchlist hook
 */
export interface UseWatchlistResult {
  /** Array of watched token IDs */
  watchlist: string[];
  /** Check if token is in watchlist */
  isWatched: (tokenId: string) => boolean;
  /** Add token to watchlist */
  addToWatchlist: (tokenId: string) => void;
  /** Remove token from watchlist */
  removeFromWatchlist: (tokenId: string) => void;
  /** Toggle token in watchlist */
  toggleWatchlist: (tokenId: string) => void;
  /** Clear entire watchlist */
  clearWatchlist: () => void;
}

/**
 * Return type for useAdvancedFilters hook
 */
export interface UseAdvancedFiltersResult {
  /** Current filter configuration */
  filters: AdvancedFilters;
  /** Set price range filter */
  setPriceRange: (min: number, max: number) => void;
  /** Set volume range filter */
  setVolumeRange: (min: number, max: number) => void;
  /** Set change range filter */
  setChangeRange: (min: number, max: number) => void;
  /** Set watchlist filter */
  setOnlyWatchlist: (enabled: boolean) => void;
  /** Clear all filters */
  clearFilters: () => void;
  /** Apply filters to token array */
  applyFilters: (tokens: DashboardToken[], watchlist: string[]) => DashboardToken[];
  /** Check if any filters are active */
  hasActiveFilters: boolean;
}

/**
 * Return type for usePagination hook
 */
export interface UsePaginationResult {
  /** Current pagination state */
  pagination: PaginationState;
  /** Go to specific page */
  goToPage: (page: number) => void;
  /** Go to next page */
  nextPage: () => void;
  /** Go to previous page */
  prevPage: () => void;
  /** Change page size */
  setPageSize: (size: number) => void;
  /** Get paginated slice of items */
  paginateItems: <T>(items: T[]) => T[];
  /** Check if can go to previous page */
  canGoPrev: boolean;
  /** Check if can go to next page */
  canGoNext: boolean;
}

/**
 * Return type for useChartData hook
 */
export interface UseChartDataResult {
  /** Chart data if loaded */
  data: ChartData | null;
  /** Loading state */
  isLoading: boolean;
  /** Error if fetch failed */
  error: Error | null;
  /** Currently selected timeframe */
  timeframe: ChartTimeframe;
  /** Change timeframe */
  setTimeframe: (tf: ChartTimeframe) => void;
  /** Force refresh chart data */
  refresh: () => void;
}
