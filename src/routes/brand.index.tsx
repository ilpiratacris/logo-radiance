import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { BrandTile } from "@/components/site/BrandCarousel";
import { brands, productsByBrand } from "@/lib/catalog";

export const Route = createFileRoute("/brand/")({
  head: () => {
    const title = "Tutti i brand — moda multibrand | MyBrand Italia";
    const description =
      "Peuterey, EA7, The North Face, K-Way, Tommy Hilfiger, Liu Jo e molti altri: esplora il catalogo MyBrand Italia brand per brand.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: BrandIndexPage,
});

const countLabel = (n: number) => `${n} ${n === 1 ? "prodotto" : "prodotti"}`;

function BrandIndexPage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () => brands.filter((b) => b.name.toLowerCase().includes(q.trim().toLowerCase())),
    [q],
  );
  const letters = useMemo(() => {
    const map = new Map<string, typeof brands>();
    filtered
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((b) => {
        const l = b.name[0]!.toUpperCase();
        map.set(l, [...(map.get(l) ?? []), b]);
      });
    return [...map.entries()];
  }, [filtered]);

  const featured = brands.filter((b) => b.featured);

  return (
    <SiteLayout>
      <div className="container-mb flex flex-col gap-3 py-4 lg:gap-4 lg:py-5">
        <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Brand" }]} />
        <div className="flex flex-col gap-1.5 lg:gap-2">
          <h1 className="text-2xl font-semibold leading-8 tracking-tight lg:text-3xl lg:leading-9">
            Brand
          </h1>
          <p className="text-sm leading-5 text-muted-foreground">
            {brands.length} brand disponibili su MyBrand Italia.
          </p>
        </div>

        <label className="search-box h-12 text-base lg:max-w-md">
          <Search className="h-5 w-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cerca un brand"
            aria-label="Cerca un brand"
          />
        </label>
      </div>

      {!q && (
        <section className="container-mb pt-4" aria-labelledby="brand-popolari">
          <h2 id="brand-popolari" className="label-caps font-display text-sm">
            Brand in evidenza
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((b) => (
              <BrandTile key={b.slug} brand={b} note={countLabel(productsByBrand(b.slug).length)} />
            ))}
          </div>
        </section>
      )}

      <section className="container-mb pb-10 pt-10 lg:pb-14" aria-labelledby="brand-tutti">
        <h2 id="brand-tutti" className="label-caps font-display text-sm">
          Tutti i brand
        </h2>
        <div className="mt-2 border-t border-border">
          {letters.map(([letter, list]) => (
            <div
              key={letter}
              className="grid gap-x-6 border-b border-border py-3 md:grid-cols-[48px_1fr]"
            >
              <div className="py-2 font-display text-lg font-semibold leading-7">{letter}</div>
              <ul className="grid grid-cols-2 md:grid-cols-4">
                {list.map((b) => (
                  <li key={b.slug}>
                    <Link
                      to="/brand/$slug"
                      params={{ slug: b.slug }}
                      className="flex h-11 items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {b.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {letters.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">Nessun brand trovato.</p>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
