import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { brands } from "@/lib/catalog";

export function BrandCarousel() {
  const featured = brands.filter((b) => b.featured);
  const others = brands.filter((b) => !b.featured);

  return (
    <section className="bg-background py-10 md:py-14">
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

      {/* Brand in evidenza: solo tipografia, nessuna immagine da gestire */}
      <div className="container-mb mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {featured.map((b) => (
          <Link
            key={b.slug}
            to="/brand/$slug"
            params={{ slug: b.slug }}
            className="flex min-h-[88px] flex-col justify-center border-2 border-foreground bg-background px-4 py-3 transition-colors hover:bg-foreground hover:text-background"
          >
            <span className="text-sm font-semibold uppercase tracking-[0.16em]">{b.name}</span>
            {b.claim && <span className="mt-1 text-[11px] text-muted-foreground">{b.claim}</span>}
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
