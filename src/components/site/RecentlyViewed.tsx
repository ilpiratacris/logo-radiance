import { ProductCarousel } from "@/components/site/ProductCarousel";
import { findProduct } from "@/lib/catalog";
import { useStore } from "@/lib/store";

export function RecentlyViewed({ exclude, title = "Visti di recente" }: { exclude?: string; title?: string }) {
  const { recent, hydrated } = useStore();
  if (!hydrated) return null;
  const items = recent
    .filter((s) => s !== exclude)
    .map(findProduct)
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 8);
  if (items.length === 0) return null;
  return <ProductCarousel title={title} products={items} />;
}
