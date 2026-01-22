/**
 * Token Offers API Route
 *
 * Fetches recent offers (completed and active) for a specific token.
 * Returns trade history with prices and timestamps.
 */

import { NextRequest, NextResponse } from 'next/server';

interface DexieOffer {
  id: string;
  trade_id: string;
  status: number;
  price: number;
  date_found: string;
  date_completed: string | null;
  date_pending: string | null;
  offered: Array<{
    id: string;
    code: string;
    name: string;
    amount: number;
  }>;
  requested: Array<{
    id: string;
    code: string;
    name: string;
    amount: number;
  }>;
  known_taker?: {
    name: string;
    source: string;
  };
  fees: number;
}

interface OfferHistoryItem {
  id: string;
  tradeId: string;
  type: 'buy' | 'sell';
  status: 'completed' | 'active' | 'pending' | 'cancelled';
  price: number;
  amountToken: number;
  amountXch: number;
  tokenSymbol: string;
  dateCreated: string;
  dateCompleted: string | null;
  taker: string | null;
}

const DEXIE_API = 'https://api.dexie.space/v1';

async function fetchOffers(tokenId: string, status: number, pageSize: number): Promise<DexieOffer[]> {
  // Try both directions: token offered and token requested
  const [offeredRes, requestedRes] = await Promise.all([
    fetch(`${DEXIE_API}/offers?offered=${tokenId}&requested=xch&status=${status}&page_size=${pageSize}`, {
      next: { revalidate: 30 },
    }),
    fetch(`${DEXIE_API}/offers?requested=${tokenId}&offered=xch&status=${status}&page_size=${pageSize}`, {
      next: { revalidate: 30 },
    }),
  ]);

  const [offeredData, requestedData] = await Promise.all([
    offeredRes.ok ? offeredRes.json() : { offers: [] },
    requestedRes.ok ? requestedRes.json() : { offers: [] },
  ]);

  return [...(offeredData.offers || []), ...(requestedData.offers || [])];
}

function transformOffer(offer: DexieOffer, tokenId: string): OfferHistoryItem {
  // Determine if this is a buy or sell from token perspective
  const isTokenOffered = offer.offered.some(o => o.id === tokenId);

  const tokenAsset = isTokenOffered
    ? offer.offered.find(o => o.id === tokenId)
    : offer.requested.find(o => o.id === tokenId);

  const xchAsset = isTokenOffered
    ? offer.requested.find(o => o.id === 'xch')
    : offer.offered.find(o => o.id === 'xch');

  const statusMap: Record<number, OfferHistoryItem['status']> = {
    0: 'active',
    1: 'pending',
    2: 'cancelled',
    3: 'cancelled',
    4: 'completed',
  };

  return {
    id: offer.id,
    tradeId: offer.trade_id,
    type: isTokenOffered ? 'sell' : 'buy',
    status: statusMap[offer.status] || 'active',
    price: offer.price || 0,
    amountToken: tokenAsset?.amount || 0,
    amountXch: xchAsset?.amount || 0,
    tokenSymbol: tokenAsset?.code || '',
    dateCreated: offer.date_found,
    dateCompleted: offer.date_completed,
    taker: offer.known_taker?.name || null,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  try {
    const { tokenId } = await params;

    if (!tokenId) {
      return NextResponse.json(
        { success: false, error: 'Token ID required' },
        { status: 400 }
      );
    }

    // Fetch completed trades and active offers
    const [completedOffers, activeOffers] = await Promise.all([
      fetchOffers(tokenId, 4, 50), // status 4 = completed
      fetchOffers(tokenId, 0, 20), // status 0 = active
    ]);

    // Transform and combine
    const completed = completedOffers.map(o => transformOffer(o, tokenId));
    const active = activeOffers.map(o => transformOffer(o, tokenId));

    // Sort by date (most recent first)
    const allOffers = [...completed, ...active].sort((a, b) => {
      const dateA = new Date(a.dateCompleted || a.dateCreated).getTime();
      const dateB = new Date(b.dateCompleted || b.dateCreated).getTime();
      return dateB - dateA;
    });

    // Calculate last trade price from most recent completed trade
    const lastTrade = completed.find(o => o.status === 'completed' && o.price > 0);
    const lastTradePrice = lastTrade ? {
      price: lastTrade.price,
      priceXch: lastTrade.amountXch / lastTrade.amountToken,
      date: lastTrade.dateCompleted,
    } : null;

    return NextResponse.json({
      success: true,
      data: {
        offers: allOffers.slice(0, 50), // Limit to 50 most recent
        completedCount: completed.length,
        activeCount: active.length,
        lastTradePrice,
      },
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}
