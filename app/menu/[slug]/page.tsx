import { MenuPageClient } from "@/components/menu-page-client";

export default async function MenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const route = await params;
  return <MenuPageClient slug={route.slug} />;
}
