# XCH Token Dashboard - Scope Document

## Project Overview
A fast-loading Chia Asset Token (CAT) dashboard that displays real-time market data from Dexie DEX.

## User Stories

### US-001: Instant Dashboard Load
**As a** user visiting the dashboard
**I want** to see token data immediately on page load
**So that** I don't have to wait for loading spinners
**Acceptance Criteria:**
- Page renders with data in under 1 second
- No loading skeleton visible on initial visit
- Data is server-rendered (SSR/ISR)

### US-002: Live Data Updates
**As a** user monitoring tokens
**I want** prices to update automatically every 30 seconds
**So that** I see current market conditions without refreshing
**Acceptance Criteria:**
- Data polls every 30 seconds
- Updates happen without full page reload
- Visual indicator shows last update time

### US-003: Token Search & Filter
**As a** user looking for specific tokens
**I want** to search by name/symbol and sort by metrics
**So that** I can quickly find tokens of interest
**Acceptance Criteria:**
- Search filters tokens by name or symbol (case-insensitive)
- Sort options: Price, 24h Change, 7d Change, Volume
- Sort direction toggle (asc/desc)

### US-004: Price Alerts
**As a** trader
**I want** browser notifications for significant price changes
**So that** I can react to market movements
**Acceptance Criteria:**
- Can enable/disable notifications per token
- Notification triggers on >5% change since last check
- Works via browser Notification API

### US-005: Dark Theme
**As a** user
**I want** a modern dark theme
**So that** the dashboard is comfortable to view
**Acceptance Criteria:**
- Dark background with contrasting text
- Green for positive changes, red for negative
- Consistent with modern crypto dashboard aesthetics

## Data Requirements

### Token Data (from /v1/tokens)
| Field | Source | Required |
|-------|--------|----------|
| id | tokens.id | Yes |
| code | tokens.code | Yes |
| name | tokens.name | Yes |
| icon | tokens.icon | Yes |
| denom | tokens.denom | Yes (for calculations) |

### Market Data (from /v1/markets)
| Field | Source | Required |
|-------|--------|----------|
| price_xch | markets.xch[].prices.last.price | Yes |
| change_24h | markets.xch[].prices.last.change.daily | Yes |
| change_7d | markets.xch[].prices.last.change.weekly | Yes |
| volume_24h | markets.xch[].volume.xch.daily | Yes |
| high_24h | markets.xch[].prices.high.daily | Optional |
| low_24h | markets.xch[].prices.low.daily | Optional |

### XCH/USD Price
- Source: Will use CoinGecko or hardcoded fallback
- Needed for USD price display

## Technical Constraints

- Next.js 14+ with App Router
- TypeScript strict mode
- Tailwind CSS for styling
- ISR with 30-second revalidation
- Client-side polling for live updates
- No external state management (React state sufficient)

## Out of Scope
- User authentication
- Historical charts
- Order placement
- Portfolio tracking
- Mobile app

## Success Metrics
- Initial load < 1 second (measured via Lighthouse)
- All acceptance criteria pass manual testing
- No TypeScript errors
- Responsive on desktop and mobile
