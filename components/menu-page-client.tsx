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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assistantOpenKey, setAssistantOpenKey] = useState<number | undefined>(undefined);
  const [prefilledQuestion, setPrefilledQuestion] = useState("");

  useEffect(() => {
    const browserLang = resolveLanguage(typeof navigator !== "undefined" ? navigator.language : "en");
    setLanguage(browserLang);
    setLoading(true);
    setError(null);

    fetch(`/api/menu/sync?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setTenantName(data.tenant?.name ?? "Tavola AI");
        setDishes(data.dishes ?? []);
      })
      .catch(() => setError("Unable to load menu right now."))
      .finally(() => setLoading(false));
  }, [slug]);

  const availableDishes = useMemo(() => dishes.filter((d) => d.is_available), [dishes]);
  const categories = useMemo(() => Array.from(new Set(availableDishes.map((d) => d.category))), [availableDishes]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{tenantName}</h1>
          <p className="mt-1 text-sm text-slate-500">Multilingual menu</p>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher value={language} onChange={setLanguage} />
          <AssistantModal
            tenantSlug={slug}
            language={language}
            openKey={assistantOpenKey}
            prefilledQuestion={prefilledQuestion}
          />
        </div>
      </header>

      {loading && <p className="text-sm text-slate-500">Loading menu...</p>}
      {error && <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {!loading && !error && availableDishes.length === 0 && (
        <p className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">No available dishes right now.</p>
      )}

      <div className="space-y-8">
        {categories.map((category) => (
          <section key={category}>
            <h2 className="mb-4 text-2xl font-medium text-gold">{category}</h2>
            <div className="grid gap-3">
              {availableDishes
                .filter((d) => d.category === category)
                .map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    lang={language}
                    onAskPairing={(dishName) => {
                      setPrefilledQuestion(`What pairs best with ${dishName}?`);
                      setAssistantOpenKey((k) => (k ?? 0) + 1);
                    }}
                  />
                ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
