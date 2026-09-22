import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import type { Product } from "@/lib/catalog";

export function ProductCarousel({
  title,
  eyebrow,
  products,
  to,
  toParams,
  linkLabel = "Vedi tutti",
}: {
  title: string;
  eyebrow?: string;
  products: Product[];
  to?: string;
  toParams?: Record<string, string>;
  linkLabel?: string;
}) {
  if (products.length === 0) return null;
  return (
    <section className="py-8 md:py-12">
      <div className="container-mb flex items-end justify-between gap-4">
        <div>
          {eyebrow && (
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {eyebrow}
            </div>
          )}
          <h2 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">{title}</h2>
        </div>
        {to && (
          <Link
            to={to}
            params={toParams as never}
            className="flex h-11 shrink-0 items-center gap-1 text-xs font-medium underline-offset-4 hover:underline"
          >
            {linkLabel} <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
        )}
      </div>

      <div className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:px-[max(1rem,calc((100vw-1440px)/2+2rem))] md:px-8">
        {products.map((p, i) => (
          <div key={p.slug} className="w-[46%] shrink-0 snap-start sm:w-[32%] md:w-[24%] lg:w-[19%]">
            <ProductCard product={p} priority={i < 2} />
          </div>
        ))}
      </div>
    </section>
  );
}
