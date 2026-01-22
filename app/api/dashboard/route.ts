/**
 * Dashboard API Route
 *
 * Provides fresh data for client-side polling.
 * Bypasses ISR cache to always return latest data.
 */

import { NextResponse } from 'next/server';
import { fetchDashboardData } from '@/lib/data-fetcher';
import { DashboardApiResponse } from '@/contracts/types';

// Disable caching for this route - always fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(): Promise<NextResponse<DashboardApiResponse>> {
  try {
    const result = await fetchDashboardData();

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: result.error.message,
      },
      { status: 500 }
    );
  } catch (error) {
    console.error('Dashboard API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
