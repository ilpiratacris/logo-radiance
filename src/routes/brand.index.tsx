import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
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
      <div className="container-mb pt-6">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Brand</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {brands.length} brand disponibili su MyBrand Italia.
        </p>

        <div className="mt-4 flex h-12 items-center gap-2 border border-border-strong px-3">
          <Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cerca un brand"
            aria-label="Cerca un brand"
            className="h-full w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {!q && (
        <section className="container-mb mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em]">Brand popolari</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            {featured.map((b) => (
              <Link key={b.slug} to="/brand/$slug" params={{ slug: b.slug }} className="group block">
                <img
                  src={b.image}
                  alt={b.name}
                  width={600}
                  height={400}
                  loading="lazy"
                  className="aspect-[3/2] w-full object-cover"
                />
                <div className="mt-2 text-xs font-semibold uppercase tracking-[0.08em]">{b.name}</div>
                <div className="text-[11px] text-muted-foreground">
                  {productsByBrand(b.slug).length} prodotti
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container-mb mt-10 pb-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em]">Tutti i brand</h2>
        <div className="mt-2">
          {letters.map(([letter, list]) => (
            <div key={letter} className="border-b border-border py-3">
              <div className="sticky top-[100px] bg-background py-1 text-sm font-semibold">{letter}</div>
              <ul className="grid grid-cols-2 md:grid-cols-4">
                {list.map((b) => (
                  <li key={b.slug}>
                    <Link
                      to="/brand/$slug"
                      params={{ slug: b.slug }}
                      className="flex h-11 items-center text-sm text-muted-foreground hover:text-foreground"
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
