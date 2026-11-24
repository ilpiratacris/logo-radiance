import { ProductCard } from "@/components/site/ProductCard";
import { SectionHeader } from "@/components/site/SectionHeader";
import type { Product } from "@/lib/catalog";

/** Riga scorrevole di prodotti con testata; il link «Vedi tutti» compare solo se c'è una destinazione. */
export function ProductCarousel({
  title,
  eyebrow,
  products,
  to,
  toParams,
  toSearch,
  linkLabel = "Vedi tutti",
}: {
  title: string;
  eyebrow?: string;
  products: Product[];
  to?: string;
  toParams?: Record<string, string>;
  toSearch?: Record<string, string>;
  linkLabel?: string;
}) {
  if (products.length === 0) return null;
  return (
    <section className="py-8 md:py-12">
      <SectionHeader
        className="container-mb"
        eyebrow={eyebrow}
        title={title}
        link={to ? { label: linkLabel, to, params: toParams, search: toSearch } : undefined}
      />

      <div className="no-scrollbar mt-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 md:scroll-px-8 md:gap-4 md:px-8 lg:px-[max(2rem,calc((100vw-1440px)/2+2rem))]">
        {products.map((p, i) => (
          <div
            key={p.slug}
            className="w-[46%] shrink-0 snap-start sm:w-[32%] md:w-[24%] lg:w-[19%]"
          >
            <ProductCard product={p} priority={i < 2} />
          </div>
        ))}
      </div>
    </section>
  );
}
