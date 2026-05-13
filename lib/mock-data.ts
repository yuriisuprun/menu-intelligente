import { Dish, Tenant } from "@/types/domain";

export const demoTenant: Tenant = {
  id: "demo-tenant",
  name: "Tavola Demo",
  slug: "tavola-demo",
  city: "Milan",
  plan_tier: "premium"
};

export const demoDishes: Dish[] = [
  {
    id: "1",
    tenant_id: "demo-tenant",
    category: "Antipasti",
    name: "Vitello Tonnato",
    description_it: "Fettine di vitello con salsa tonnata cremosa e capperi.",
    translations: {
      en: "Thin veal slices with silky tuna-caper cream.",
      fr: "Fines tranches de veau, sauce thon-câpres onctueuse.",
      de: "Dünne Kalbfleischscheiben mit cremiger Thunfisch-Kapern-Sauce.",
      es: "Láminas de ternera con salsa cremosa de atún y alcaparras.",
      ja: "薄切り仔牛肉にツナとケッパーのクリーミーソース。",
      uk: "Тонкі скибочки телятини з кремовим соусом із тунця та каперсів."
    },
    price_cents: 1800,
    photo_url: null,
    dietary_tags: [],
    allergy_tags: ["dairy-free"],
    wine_pairing: "Franciacorta Brut",
    is_available: true,
    is_featured: true
  }
];
