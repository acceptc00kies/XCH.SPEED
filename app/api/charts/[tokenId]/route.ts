/**
 * Chart Data API Route
 *
 * GET /api/charts/[tokenId]?timeframe=1D|7D|1M|1Y|ALL
 *
 * Returns chart data for a specific token.
 * Note: Since we build chart data client-side from polling snapshots,
 * this endpoint primarily serves as an API contract placeholder
 * and returns minimal server-side data.
 */

import { NextRequest, NextResponse } from 'next/server';
import { ChartTimeframe, ChartData } from '@/contracts/types';
import { fetchMarkets } from '@/lib/dexie-api';

/**
 * Valid timeframe values
 */
const VALID_TIMEFRAMES: ChartTimeframe[] = ['1D', '7D', '1M', '1Y', 'ALL'];

/**
 * Validate timeframe parameter
 */
function isValidTimeframe(tf: string | null): tf is ChartTimeframe {
  return tf !== null && VALID_TIMEFRAMES.includes(tf as ChartTimeframe);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  try {
    const { tokenId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const timeframe = searchParams.get('timeframe') || '1D';

    // Validate timeframe
    if (!isValidTimeframe(timeframe)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid timeframe. Must be one of: ${VALID_TIMEFRAMES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate tokenId
    if (!tokenId || tokenId.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid token ID',
        },
        { status: 400 }
      );
    }

    // Fetch current market data to get latest price
    const marketsResult = await fetchMarkets();

    if (!marketsResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch market data',
        },
        { status: 500 }
      );
    }

    // Find the specific token's market data
    const market = marketsResult.data.find((m) => m.id === tokenId);

    if (!market) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token not found',
        },
        { status: 404 }
      );
    }

    // Build minimal chart data with current price
    // Full historical data is built client-side from polling snapshots
    const now = new Date();
    const chartData: ChartData = {
      tokenId,
      timeframe,
      dataPoints: [
        {
          timestamp: now.toISOString(),
          price: market.prices?.last?.price ?? 0,
          volume: market.volume?.xch?.daily ?? 0,
        },
      ],
      fetchedAt: now.toISOString(),
    };

    // Add high/low points for context if available
    if (market.prices?.high?.daily && market.prices?.low?.daily) {
      // Add synthetic points for high and low
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const halfDayAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

      chartData.dataPoints.unshift(
        {
          timestamp: dayAgo.toISOString(),
          price: market.prices.low.daily,
        },
        {
          timestamp: halfDayAgo.toISOString(),
          price: market.prices.high.daily,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: chartData,
    });
  } catch (error) {
    console.error('Chart API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
