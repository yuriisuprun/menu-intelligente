"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dish } from "@/types/domain";

const tenantSlug = "tavola-demo";

export default function DashboardMenuPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Antipasti");
  const [price, setPrice] = useState("12.00");

  async function refresh() {
    const data = await fetch(`/api/menu/sync?slug=${tenantSlug}`).then((r) => r.json());
    setDishes(data.dishes ?? []);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function addDish() {
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
      <h1 className="text-2xl font-semibold">Menu Editor</h1>
      <div className="mt-4 grid gap-2 rounded-lg border border-white/10 p-4 md:grid-cols-4">
        <input className="rounded border border-white/20 bg-white/5 p-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dish name" />
        <input className="rounded border border-white/20 bg-white/5 p-2" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
        <input className="rounded border border-white/20 bg-white/5 p-2" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
        <Button onClick={addDish} disabled={!name}>
          Add Dish
        </Button>
      </div>
      <div className="mt-5 space-y-2">
        {dishes.map((dish) => (
          <div key={dish.id} className="flex items-center justify-between rounded-lg border border-white/10 p-3">
            <div>
              <p>{dish.name}</p>
              <p className="text-sm text-white/70">{dish.category}</p>
            </div>
            <p className="text-gold">EUR {(dish.price_cents / 100).toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
