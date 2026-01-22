/**
 * Main Dashboard Page
 *
 * Server Component that fetches initial data and renders the dashboard.
 * Uses ISR for fast subsequent loads.
 */

import { fetchDashboardDataSafe } from '@/lib/data-fetcher';
import { Dashboard } from '@/components/Dashboard';

// ISR: Revalidate every 30 seconds
export const revalidate = 30;

// Force dynamic rendering to ensure fresh data on each request
// Comment this out if you want static generation with ISR
// export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch data server-side
  const initialData = await fetchDashboardDataSafe();

  return <Dashboard initialData={initialData} />;
}
