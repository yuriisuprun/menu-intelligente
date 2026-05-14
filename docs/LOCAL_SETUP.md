# Local Setup Runbook

## 1) Prerequisites

- Node.js 20+
- npm
- Supabase project
- Groq API key

## 2) Install dependencies

```bash
npm install
```

## 3) Configure environment

Create `.env.local` from `.env.example` and fill values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_TENANT_SLUG`
- `GROQ_API_KEY`
- `GROQ_MODEL` (optional, default `llama-3.1-8b-instant`)
- `NEXT_PUBLIC_APP_URL` (default `http://localhost:3000`)

## 4) Initialize database

In Supabase SQL editor, run:

1. `supabase/schema.sql`
2. `supabase/patch_add_dishes_category.sql` (needed for compatibility with current app code)
3. `supabase/local_seed.sql` (optional demo data)

Important:
- In `supabase/local_seed.sql`, set tenant slug to match `NEXT_PUBLIC_TENANT_SLUG`.

## 5) Start the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## 6) Use the system

- Landing + routing entry: `/`
- Guest ordering surface: `/menu/<tenant-slug>`
- Staff dashboard: `/dashboard`
- Menu sync API:
  - `GET /api/menu/sync?slug=<tenant-slug>`
  - `POST /api/menu/sync`
- AI routes:
  - `POST /api/ai/translate`
  - `POST /api/ai/assistant`
