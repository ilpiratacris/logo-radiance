import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/site/TopBar";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { TrustBar } from "@/components/site/TrustBar";
import { products, brands } from "@/lib/mock-data";
import hero from "@/assets/hero-woman.jpg";
import donna from "@/assets/cat-donna.jpg";
import uomo from "@/assets/cat-uomo.jpg";
import bambino from "@/assets/cat-bambino.jpg";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MyBrand Italia — Nuova collezione multibrand" },
      {
        name: "description",
        content:
          "Scopri Donna, Uomo, Bambino e Accessori dai brand di tendenza. Spedizione e reso gratuiti, paga in 3 rate.",
      },
      { property: "og:title", content: "MyBrand Italia — Nuova collezione multibrand" },
      {
        property: "og:description",
        content: "Selezione curata dei brand di tendenza per tutta la famiglia.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const novita = products.slice(0, 4);
  const offerte = products.filter((p) => p.oldPrice).slice(0, 4);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />
      <Header />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative bg-surface">
          <div className="container-mb grid gap-8 py-10 md:grid-cols-2 md:items-center md:py-16 lg:py-20">
            <div className="order-2 md:order-1">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Nuova collezione
              </div>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                I brand che ami,
                <br />
                selezionati per te.
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
                Un'accurata selezione delle migliori marche di tendenza,
                curata per tutta la famiglia.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/categoria/$slug" params={{ slug: "donna" }} className="btn-primary">
                  Scopri Donna
                </Link>
                <Link to="/categoria/$slug" params={{ slug: "uomo" }} className="btn-outline">
                  Scopri Uomo
                </Link>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <img
                src={hero}
                alt="Nuova collezione MyBrand"
                width={1600}
                height={1000}
                className="w-full aspect-[4/5] md:aspect-[5/6] object-cover"
                fetchPriority="high"
              />
            </div>
          </div>
        </section>

        {/* CATEGORIE PRINCIPALI */}
        <section className="container-mb py-14 md:py-20">
          <SectionHeader eyebrow="Shop" title="Categorie principali" />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            {[
              { slug: "donna", label: "Donna", img: donna },
              { slug: "uomo", label: "Uomo", img: uomo },
              { slug: "bambino", label: "Bambino", img: bambino },
            ].map((c) => (
              <Link
                key={c.slug}
                to="/categoria/$slug"
                params={{ slug: c.slug }}
                className="group relative block overflow-hidden bg-surface"
              >
                <img
                  src={c.img}
                  alt={c.label}
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                  <span className="text-lg font-semibold text-background drop-shadow-md">
                    {c.label}
                  </span>
                  <span className="inline-flex h-9 items-center gap-1.5 rounded-sm bg-background px-3 text-xs font-medium text-foreground">
                    Scopri <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* BRAND */}
        <section className="border-y border-border bg-surface">
          <div className="container-mb py-12">
            <SectionHeader eyebrow="Multibrand" title="Brand in evidenza" />
            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-5">
              {brands.slice(0, 10).map((b) => (
                <a
                  key={b}
                  href="#"
                  className="flex h-20 items-center justify-center bg-background text-sm font-semibold tracking-tight text-foreground/80 transition-colors hover:text-foreground"
                >
                  {b}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* NOVITÀ */}
        <section className="container-mb py-14 md:py-20">
          <div className="flex items-end justify-between">
            <SectionHeader eyebrow="Appena arrivati" title="Novità della settimana" />
            <Link
              to="/categoria/$slug"
              params={{ slug: "donna" }}
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-accent"
            >
              Vedi tutto <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {novita.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>

        {/* OFFERTE */}
        <section className="container-mb pb-14 md:pb-20">
          <div className="flex items-end justify-between">
            <SectionHeader eyebrow="Fino al −50%" title="Offerte in evidenza" />
            <Link
              to="/categoria/$slug"
              params={{ slug: "offerte" }}
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-accent"
            >
              Tutte le offerte <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {offerte.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>

        {/* Trust rinforzo */}
        <section className="container-mb pb-16">
          <TrustBar />
        </section>
      </main>

      <Footer />
    </div>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {eyebrow}
      </div>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        {title}
      </h2>
    </div>
  );
}
