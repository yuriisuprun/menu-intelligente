import { NextRequest, NextResponse } from "next/server";
import { getDishesForTenant, getTenantBySlug, upsertDish } from "@/lib/data";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  const tenant = await getTenantBySlug(slug);
  if (!tenant) return NextResponse.json({ error: "tenant not found" }, { status: 404 });
  const dishes = await getDishesForTenant(tenant.id);
  return NextResponse.json({ tenant, dishes });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const tenant = await getTenantBySlug(body.slug);
  if (!tenant) return NextResponse.json({ error: "tenant not found" }, { status: 404 });

  const payload = {
    tenant_id: tenant.id,
    name: body.dish.name,
    category: body.dish.category ?? "Main",
    description_it: body.dish.description_it ?? "",
    translations: body.dish.translations ?? {},
    price_cents: body.dish.price_cents ?? 0,
    photo_url: body.dish.photo_url ?? null,
    dietary_tags: body.dish.dietary_tags ?? [],
    allergy_tags: body.dish.allergy_tags ?? [],
    wine_pairing: body.dish.wine_pairing ?? null,
    is_available: true,
    is_featured: false
  };

  const { data, error } = await upsertDish(payload);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ dish: data });
}
