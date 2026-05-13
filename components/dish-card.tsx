"use client";

import { Flame, Leaf, Shell, WheatOff } from "lucide-react";
import { Dish } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { SupportedLanguage } from "@/lib/utils";

const iconMap: Record<string, JSX.Element> = {
  spicy: <Flame className="h-4 w-4" />,
  vegetarian: <Leaf className="h-4 w-4" />,
  seafood: <Shell className="h-4 w-4" />,
  "gluten-free": <WheatOff className="h-4 w-4" />
};

export function DishCard({
  dish,
  lang,
  onAskPairing
}: {
  dish: Dish;
  lang: SupportedLanguage;
  onAskPairing: (dishName: string) => void;
}) {
  const desc = lang === "it" ? dish.description_it : dish.translations?.[lang] ?? dish.translations?.en ?? dish.description_it;
  const tags = [...(dish.dietary_tags ?? []), ...(dish.allergy_tags ?? [])].slice(0, 4);
  const formattedPrice = new Intl.NumberFormat(lang === "it" ? "it-IT" : "en-US", {
    style: "currency",
    currency: "EUR"
  }).format(dish.price_cents / 100);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <h3 className="text-xl font-semibold text-slate-900">{dish.name}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600">
            {iconMap[tag] ?? <Leaf className="h-4 w-4" />}
            {tag.replace("-", " ")}
          </span>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="text-lg font-semibold text-gold">{formattedPrice}</span>
        <Button onClick={() => onAskPairing(dish.name)}>Pairing</Button>
      </div>
    </article>
  );
}
