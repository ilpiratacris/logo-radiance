import { Link } from "@tanstack/react-router";
import { SectionHeader } from "@/components/site/SectionHeader";
import { brands, type Brand } from "@/lib/catalog";

/** Tessera di un brand: logo (se disponibile), nome e una riga di presentazione. */
export function BrandTile({ brand, note }: { brand: Brand; note?: string }) {
  const sub = note ?? brand.claim;
  return (
    <Link
      to="/brand/$slug"
      params={{ slug: brand.slug }}
      className="group flex min-h-[88px] flex-col justify-center border-2 border-foreground bg-background px-4 py-3 transition-colors hover:bg-foreground hover:text-background"
    >
      {brand.logo && (
        <img
          src={brand.logo}
          alt=""
          loading="lazy"
          className="mb-2.5 h-8 w-auto max-w-[120px] self-start object-contain object-left brightness-0 group-hover:invert"
        />
      )}
      <span className="text-sm font-semibold uppercase tracking-[0.16em]">{brand.name}</span>
      {sub && (
        <span className="mt-1 text-[11px] text-muted-foreground transition-colors group-hover:text-background">
          {sub}
        </span>
      )}
    </Link>
  );
}

export function BrandCarousel() {
  const featured = brands.filter((b) => b.featured);
  const others = brands.filter((b) => !b.featured);

  return (
    <section className="bg-background py-10 md:py-14">
      <div className="container-mb">
        <SectionHeader
          eyebrow="Multibrand"
          title="Brand in evidenza"
          link={{ label: "Tutti i brand", to: "/brand" }}
        />

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((b) => (
            <BrandTile key={b.slug} brand={b} />
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {others.slice(0, 12).map((b) => (
            <Link
              key={b.slug}
              to="/brand/$slug"
              params={{ slug: b.slug }}
              className="flex h-10 items-center border border-border bg-background px-3 text-xs font-medium transition-colors hover:border-foreground hover:bg-surface"
            >
              {b.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
