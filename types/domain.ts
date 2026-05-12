export type Tenant = {
  id: string;
  name: string;
  slug: string;
  city: string;
  plan_tier: "basic" | "premium" | "enterprise";
};

export type Dish = {
  id: string;
  tenant_id: string;
  category: string;
  name: string;
  description_it: string;
  translations: Record<string, string>;
  price_cents: number;
  photo_url: string | null;
  dietary_tags: string[];
  allergy_tags: string[];
  wine_pairing: string | null;
  is_available: boolean;
  is_featured: boolean;
};
