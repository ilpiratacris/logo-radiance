import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { TopBar } from "@/components/site/TopBar";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { TrustBar } from "@/components/site/TrustBar";
import { products, brands } from "@/lib/mock-data";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/categoria/$slug")({
  head: ({ params }) => {
    const label = titleForSlug(params.slug);
    return {
      meta: [
        { title: `${label} — MyBrand Italia` },
        {
          name: "description",
          content: `Scopri la collezione ${label}: brand di tendenza, spedizione e reso gratuiti.`,
        },
        { property: "og:title", content: `${label} — MyBrand Italia` },
        { property: "og:description", content: `Collezione ${label} multibrand su MyBrand Italia.` },
      ],
    };
  },
  component: Category,
});

function titleForSlug(slug: string) {
  return slug.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = [
  { name: "Nero", hex: "#111111" },
  { name: "Bianco", hex: "#ffffff" },
  { name: "Beige", hex: "#d9c4a7" },
  { name: "Blu", hex: "#3b5b7a" },
  { name: "Rosso", hex: "#c94a3a" },
  { name: "Marrone", hex: "#7a5a44" },
];

function Category() {
  const { slug } = useParams({ from: "/categoria/$slug" });
  const label = titleForSlug(slug);
  const [mobileFilters, setMobileFilters] = useState(false);

  // demo: duplicate products to fill the grid
  const items = [...products, ...products].slice(0, 12);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />
      <Header />

      <main className="flex-1">
        <div className="container-mb pt-6">
          <nav className="text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-foreground">{label}</span>
          </nav>
          <div className="mt-4 flex items-baseline justify-between">
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{label}</h1>
            <span className="text-xs text-muted-foreground">{items.length} risultati</span>
          </div>
        </div>

        <div className="container-mb mt-6 grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Sidebar Filters desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              <FilterGroup title="Brand">
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {brands.map((b) => (
                    <label key={b} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="h-3.5 w-3.5 accent-foreground" />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup title="Taglia">
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      className="h-9 border border-border text-xs font-medium hover:border-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup title="Colore">
                <div className="grid grid-cols-6 gap-2">
                  {colors.map((c) => (
                    <button
                      key={c.name}
                      title={c.name}
                      className="h-7 w-7 rounded-full border border-border ring-offset-2 hover:ring-1 hover:ring-foreground"
                      style={{ background: c.hex }}
                    />
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup title="Prezzo">
                <div className="flex gap-2">
                  <input placeholder="Min" className="h-9 w-full border border-border bg-background px-2 text-xs" />
                  <input placeholder="Max" className="h-9 w-full border border-border bg-background px-2 text-xs" />
                </div>
              </FilterGroup>
            </div>
          </aside>

          {/* Products area */}
          <div>
            {/* Trust bar + toolbar */}
            <div className="mb-6 space-y-4">
              <TrustBar />
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => setMobileFilters(true)}
                  className="lg:hidden inline-flex items-center gap-2 border border-border-strong px-3 h-10 text-sm"
                >
                  <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} /> Filtri
                </button>
                <div className="ml-auto flex items-center gap-2">
                  <label className="text-xs text-muted-foreground">Ordina:</label>
                  <div className="relative">
                    <select className="appearance-none border border-border bg-background pl-3 pr-8 h-10 text-sm">
                      <option>Novità</option>
                      <option>Prezzo crescente</option>
                      <option>Prezzo decrescente</option>
                      <option>Più popolari</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
              {items.map((p, i) => (
                <ProductCard key={`${p.slug}-${i}`} product={p} />
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <button className="btn-outline">Carica altri prodotti</button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile filters drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 bg-foreground/40 lg:hidden" onClick={() => setMobileFilters(false)}>
          <div className="ml-auto h-full w-[90%] max-w-sm bg-background p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="text-base font-semibold">Filtri</div>
              <button onClick={() => setMobileFilters(false)}><X className="h-6 w-6" strokeWidth={1.5} /></button>
            </div>
            <div className="space-y-6">
              <FilterGroup title="Brand">
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {brands.map((b) => (
                    <label key={b} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="h-3.5 w-3.5 accent-foreground" />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </FilterGroup>
              <FilterGroup title="Taglia">
                <div className="grid grid-cols-4 gap-2">
                  {sizes.map((s) => (
                    <button key={s} className="h-10 border border-border text-xs font-medium">{s}</button>
                  ))}
                </div>
              </FilterGroup>
              <FilterGroup title="Colore">
                <div className="grid grid-cols-6 gap-2">
                  {colors.map((c) => (
                    <button key={c.name} className="h-8 w-8 rounded-full border border-border" style={{ background: c.hex }} />
                  ))}
                </div>
              </FilterGroup>
            </div>
            <button onClick={() => setMobileFilters(false)} className="btn-primary w-full mt-8">
              Mostra risultati
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border pb-6">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-foreground">{title}</div>
      {children}
    </div>
  );
}
