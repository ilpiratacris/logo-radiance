import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { brands } from "@/lib/catalog";

export function BrandCarousel() {
  const featured = brands.filter((b) => b.featured);
  const others = brands.filter((b) => !b.featured);

  return (
    <section className="bg-surface py-10 md:py-14">
      <div className="container-mb flex items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Multibrand
          </div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">Brand in evidenza</h2>
        </div>
        <Link to="/brand" className="flex h-11 items-center gap-1 text-xs font-medium underline-offset-4 hover:underline">
          Tutti i brand <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Link>
      </div>

      <div className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {featured.map((b) => (
          <Link
            key={b.slug}
            to="/brand/$slug"
            params={{ slug: b.slug }}
            className="group relative w-[62%] shrink-0 snap-start overflow-hidden sm:w-[38%] lg:w-[23%]"
          >
            <img
              src={b.image}
              alt={b.name}
              width={600}
              height={400}
              loading="lazy"
              className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/85 to-transparent p-3">
              <div className="text-sm font-semibold uppercase tracking-[0.1em] text-background">{b.name}</div>
              {b.claim && <div className="text-[11px] text-background/80">{b.claim}</div>}
            </div>
          </Link>
        ))}
      </div>

      <div className="container-mb mt-5 flex flex-wrap gap-2">
        {others.slice(0, 12).map((b) => (
          <Link
            key={b.slug}
            to="/brand/$slug"
            params={{ slug: b.slug }}
            className="flex h-10 items-center border border-border bg-background px-3 text-xs font-medium"
          >
            {b.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
