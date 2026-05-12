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
  return (
    <article className="rounded-lg border border-white/10 bg-white/5 p-4">
      <h3 className="text-lg font-medium">{dish.name}</h3>
      <p className="mt-2 text-sm text-white/80">{desc}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {[...dish.dietary_tags, ...dish.allergy_tags].slice(0, 4).map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-black/30 px-2 py-1 text-xs text-white/80">
            {iconMap[tag] ?? <Leaf className="h-4 w-4" />}
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-gold">EUR {(dish.price_cents / 100).toFixed(2)}</span>
        <Button onClick={() => onAskPairing(dish.name)}>Pairing</Button>
      </div>
    </article>
  );
}
