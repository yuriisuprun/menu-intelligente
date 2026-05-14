# SaaS Architecture Blueprint

## 1) System Architecture

Tavola AI runs as a multi-tenant platform with 3 core surfaces:

1. Guest surface (QR flow): `app/menu/[slug]/*`
2. Staff surface (operations): `app/dashboard/*`
3. Platform control surface (auth, onboarding, billing): `app/onboarding`, auth/billing APIs

Data and identity are centralized in Supabase:

- Postgres for tenant, menu, order, payment, analytics
- Supabase Auth for staff identity
- RLS for strict tenant isolation

AI services:

- Translation API for menu localization
- Waiter assistant API for multilingual service augmentation
- AI event logging for cost/performance observability

Payments:

- Stripe payment intents per order
- webhook reconciliation into `payments` and `orders`

## 2) Database Schema (Production)

Implemented in [supabase/schema.sql](/C:/Users/yurii/MyProjects/tavola-ai/supabase/schema.sql).

Core entities:

- Tenancy: `tenants`, `tenant_branding`, `tenant_subscriptions`, `restaurant_users`
- Dining model: `areas`, `tables`, `qr_codes`
- Menu: `menu_categories`, `dishes`
- Guest ordering: `guest_sessions`, `orders`, `order_items`, `payments`
- AI and analytics: `ai_events`, `guest_events`, `daily_metrics`

Key production characteristics:

- UUID primary keys, scoped foreign keys, strategic indexes
- enum types for statuses/roles
- `updated_at` triggers
- RLS across all tenant tables
- helper function `is_tenant_member(tenant_id)` for policy reuse

## 3) Frontend Component Structure

Current + target structure:

```txt
app/
  page.tsx                         # QR ordering entry system landing
  onboarding/page.tsx              # onboarding wizard shell
  menu/[slug]/page.tsx             # guest menu
  menu/[slug]/dish/[id]/page.tsx   # dish detail
  menu/[slug]/recommendations/     # AI upsell/recommendations
  dashboard/
    page.tsx                       # operational overview
    menu/page.tsx                  # menu management
    qr/page.tsx                    # QR management
    analytics/page.tsx             # revenue and guest analytics
    billing/page.tsx               # billing and plan controls
components/
  menu-page-client.tsx
  dish-card.tsx
  assistant-modal.tsx
  language-switcher.tsx
  dashboard-shell.tsx
  ui/button.tsx
```

Recommended next components:

- `components/dashboard/orders-table.tsx`
- `components/dashboard/revenue-kpis.tsx`
- `components/dashboard/table-status-board.tsx`
- `components/onboarding/stepper.tsx`
- `components/guest/checkout-sheet.tsx`

## 4) API Structure

### Existing

- `POST /api/ai/assistant`
- `POST /api/ai/translate`
- `GET|POST /api/menu/sync`

### Required production APIs

- Auth/Profile
  - `GET /api/auth/me`
  - `POST /api/auth/invite`
- Onboarding
  - `POST /api/onboarding/tenant`
  - `POST /api/onboarding/menu`
  - `POST /api/onboarding/qr`
- Guest session and ordering
  - `POST /api/guest/session/start`
  - `POST /api/orders`
  - `PATCH /api/orders/:id/status`
  - `POST /api/payments/intent`
  - `POST /api/payments/webhook` (Stripe)
- Analytics
  - `GET /api/analytics/overview`
  - `GET /api/analytics/revenue`
  - `GET /api/analytics/guest-experience`

API guardrails:

- zod request/response validation
- tenant scoping from authenticated staff membership
- rate limits on guest/AI endpoints
- idempotency keys for order/payment writes

## 5) Authentication Flow

Staff auth flow:

1. User signs in via Supabase Auth (email magic link or SSO).
2. Session token is issued.
3. App resolves membership from `restaurant_users`.
4. User is scoped to tenant permissions through RLS.
5. Dashboard/API requests enforce tenant-level authorization.

Guest flow:

1. Guest scans QR token.
2. Token resolves tenant + table.
3. `guest_sessions` row created.
4. Guest orders and pays without staff login.
5. Staff sees live order stream.

## 6) Onboarding Flow

Target onboarding sequence:

1. Business profile
   - restaurant name, city, country, timezone, service style
2. Menu setup
   - categories, dishes, pricing, allergens, pairings
3. Multilingual activation
   - target languages for tourism segments
4. QR deployment
   - area/table map, QR generation, print export
5. Payments + billing
   - Stripe connection, trial activation, plan selection
6. Go-live validation
   - test order, payment, kitchen notification, analytics check

Completion criteria:

- at least 1 category + 3 dishes
- at least 1 area + 1 table + QR code
- payment provider configured

## 7) Responsive UI System

Design intent: operational product, not marketing website.

- Mobile first:
  - guest order flow optimized for 360-430 px width
  - sticky cart, fixed checkout CTA, low cognitive load
- Tablet:
  - split menu/cart view
- Desktop:
  - dense dashboard with KPI + live order stream

UI constraints:

- predictable navigation patterns
- high contrast and readable typography
- no hero-style promotional framing for operational pages

## 8) Deployment Instructions

### Infrastructure

- Frontend/API runtime: Vercel (recommended) or self-hosted Node
- Database/Auth: Supabase project
- Payments: Stripe
- AI provider: OpenAI

### Steps

1. Provision Supabase and apply [supabase/schema.sql](/C:/Users/yurii/MyProjects/tavola-ai/supabase/schema.sql).
2. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
3. Deploy to Vercel with production env vars.
4. Configure Stripe webhook to `/api/payments/webhook`.
5. Seed a tenant and generate QR codes.
6. Run smoke tests:
   - guest scan -> order -> pay
   - dashboard order visibility
   - AI translation and assistant routes

## 9) Scalable SaaS Architecture

Scaling strategy:

- Vertical:
  - cache menu reads by tenant slug
  - move non-critical analytics to async jobs
- Horizontal:
  - stateless Next.js instances
  - queue worker for AI/billing/aggregation workloads
- Data:
  - partition high-volume events (`guest_events`, `ai_events`) by date
  - introduce read replicas for analytics-heavy tenants

Operational controls:

- per-tenant rate limits
- request tracing and structured logs
- SLO dashboards: API latency, payment success rate, order failure rate
- cost controls for AI tokens per tenant/plan

## 10) Domain Positioning Rules

Always position Tavola AI as:

`An AI-powered multilingual hospitality platform for modern restaurants.`

Never position Tavola AI as:

`Just another QR menu.`

Messaging emphasis:

- tourism-ready multilingual guest journeys
- premium dining service quality
- measurable guest experience uplift
- revenue optimization through AI-assisted discovery and upsell
