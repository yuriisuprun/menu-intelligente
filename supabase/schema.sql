create extension if not exists "pgcrypto";

-- ==========
-- Core enums
-- ==========
do $$ begin
  create type plan_tier as enum ('starter', 'growth', 'premium', 'enterprise');
exception when duplicate_object then null; end $$;

do $$ begin
  create type staff_role as enum ('owner', 'manager', 'host', 'server', 'kitchen', 'billing');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum ('pending', 'confirmed', 'in_kitchen', 'served', 'completed', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('pending', 'authorized', 'captured', 'failed', 'refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type service_style as enum ('casual', 'premium', 'fine_dining');
exception when duplicate_object then null; end $$;

-- =====================
-- Tenancy and branding
-- =====================
create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  city text not null,
  country_code text not null default 'IT',
  default_currency text not null default 'EUR',
  primary_language text not null default 'it',
  service_style service_style not null default 'premium',
  plan_tier plan_tier not null default 'starter',
  timezone text not null default 'Europe/Rome',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tenant_branding (
  tenant_id uuid primary key references public.tenants(id) on delete cascade,
  logo_url text,
  cover_photo_url text,
  accent_color text not null default '#1f2937',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tenant_subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan_tier plan_tier not null,
  status text not null default 'trialing',
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============
-- Auth mapping
-- ============
create table if not exists public.restaurant_users (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null,
  role staff_role not null default 'owner',
  full_name text,
  created_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create index if not exists restaurant_users_user_idx on public.restaurant_users (user_id);

-- ==============
-- Dining surface
-- ==============
create table if not exists public.areas (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (tenant_id, name)
);

create table if not exists public.tables (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  area_id uuid references public.areas(id) on delete set null,
  label text not null,
  seats integer not null default 2,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (tenant_id, label)
);

create table if not exists public.qr_codes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  table_id uuid not null references public.tables(id) on delete cascade,
  token text unique not null,
  scan_count integer not null default 0,
  last_scanned_at timestamptz,
  created_at timestamptz not null default now()
);

-- ==========
-- Menu model
-- ==========
create table if not exists public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (tenant_id, name)
);

create table if not exists public.dishes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  category_id uuid references public.menu_categories(id) on delete set null,
  name text not null,
  description_it text not null default '',
  translations jsonb not null default '{}'::jsonb,
  price_cents integer not null default 0,
  photo_url text,
  dietary_tags text[] not null default '{}',
  allergy_tags text[] not null default '{}',
  wine_pairing text,
  prep_time_minutes integer,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists dishes_tenant_idx on public.dishes (tenant_id);
create index if not exists dishes_tenant_available_idx on public.dishes (tenant_id, is_available);

-- ============================
-- Guest sessions and ordering
-- ============================
create table if not exists public.guest_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  table_id uuid not null references public.tables(id) on delete cascade,
  language text not null default 'en',
  device_fingerprint text,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  table_id uuid references public.tables(id) on delete set null,
  guest_session_id uuid references public.guest_sessions(id) on delete set null,
  order_number bigint generated by default as identity,
  status order_status not null default 'pending',
  source text not null default 'qr',
  subtotal_cents integer not null default 0,
  service_fee_cents integer not null default 0,
  tip_cents integer not null default 0,
  total_cents integer not null default 0,
  notes text,
  placed_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  dish_id uuid references public.dishes(id) on delete set null,
  quantity integer not null default 1,
  unit_price_cents integer not null default 0,
  line_total_cents integer not null default 0,
  notes text
);

create index if not exists orders_tenant_placed_idx on public.orders (tenant_id, placed_at desc);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null default 'stripe',
  provider_intent_id text unique,
  status payment_status not null default 'pending',
  amount_cents integer not null default 0,
  currency text not null default 'EUR',
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

-- ======================
-- AI + analytics surface
-- ======================
create table if not exists public.ai_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  event_type text not null,
  model text,
  input_tokens integer,
  output_tokens integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.guest_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  guest_session_id uuid references public.guest_sessions(id) on delete set null,
  event_type text not null,
  language text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.daily_metrics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  date date not null,
  orders_count integer not null default 0,
  guests_count integer not null default 0,
  revenue_cents integer not null default 0,
  avg_ticket_cents integer not null default 0,
  translation_requests integer not null default 0,
  upsell_accept_rate numeric(5,2) not null default 0,
  created_at timestamptz not null default now(),
  unique (tenant_id, date)
);

-- ===========
-- Updated at
-- ===========
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tenants_set_updated_at on public.tenants;
create trigger tenants_set_updated_at before update on public.tenants
for each row execute function public.set_updated_at();

drop trigger if exists dishes_set_updated_at on public.dishes;
create trigger dishes_set_updated_at before update on public.dishes
for each row execute function public.set_updated_at();

drop trigger if exists branding_set_updated_at on public.tenant_branding;
create trigger branding_set_updated_at before update on public.tenant_branding
for each row execute function public.set_updated_at();

drop trigger if exists subscriptions_set_updated_at on public.tenant_subscriptions;
create trigger subscriptions_set_updated_at before update on public.tenant_subscriptions
for each row execute function public.set_updated_at();

-- ==================
-- Row level security
-- ==================
alter table public.tenants enable row level security;
alter table public.tenant_branding enable row level security;
alter table public.tenant_subscriptions enable row level security;
alter table public.restaurant_users enable row level security;
alter table public.areas enable row level security;
alter table public.tables enable row level security;
alter table public.qr_codes enable row level security;
alter table public.menu_categories enable row level security;
alter table public.dishes enable row level security;
alter table public.guest_sessions enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.ai_events enable row level security;
alter table public.guest_events enable row level security;
alter table public.daily_metrics enable row level security;

create or replace function public.is_tenant_member(target_tenant uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.restaurant_users ru
    where ru.tenant_id = target_tenant
      and ru.user_id = auth.uid()
  );
$$;

-- Staff access policies
create policy "staff_select_tenants"
on public.tenants for select
using (public.is_tenant_member(id));

create policy "staff_manage_tenant_branding"
on public.tenant_branding for all
using (public.is_tenant_member(tenant_id));

create policy "staff_manage_subscriptions"
on public.tenant_subscriptions for all
using (public.is_tenant_member(tenant_id));

create policy "staff_manage_membership"
on public.restaurant_users for all
using (public.is_tenant_member(tenant_id));

create policy "staff_manage_areas"
on public.areas for all
using (public.is_tenant_member(tenant_id));

create policy "staff_manage_tables"
on public.tables for all
using (public.is_tenant_member(tenant_id));

create policy "staff_manage_qr_codes"
on public.qr_codes for all
using (public.is_tenant_member(tenant_id));

create policy "staff_manage_categories"
on public.menu_categories for all
using (public.is_tenant_member(tenant_id));

create policy "staff_manage_dishes"
on public.dishes for all
using (public.is_tenant_member(tenant_id));

create policy "staff_manage_guest_sessions"
on public.guest_sessions for all
using (public.is_tenant_member(tenant_id));

create policy "staff_manage_orders"
on public.orders for all
using (public.is_tenant_member(tenant_id));

create policy "staff_manage_order_items"
on public.order_items for all
using (
  exists (
    select 1
    from public.orders o
    where o.id = order_items.order_id
      and public.is_tenant_member(o.tenant_id)
  )
);

create policy "staff_manage_payments"
on public.payments for all
using (public.is_tenant_member(tenant_id));

create policy "staff_manage_ai_events"
on public.ai_events for all
using (public.is_tenant_member(tenant_id));

create policy "staff_manage_guest_events"
on public.guest_events for all
using (public.is_tenant_member(tenant_id));

create policy "staff_manage_daily_metrics"
on public.daily_metrics for all
using (public.is_tenant_member(tenant_id));

-- Public guest read for menu via tenant slug is intentionally handled in API
-- routes using service role and strict query scoping.
