import { NextRequest, NextResponse } from "next/server";
import { askWaiterAssistant } from "@/lib/ai";
import { getDishesForTenant, getTenantBySlug } from "@/lib/data";

export async function POST(req: NextRequest) {
  const { tenantSlug, question, language } = await req.json();
  if (!tenantSlug || !question || !language) {
    return NextResponse.json({ error: "tenantSlug, question and language are required" }, { status: 400 });
  }

  const tenant = await getTenantBySlug(tenantSlug);
  if (!tenant) return NextResponse.json({ error: "tenant not found" }, { status: 404 });

  const dishes = await getDishesForTenant(tenant.id);
  const menuContext = dishes.map((d) => `${d.name}: ${d.description_it}. Pairing: ${d.wine_pairing ?? "n/a"}`).join("\n");

  try {
    const answer = await askWaiterAssistant({ menuContext, question, language });
    return NextResponse.json({ answer });
  } catch (error) {
    const message = error instanceof Error ? error.message : "assistant failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
