create extension if not exists "pgcrypto";

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  city text not null default 'Milan',
  plan_tier text not null default 'basic',
  created_at timestamptz not null default now()
);

create table if not exists public.restaurant_users (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null,
  role text not null default 'owner',
  created_at timestamptz not null default now()
);

create table if not exists public.dishes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  category text not null,
  name text not null,
  description_it text not null default '',
  translations jsonb not null default '{}'::jsonb,
  price_cents integer not null default 0,
  photo_url text,
  dietary_tags text[] not null default '{}',
  allergy_tags text[] not null default '{}',
  wine_pairing text,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.qr_codes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  table_label text not null,
  token text unique not null,
  created_at timestamptz not null default now()
);

create index if not exists dishes_tenant_category_idx on public.dishes (tenant_id, category);

alter table public.tenants enable row level security;
alter table public.restaurant_users enable row level security;
alter table public.dishes enable row level security;
alter table public.qr_codes enable row level security;

create policy "tenant read own tenant" on public.tenants
for select using (
  exists (
    select 1 from public.restaurant_users ru
    where ru.tenant_id = tenants.id and ru.user_id = auth.uid()
  )
);

create policy "tenant read own dishes" on public.dishes
for select using (
  exists (
    select 1 from public.restaurant_users ru
    where ru.tenant_id = dishes.tenant_id and ru.user_id = auth.uid()
  )
);

create policy "tenant write own dishes" on public.dishes
for all using (
  exists (
    select 1 from public.restaurant_users ru
    where ru.tenant_id = dishes.tenant_id and ru.user_id = auth.uid()
  )
);
