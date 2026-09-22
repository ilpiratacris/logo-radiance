import { ProductCard } from "@/components/site/ProductCard";
import type { Product } from "@/lib/catalog";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p, i) => (
        <ProductCard key={p.slug} product={p} priority={i < 4} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ n = 8 }: { n?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i}>
          <div className="aspect-[3/4] animate-pulse bg-surface" />
          <div className="mt-2 h-3 w-1/3 animate-pulse bg-surface" />
          <div className="mt-2 h-3 w-2/3 animate-pulse bg-surface" />
        </div>
      ))}
    </div>
  );
}
