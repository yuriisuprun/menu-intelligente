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
2. Copy `.env.example` to `.env.local` and fill values.
3. Apply DB SQL files in this order:
   - [supabase/schema.sql](/C:/Users/yurii/MyProjects/tavola-ai/supabase/schema.sql)
   - [supabase/patch_add_dishes_category.sql](/C:/Users/yurii/MyProjects/tavola-ai/supabase/patch_add_dishes_category.sql)
   - [supabase/local_seed.sql](/C:/Users/yurii/MyProjects/tavola-ai/supabase/local_seed.sql) (optional demo data)
4. Run:
   - `npm run dev`

Detailed guide: [docs/LOCAL_SETUP.md](/C:/Users/yurii/MyProjects/tavola-ai/docs/LOCAL_SETUP.md)

## Docker (Local DB/API)

Use Docker Compose to run Postgres + PostgREST locally:

1. Copy [.env.docker.example](/C:/Users/yurii/MyProjects/tavola-ai/.env.docker.example) to `.env.docker`
2. Generate local keys:
   - `npm run docker:keys -- "<JWT_SECRET_FROM_.env.docker>"`
3. Start stack:
   - `npm run docker:up`
4. Configure app env (`.env.local`) to use:
   - `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321`
   - generated anon/service keys
   - or run `npm run docker:sync-env`

Full guide: [docs/DOCKER_SETUP.md](/C:/Users/yurii/MyProjects/tavola-ai/docs/DOCKER_SETUP.md)

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
