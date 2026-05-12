import { getDishesForTenant, getTenantBySlug } from "@/lib/data";

export default async function RecommendationsPage({ params }: { params: Promise<{ slug: string }> }) {
  const route = await params;
  const tenant = await getTenantBySlug(route.slug);
  if (!tenant) return <main className="p-4">Tenant not found.</main>;
  const dishes = await getDishesForTenant(tenant.id);
  const featured = dishes.filter((d) => d.is_featured).slice(0, 6);

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-semibold">Recommended for You</h1>
      <div className="mt-4 grid gap-3">
        {featured.map((dish) => (
          <article key={dish.id} className="rounded-lg border border-white/10 p-4">
            <h2>{dish.name}</h2>
            <p className="text-sm text-white/75">{dish.description_it}</p>
            <p className="mt-2 text-sm text-gold">{dish.wine_pairing ?? "Ask AI waiter for pairing"}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
