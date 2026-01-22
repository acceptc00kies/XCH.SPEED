# XCH Dashboard

A fast-loading Chia Asset Token (CAT) dashboard displaying real-time market data from [Dexie DEX](https://dexie.space).

## Features

- **Instant Load** - Server-side data fetching with ISR, no loading spinners on initial visit
- **Auto-refresh** - Data updates every 30 seconds without page reload
- **Search & Filter** - Filter tokens by name/symbol, sort by price/volume/change
- **Price Alerts** - Browser notifications when significant price changes occur (5%+ threshold)
- **Dark Mode** - Modern dark theme optimized for extended viewing

## Tech Stack

- [Next.js 14+](https://nextjs.org/) with App Router
- [TypeScript](https://www.typescriptlang.org/) (strict mode)
- [Tailwind CSS](https://tailwindcss.com/)
- React Server Components for fast initial load
- ISR (Incremental Static Regeneration) for optimal caching

## Data Sources

- Token metadata: `https://api.dexie.space/v1/tokens`
- Market data: `https://api.dexie.space/v1/markets`
- XCH/USD price: CoinGecko API with fallback

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository (if applicable)
cd xch-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Project Structure

```
xch-dashboard/
├── app/                    # Next.js App Router
│   ├── api/dashboard/      # API route for client polling
│   ├── layout.tsx          # Root layout with dark theme
│   ├── page.tsx            # Main dashboard (server component)
│   └── globals.css         # Tailwind + custom styles
├── components/             # React components
│   ├── Dashboard.tsx       # Main client dashboard
│   ├── TokenTable.tsx      # Token list table
│   ├── TokenRow.tsx        # Individual token row
│   ├── SearchBar.tsx       # Search input
│   ├── SortControls.tsx    # Sort dropdown
│   └── ...                 # Other components
├── hooks/                  # Custom React hooks
│   ├── usePolling.ts       # Data polling logic
│   ├── useAlerts.ts        # Browser notifications
│   ├── useSearch.ts        # Search filtering
│   └── useSort.ts          # Sort logic
├── lib/                    # Utility functions
│   ├── dexie-api.ts        # Dexie API client
│   ├── xch-price.ts        # XCH/USD price fetcher
│   ├── transform.ts        # Data transformation
│   └── data-fetcher.ts     # Aggregated data fetching
├── contracts/              # TypeScript interfaces
│   └── types.ts            # All type definitions
└── docs/                   # Documentation
    ├── SCOPE.md            # Project scope
    └── ARCHITECTURE.md     # Architecture details
```

## Performance

The dashboard is optimized for fast loading:

| Metric | Target | Implementation |
|--------|--------|----------------|
| Initial Load | < 1s | ISR with 30s revalidation |
| Data Freshness | 30s | Client-side polling |
| Bundle Size | Minimal | Server Components, tree shaking |

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically

The project includes all necessary configuration for Vercel deployment.

### Self-hosted

```bash
npm run build
npm start
```

Ensure your hosting environment supports Next.js server-side rendering.

## API Reference

### GET /api/dashboard

Returns fresh dashboard data for client-side polling.

**Response:**
```json
{
  "success": true,
  "data": {
    "tokens": [...],
    "xchPriceUsd": 25.00,
    "fetchedAt": "2024-01-01T00:00:00.000Z",
    "isStale": false
  }
}
```

## License

MIT

## Acknowledgments

- [Dexie.space](https://dexie.space) for providing the API
- [CoinGecko](https://coingecko.com) for XCH/USD pricing
