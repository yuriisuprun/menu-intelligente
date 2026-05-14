-- Minimal local seed for Tavola AI
-- Set your tenant slug to match NEXT_PUBLIC_TENANT_SLUG in .env.local

insert into public.tenants (
  name,
  slug,
  city,
  country_code,
  default_currency,
  primary_language,
  service_style,
  plan_tier,
  timezone
)
values (
  'Tavola Demo',
  'tavola-demo',
  'Rome',
  'IT',
  'EUR',
  'it',
  'premium',
  'starter',
  'Europe/Rome'
)
on conflict (slug) do update
set
  name = excluded.name,
  city = excluded.city,
  country_code = excluded.country_code,
  default_currency = excluded.default_currency,
  primary_language = excluded.primary_language,
  service_style = excluded.service_style,
  plan_tier = excluded.plan_tier,
  timezone = excluded.timezone;

insert into public.dishes (
  tenant_id,
  category,
  name,
  description_it,
  translations,
  price_cents,
  dietary_tags,
  allergy_tags,
  is_available,
  is_featured
)
select
  t.id,
  'Antipasti',
  'Bruschetta Classica',
  'Pane tostato con pomodoro, basilico e olio extra vergine.',
  '{"en":"Toasted bread with tomato, basil and extra-virgin olive oil."}'::jsonb,
  900,
  '{}'::text[],
  '{"gluten"}'::text[],
  true,
  true
from public.tenants t
where t.slug = 'tavola-demo'
on conflict do nothing;
