import Link from "next/link";
import { getDishesForTenant, getTenantBySlug } from "@/lib/data";

export default async function DishDetailPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const route = await params;
  const tenant = await getTenantBySlug(route.slug);
  if (!tenant) return <main className="p-4">Tenant not found.</main>;
  const dishes = await getDishesForTenant(tenant.id);
  const dish = dishes.find((d) => d.id === route.id);
  if (!dish) return <main className="p-4">Dish not found.</main>;

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <Link href={`/menu/${route.slug}`} className="text-sm text-white/70">
        Back to Menu
      </Link>
      <h1 className="mt-4 text-3xl font-semibold">{dish.name}</h1>
      <p className="mt-3 text-white/80">{dish.description_it}</p>
      <p className="mt-4 text-gold">EUR {(dish.price_cents / 100).toFixed(2)}</p>
    </main>
  );
}
