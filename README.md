# Tavola AI

An AI-powered multilingual hospitality platform for modern restaurants.

Tavola AI is not a "just QR menu" product. It is a multi-tenant SaaS system for tourism-heavy and premium dining environments where guest experience, operational speed, and revenue optimization are core requirements.

## Product Positioning

- AI-powered hospitality workflows (translation, recommendations, service assistant)
- Multilingual guest ordering and payment from QR sessions
- Premium dining experience support (pairings, storytelling, paced service)
- Revenue optimization (upsell tracking, ticket-size analytics, conversion events)

## Tech Stack

- Next.js 15 App Router + TypeScript
- Supabase (Postgres, Auth, RLS)
- Stripe payments
- Groq API (OpenAI-compatible)
- Tailwind CSS + Radix primitives

## Project Structure

```txt
app/
  api/
    ai/
      assistant/route.ts
      translate/route.ts
    menu/
      sync/route.ts
  dashboard/
  menu/[slug]/
  onboarding/
components/
lib/
supabase/schema.sql
docs/SAAS_ARCHITECTURE.md
```

## Quick Start

1. Install dependencies:
   - `npm install`
2. Create `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL=...`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
   - `SUPABASE_SERVICE_ROLE_KEY=...`
   - `GROQ_API_KEY=...`
   - `GROQ_MODEL=llama-3.1-8b-instant` (optional)
   - `NEXT_PUBLIC_TENANT_SLUG=...`
3. Apply DB schema from [supabase/schema.sql](/C:/Users/yurii/MyProjects/tavola-ai/supabase/schema.sql).
4. Run:
   - `npm run dev`

## Production Build

- `npm run build`
- `npm run start`

## Architecture and SaaS Blueprint

See [docs/SAAS_ARCHITECTURE.md](/C:/Users/yurii/MyProjects/tavola-ai/docs/SAAS_ARCHITECTURE.md) for:

- full application architecture
- database schema model
- frontend component architecture
- API architecture
- authentication flow
- onboarding flow
- responsive UI system
- scalable SaaS deployment architecture
