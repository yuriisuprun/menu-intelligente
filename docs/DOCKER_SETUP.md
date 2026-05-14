# Docker Setup (DB + REST API)

This project can run local data services via Docker Compose:

- Postgres (Supabase Postgres image)
- PostgREST (Supabase-compatible REST API used by `supabase-js`)

## 1) Prerequisites

- Docker Desktop
- Node.js 20+ (for key generation script)

## 2) Create `.env.docker`

Copy this template:

```env
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PORT=54322
POSTGREST_PORT=54321
PGRST_DB_AUTHENTICATOR_PASSWORD=authenticator
JWT_SECRET=super-secret-jwt-token-with-at-least-32-characters
```

## 3) Generate local anon/service keys

```bash
node scripts/generate-local-supabase-keys.mjs "super-secret-jwt-token-with-at-least-32-characters"
```

Copy `ANON_KEY` and `SERVICE_ROLE_KEY` from output.

## 4) Start Docker services

```bash
docker compose --env-file .env.docker up -d
```

The DB is initialized automatically with:

1. `docker/postgres/00_roles.sql`
2. `docker/postgres/01_auth.sql`
3. `supabase/schema.sql`
4. `supabase/patch_add_dishes_category.sql`
5. `supabase/local_seed.sql`

## 5) Configure app `.env.local`

Set:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ANON_KEY>
SUPABASE_SERVICE_ROLE_KEY=<SERVICE_ROLE_KEY>
NEXT_PUBLIC_TENANT_SLUG=tavola-demo
GROQ_API_KEY=<your-groq-key>
GROQ_MODEL=llama-3.1-8b-instant
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Fast path:

```bash
npm run docker:sync-env
```

This reads `.env.docker`, generates local anon/service keys from `JWT_SECRET`, and writes required Supabase env vars into `.env.local`.

## 6) Run app

```bash
npm run dev
```

Optional: run app in Docker too:

```bash
docker compose --env-file .env.docker --profile app up -d
```

The app will be available at `http://localhost:3000`.

## 7) Smoke test

With stack running and `.env.local` configured:

```bash
npm run docker:smoke
```

This command auto-loads `.env.local`, `.env`, `.env.docker`, and `.env.docker.local`.
If API keys are missing, it will generate short-lived anon/service JWTs from `JWT_SECRET`.
Then it checks PostgREST reachability and verifies both anon/service-role API access.

## Useful commands

- Stop stack: `docker compose --env-file .env.docker down`
- Stop and remove DB volume: `docker compose --env-file .env.docker down -v`
- Generate keys: `npm run docker:keys -- "your-jwt-secret"`
- Sync `.env.local` from Docker env: `npm run docker:sync-env`
- Start core services: `npm run docker:up`
- Run smoke test: `npm run docker:smoke`
