/**
 * DEX Links Module
 *
 * Generates trade links for various DEX platforms.
 *
 * @module lib/dex-links
 */

import { DexTradeLink, DexPlatform, DashboardToken } from '@/contracts/types';

/**
 * Dexie base URLs
 */
const DEXIE_BASE_URL = 'https://dexie.space';

/**
 * TibetSwap base URLs
 */
const TIBETSWAP_BASE_URL = 'https://tibetswap.io';

/**
 * Generate Dexie swap link for a token
 *
 * @param token - The token to generate link for
 * @returns DexTradeLink for Dexie swap
 */
export function getDexieSwapLink(token: DashboardToken): DexTradeLink {
  // Dexie uses token symbol for trading pairs
  const url = `${DEXIE_BASE_URL}/offers/${token.symbol}/XCH`;

  return {
    platform: 'dexie',
    url,
    type: 'swap',
  };
}

/**
 * Generate Dexie liquidity link for a token
 *
 * @param token - The token to generate link for
 * @returns DexTradeLink for Dexie liquidity
 */
export function getDexieLiquidityLink(token: DashboardToken): DexTradeLink {
  const url = `${DEXIE_BASE_URL}/liquidity/${token.symbol}/XCH`;

  return {
    platform: 'dexie',
    url,
    type: 'liquidity',
  };
}

/**
 * Generate TibetSwap swap link for a token
 *
 * @param token - The token to generate link for
 * @returns DexTradeLink for TibetSwap swap
 */
export function getTibetSwapLink(token: DashboardToken): DexTradeLink {
  // TibetSwap uses asset IDs for trading
  const url = `${TIBETSWAP_BASE_URL}/swap?from=xch&to=${token.id}`;

  return {
    platform: 'tibetswap',
    url,
    type: 'swap',
  };
}

/**
 * Generate TibetSwap liquidity link for a token
 *
 * @param token - The token to generate link for
 * @returns DexTradeLink for TibetSwap liquidity
 */
export function getTibetSwapLiquidityLink(token: DashboardToken): DexTradeLink {
  const url = `${TIBETSWAP_BASE_URL}/liquidity?asset=${token.id}`;

  return {
    platform: 'tibetswap',
    url,
    type: 'liquidity',
  };
}

/**
 * Get all trade links for a token
 *
 * @param token - The token to generate links for
 * @returns Array of all available trade links
 */
export function getAllTradeLinks(token: DashboardToken): DexTradeLink[] {
  return [
    getDexieSwapLink(token),
    getDexieLiquidityLink(token),
    getTibetSwapLink(token),
    getTibetSwapLiquidityLink(token),
  ];
}

/**
 * Get swap links only for a token
 *
 * @param token - The token to generate links for
 * @returns Array of swap trade links
 */
export function getSwapLinks(token: DashboardToken): DexTradeLink[] {
  return [getDexieSwapLink(token), getTibetSwapLink(token)];
}

/**
 * Get liquidity links only for a token
 *
 * @param token - The token to generate links for
 * @returns Array of liquidity trade links
 */
export function getLiquidityLinks(token: DashboardToken): DexTradeLink[] {
  return [getDexieLiquidityLink(token), getTibetSwapLiquidityLink(token)];
}

/**
 * Get links filtered by platform
 *
 * @param token - The token to generate links for
 * @param platform - The DEX platform to filter by
 * @returns Array of trade links for the specified platform
 */
export function getLinksByPlatform(
  token: DashboardToken,
  platform: DexPlatform
): DexTradeLink[] {
  const allLinks = getAllTradeLinks(token);
  return allLinks.filter((link) => link.platform === platform);
}

/**
 * Get display name for a DEX platform
 *
 * @param platform - The platform to get name for
 * @returns Human-readable platform name
 */
export function getPlatformDisplayName(platform: DexPlatform): string {
  switch (platform) {
    case 'dexie':
      return 'Dexie.space';
    case 'tibetswap':
      return 'TibetSwap';
    default:
      return platform;
  }
}

/**
 * Get platform icon/logo URL
 *
 * @param platform - The platform to get icon for
 * @returns URL to platform icon
 */
export function getPlatformIconUrl(platform: DexPlatform): string {
  switch (platform) {
    case 'dexie':
      return 'https://dexie.space/favicon.ico';
    case 'tibetswap':
      return 'https://tibetswap.io/favicon.ico';
    default:
      return '';
  }
}

/**
 * Check if a platform supports a specific token
 * Currently all platforms support all CATs, but this can be extended
 *
 * @param token - The token to check
 * @param platform - The platform to check support for
 * @returns Whether the platform supports the token
 */
export function isPlatformSupported(
  _token: DashboardToken,
  _platform: DexPlatform
): boolean {
  // Currently all platforms support all CATs
  // This function can be extended to check for specific token support
  return true;
}
