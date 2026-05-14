"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dish } from "@/types/domain";

const tenantSlug = process.env.NEXT_PUBLIC_TENANT_SLUG ?? "";

export default function DashboardMenuPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Antipasti");
  const [price, setPrice] = useState("12.00");

  async function refresh() {
    if (!tenantSlug) return;
    const data = await fetch(`/api/menu/sync?slug=${tenantSlug}`).then((r) => r.json());
    setDishes(data.dishes ?? []);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function addDish() {
    if (!tenantSlug) return;
    await fetch("/api/menu/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: tenantSlug,
        dish: {
          name,
          category,
          description_it: `${name} preparato fresco in stile milanese.`,
          price_cents: Math.round(Number(price) * 100),
          dietary_tags: [],
          allergy_tags: [],
          translations: { en: name }
        }
      })
    });
    setName("");
    refresh();
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Menu Editor</h1>
      {!tenantSlug && (
        <p className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Set NEXT_PUBLIC_TENANT_SLUG to load and edit your menu.
        </p>
      )}
      <div className="mt-6 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-4">
        <input
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-gold/70 focus:ring-2 focus:ring-gold/20"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Dish name"
        />
        <input
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-gold/70 focus:ring-2 focus:ring-gold/20"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
        />
        <input
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-gold/70 focus:ring-2 focus:ring-gold/20"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
        />
        <Button onClick={addDish} disabled={!name || !tenantSlug}>
          Add Dish
        </Button>
      </div>
      <div className="mt-6 space-y-2">
        {dishes.map((dish) => (
          <div key={dish.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3">
            <div>
              <p className="font-medium text-slate-800">{dish.name}</p>
              <p className="text-sm text-slate-500">{dish.category}</p>
            </div>
            <p className="font-medium text-gold">EUR {(dish.price_cents / 100).toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
