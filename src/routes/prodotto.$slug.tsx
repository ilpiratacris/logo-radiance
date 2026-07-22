import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { TopBar } from "@/components/site/TopBar";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { findProduct, products } from "@/lib/mock-data";
import { useState } from "react";
import { Truck, RotateCcw, CreditCard, ChevronDown, Heart, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/prodotto/$slug")({
  loader: ({ params }) => {
    const product = findProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Prodotto — MyBrand Italia" }] };
    const p = loaderData.product;
    return {
      meta: [
        { title: `${p.name} — ${p.brand} | MyBrand Italia` },
        {
          name: "description",
          content: `${p.brand} ${p.name} — spedizione gratuita, reso gratuito e paga in 3 rate su MyBrand Italia.`,
        },
        { property: "og:title", content: `${p.brand} ${p.name} — MyBrand Italia` },
        {
          property: "og:description",
          content: `Acquista ${p.brand} ${p.name} online. Spedizione e reso gratuiti.`,
        },
      ],
    };
  },
  component: ProductPage,
});

const sizes = ["XS", "S", "M", "L", "XL"];

function ProductPage() {
  const { slug } = useParams({ from: "/prodotto/$slug" });
  const product = findProduct(slug)!;
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState(product.colors[0]);
  const [descOpen, setDescOpen] = useState(true);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [shipOpen, setShipOpen] = useState(false);

  const gallery = [product.image, product.altImage ?? product.image, product.image, product.altImage ?? product.image];
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 4);
  const soldOut = ["XS", "XL"];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />
      <Header />

      <main className="flex-1">
        <div className="container-mb pt-6">
          <nav className="text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="mx-1.5">/</span>
            <Link to="/categoria/$slug" params={{ slug: product.category }} className="hover:text-foreground capitalize">
              {product.category}
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>

        <section className="container-mb mt-4 grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
          {/* Gallery */}
          <div className="flex flex-col-reverse gap-3 md:flex-row">
            <div className="flex gap-3 md:flex-col">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-[4/5] w-16 shrink-0 overflow-hidden bg-surface border ${
                    i === activeImg ? "border-foreground" : "border-transparent"
                  }`}
                >
                  <img src={g} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-1 aspect-[4/5] overflow-hidden bg-surface">
              <img
                src={gallery[activeImg]}
                alt={product.name}
                width={800}
                height={1000}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Info column */}
          <div className="md:pt-2">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">
              {product.brand}
            </div>
            <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-foreground md:text-3xl">
              {product.name}
            </h1>

            <div className="mt-5 flex items-baseline gap-3">
              <span className={`text-2xl font-semibold ${product.oldPrice ? "text-[color:var(--color-sale)]" : "text-foreground"}`}>
                € {product.price.toFixed(2).replace(".", ",")}
              </span>
              {product.oldPrice && (
                <>
                  <span className="text-base text-muted-foreground line-through">
                    € {product.oldPrice.toFixed(2).replace(".", ",")}
                  </span>
                  <span className="text-xs font-semibold text-[color:var(--color-sale)]">
                    −{Math.round((1 - product.price / product.oldPrice) * 100)}%
                  </span>
                </>
              )}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Prezzo IVA inclusa
            </div>

            {/* Colore */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-[0.14em]">Colore</div>
                <div className="text-xs text-muted-foreground">{product.colors.length} disponibili</div>
              </div>
              <div className="mt-3 flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`h-9 w-9 rounded-full border-2 transition-all ${
                      color === c ? "border-foreground" : "border-border"
                    }`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>

            {/* Taglia */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-[0.14em]">Taglia</div>
                <button className="text-xs text-muted-foreground underline hover:text-foreground">
                  Guida alle taglie
                </button>
              </div>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {sizes.map((s) => {
                  const out = soldOut.includes(s);
                  const active = size === s;
                  return (
                    <button
                      key={s}
                      disabled={out}
                      onClick={() => setSize(s)}
                      className={`relative h-11 border text-sm font-medium transition ${
                        active
                          ? "border-foreground bg-foreground text-background"
                          : out
                          ? "border-border text-muted-foreground cursor-not-allowed"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {s}
                      {out && (
                        <span className="absolute inset-x-1 top-1/2 h-px -rotate-12 bg-border-strong" />
                      )}
                    </button>
                  );
                })}
              </div>
              {size && (
                <div className="mt-2 text-xs text-muted-foreground">Selezionata: {size}</div>
              )}
            </div>

            {/* CTA */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button className="btn-primary flex-1 gap-2">
                <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
                Aggiungi al carrello
              </button>
              <button className="btn-outline sm:w-14" aria-label="Aggiungi ai preferiti">
                <Heart className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Trust vicino alla CTA */}
            <ul className="mt-6 divide-y divide-border border border-border rounded-sm">
              {[
                { icon: Truck, title: "Spedizione gratuita", sub: "Consegna con BRT FermoPoint" },
                { icon: RotateCcw, title: "Reso gratuito", sub: "Cambio o buono acquisto" },
                { icon: CreditCard, title: "Paga in 3 rate", sub: "Senza interessi con Klarna o Scalapay" },
              ].map(({ icon: Icon, title, sub }) => (
                <li key={title} className="flex items-start gap-3 p-3.5">
                  <Icon className="h-5 w-5 mt-0.5 shrink-0" strokeWidth={1.5} />
                  <div>
                    <div className="text-sm font-medium">{title}</div>
                    <div className="text-xs text-muted-foreground">{sub}</div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Accordion */}
            <div className="mt-8 border-t border-border">
              <Accordion open={descOpen} onToggle={() => setDescOpen(!descOpen)} title="Descrizione">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {product.name} firmato {product.brand}. Un capo essenziale della nuova collezione,
                  pensato per accompagnarti in ogni occasione con qualità dei materiali e vestibilità curata.
                </p>
                <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Composizione: 100% cotone</li>
                  <li>Vestibilità regolare</li>
                  <li>Made in Italy</li>
                  <li>Lavaggio in lavatrice a 30°C</li>
                </ul>
              </Accordion>
              <Accordion open={sizeOpen} onToggle={() => setSizeOpen(!sizeOpen)} title="Taglie e vestibilità">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Il modello indossa una taglia M. Consigliamo di scegliere la propria taglia abituale.
                </p>
              </Accordion>
              <Accordion open={shipOpen} onToggle={() => setShipOpen(!shipOpen)} title="Spedizione e resi">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Spedizione gratuita con BRT FermoPoint. Reso gratuito entro 14 giorni con cambio o buono acquisto.
                </p>
              </Accordion>
            </div>
          </div>
        </section>

        {/* Related */}
        <section className="container-mb mt-20 pb-20">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Potrebbe piacerti anche</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Accordion({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border">
      <button onClick={onToggle} className="flex w-full items-center justify-between py-4 text-left">
        <span className="text-sm font-semibold">{title}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={1.5}
        />
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  );
}
