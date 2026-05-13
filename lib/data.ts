import { demoDishes, demoTenant } from "@/lib/mock-data";
import { supabaseAdmin } from "@/lib/supabase";
import { Dish, Tenant } from "@/types/domain";

const localDishesByTenant = new Map<string, Dish[]>();

function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function ensureLocalTenantDishes(tenantId: string) {
  if (localDishesByTenant.has(tenantId)) return;
  const seed = tenantId === demoTenant.id ? demoDishes : [];
  localDishesByTenant.set(tenantId, [...seed]);
}

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  if (!hasSupabaseConfig()) return slug === demoTenant.slug ? demoTenant : null;

  try {
    const { data } = await supabaseAdmin().from("tenants").select("*").eq("slug", slug).single();
    return data;
  } catch {
    return slug === demoTenant.slug ? demoTenant : null;
  }
}

export async function getDishesForTenant(tenantId: string): Promise<Dish[]> {
  if (!hasSupabaseConfig()) {
    ensureLocalTenantDishes(tenantId);
    return localDishesByTenant.get(tenantId) ?? [];
  }

  try {
    const { data } = await supabaseAdmin()
      .from("dishes")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("category")
      .order("name");
    return data ?? [];
  } catch {
    return demoDishes;
  }
}

export async function upsertDish(dish: Partial<Dish> & { tenant_id: string; name: string }) {
  if (!hasSupabaseConfig()) {
    ensureLocalTenantDishes(dish.tenant_id);
    const dishes = localDishesByTenant.get(dish.tenant_id) ?? [];

    const record: Dish = {
      id: dish.id ?? `${Date.now()}`,
      tenant_id: dish.tenant_id,
      category: dish.category ?? "Main",
      name: dish.name,
      description_it: dish.description_it ?? "",
      translations: dish.translations ?? {},
      price_cents: dish.price_cents ?? 0,
      photo_url: dish.photo_url ?? null,
      dietary_tags: dish.dietary_tags ?? [],
      allergy_tags: dish.allergy_tags ?? [],
      wine_pairing: dish.wine_pairing ?? null,
      is_available: dish.is_available ?? true,
      is_featured: dish.is_featured ?? false
    };

    const idx = dishes.findIndex((d) => d.id === record.id);
    if (idx >= 0) dishes[idx] = record;
    else dishes.push(record);

    localDishesByTenant.set(dish.tenant_id, dishes);
    return { data: record, error: null };
  }

  return supabaseAdmin().from("dishes").upsert(dish).select("*").single();
}
