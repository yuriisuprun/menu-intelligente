import { supabaseAdmin } from "@/lib/supabase";
import { Dish, Tenant } from "@/types/domain";

function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function requireSupabaseConfig() {
  if (!hasSupabaseConfig()) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
}

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  requireSupabaseConfig();

  const { data, error } = await supabaseAdmin().from("tenants").select("*").eq("slug", slug).single();
  if (error) return null;
  return data;
}

export async function getDishesForTenant(tenantId: string): Promise<Dish[]> {
  requireSupabaseConfig();

  const { data, error } = await supabaseAdmin()
    .from("dishes")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("category")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function upsertDish(dish: Partial<Dish> & { tenant_id: string; name: string }) {
  requireSupabaseConfig();

  return supabaseAdmin().from("dishes").upsert(dish).select("*").single();
}
