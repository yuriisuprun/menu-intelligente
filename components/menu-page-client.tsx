"use client";

import { useEffect, useMemo, useState } from "react";
import { AssistantModal } from "@/components/assistant-modal";
import { DishCard } from "@/components/dish-card";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Dish } from "@/types/domain";
import { resolveLanguage, SupportedLanguage } from "@/lib/utils";

export function MenuPageClient({ slug }: { slug: string }) {
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [tenantName, setTenantName] = useState("Tavola AI");

  useEffect(() => {
    const browserLang = resolveLanguage(typeof navigator !== "undefined" ? navigator.language : "en");
    setLanguage(browserLang);
    fetch(`/api/menu/sync?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setTenantName(data.tenant?.name ?? "Tavola AI");
        setDishes(data.dishes ?? []);
      });
  }, [slug]);

  const categories = useMemo(() => Array.from(new Set(dishes.map((d) => d.category))), [dishes]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{tenantName}</h1>
          <p className="text-sm text-white/70">Multilingual menu</p>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher value={language} onChange={setLanguage} />
          <AssistantModal tenantSlug={slug} language={language} />
        </div>
      </header>
      <div className="space-y-6">
        {categories.map((category) => (
          <section key={category}>
            <h2 className="mb-3 text-xl text-gold">{category}</h2>
            <div className="grid gap-3">
              {dishes
                .filter((d) => d.category === category && d.is_available)
                .map((dish) => (
                  <DishCard key={dish.id} dish={dish} lang={language} onAskPairing={() => {}} />
                ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
