import { demoDishes, demoTenant } from "@/lib/mock-data";
import { supabaseAdmin } from "@/lib/supabase";
import { Dish, Tenant } from "@/types/domain";

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  try {
    const { data } = await supabaseAdmin().from("tenants").select("*").eq("slug", slug).single();
    return data;
  } catch {
    return slug === demoTenant.slug ? demoTenant : null;
  }
}

export async function getDishesForTenant(tenantId: string): Promise<Dish[]> {
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
  return supabaseAdmin().from("dishes").upsert(dish).select("*").single();
}
