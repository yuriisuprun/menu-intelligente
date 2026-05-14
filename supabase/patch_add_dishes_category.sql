-- Compatibility patch for current application code.
-- The app reads/writes dishes.category (text), while base schema defines category_id.

alter table public.dishes
add column if not exists category text not null default 'Main';

create index if not exists dishes_tenant_category_idx
on public.dishes (tenant_id, category);
