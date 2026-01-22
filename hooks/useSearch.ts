'use client';

/**
 * useSearch Hook
 *
 * Manages search/filter state for token list.
 */

import { useState, useMemo, useCallback } from 'react';
import { DashboardToken, UseSearchResult } from '@/contracts/types';

export function useSearch(tokens: DashboardToken[]): UseSearchResult {
  const [searchQuery, setSearchQuery] = useState('');

  // Memoized filtered tokens
  const filteredTokens = useMemo(() => {
    if (!searchQuery.trim()) {
      return tokens;
    }

    const query = searchQuery.toLowerCase().trim();

    return tokens.filter((token) => {
      return (
        token.name.toLowerCase().includes(query) ||
        token.symbol.toLowerCase().includes(query)
      );
    });
  }, [tokens, searchQuery]);

  // Debounced setter (immediate for now, can add debounce if needed)
  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return {
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    filteredTokens,
  };
}
