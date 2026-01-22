# XCH Token Dashboard - Architecture Document

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Application                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Page (SSR)    │  │  Components     │  │   Hooks     │ │
│  │                 │  │  - TokenTable   │  │  - usePolling│ │
│  │  Server fetch   │  │  - TokenRow     │  │  - useAlerts │ │
│  │  initial data   │  │  - SearchBar    │  │  - useSort   │ │
│  └────────┬────────┘  │  - SortControls │  └─────────────┘ │
│           │           └─────────────────┘                   │
│           ▼                                                 │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    API Layer (lib/)                     ││
│  │  ┌───────────────┐  ┌───────────────┐  ┌─────────────┐ ││
│  │  │ dexie-api.ts  │  │ xch-price.ts  │  │ transform.ts│ ││
│  │  │ fetchTokens() │  │ fetchXchUsd() │  │ mergeData() │ ││
│  │  │ fetchMarkets()│  └───────────────┘  └─────────────┘ ││
│  │  └───────────────┘                                      ││
│  └─────────────────────────────────────────────────────────┘│
│                            │                                │
└────────────────────────────┼────────────────────────────────┘
                             │
                             ▼
         ┌───────────────────────────────────────┐
         │           External APIs               │
         │  ┌─────────────┐  ┌───────────────┐  │
         │  │ Dexie API   │  │ Price Oracle  │  │
         │  │ /v1/tokens  │  │ (CoinGecko)   │  │
         │  │ /v1/markets │  └───────────────┘  │
         │  └─────────────┘                     │
         └───────────────────────────────────────┘
```

## Module Dependency Graph

```
contracts/types.ts (no deps)
        │
        ├──► lib/dexie-api.ts
        │           │
        ├──► lib/xch-price.ts
        │           │
        └──► lib/transform.ts ◄──┘
                    │
                    ▼
            lib/data-fetcher.ts (aggregates all)
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
    hooks/      components/   app/page.tsx
```

## Data Flow

### Initial Load (Server-Side)
1. User requests page
2. Next.js server executes `page.tsx` server component
3. `fetchDashboardData()` called server-side
4. Parallel fetch: tokens + markets + XCH price
5. Data transformed and merged
6. HTML rendered with data, sent to client
7. Client hydrates, starts polling interval

### Live Updates (Client-Side)
1. `usePolling` hook triggers every 30 seconds
2. Fetch to `/api/dashboard` route (or direct API call)
3. New data merged with React state
4. UI updates without full re-render
5. Price alerts checked against previous state

## File Structure

```
xch-dashboard/
├── app/
│   ├── layout.tsx          # Root layout with dark theme
│   ├── page.tsx            # Main dashboard (server component)
│   ├── globals.css         # Tailwind + custom styles
│   └── api/
│       └── dashboard/
│           └── route.ts    # API route for client polling
├── components/
│   ├── TokenTable.tsx      # Main table container
│   ├── TokenRow.tsx        # Individual token row
│   ├── SearchBar.tsx       # Search input
│   ├── SortControls.tsx    # Sort dropdown + direction
│   ├── LastUpdated.tsx     # Update timestamp display
│   └── AlertToggle.tsx     # Notification toggle button
├── hooks/
│   ├── usePolling.ts       # Data polling logic
│   ├── useAlerts.ts        # Browser notification logic
│   ├── useSearch.ts        # Search filtering logic
│   └── useSort.ts          # Sort logic
├── lib/
│   ├── dexie-api.ts        # Dexie API client
│   ├── xch-price.ts        # XCH/USD price fetcher
│   ├── transform.ts        # Data transformation
│   └── data-fetcher.ts     # Aggregated data fetching
├── contracts/
│   └── types.ts            # All TypeScript interfaces
├── docs/
│   ├── SCOPE.md
│   └── ARCHITECTURE.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── HANDOFF.yaml
```

## Key Design Decisions

### 1. Server Components for Initial Load
- Main page is a React Server Component
- Data fetched at request time with ISR (30s revalidation)
- No client-side loading state needed for initial visit

### 2. Client-Side Polling for Updates
- `usePolling` hook manages interval
- Calls API route to avoid CORS issues
- Compares with previous state for alerts

### 3. No External State Management
- React useState sufficient for this scope
- Props drilling acceptable (max 2 levels)
- Context only if needed for alerts

### 4. Tailwind for Styling
- Utility-first for rapid development
- Dark theme via CSS variables
- Responsive grid for table

## Performance Strategy

| Technique | Implementation |
|-----------|----------------|
| ISR | `revalidate: 30` in fetch options |
| Parallel Fetching | `Promise.all` for API calls |
| Minimal JS | Server components where possible |
| Image Optimization | Next.js `<Image>` for token icons |
| Memoization | `useMemo` for filtered/sorted lists |

## Error Handling

- API failures: Show cached data with "stale" indicator
- Network errors: Retry with exponential backoff
- Invalid data: Filter out malformed tokens
- All errors logged to console (no error service in MVP)
