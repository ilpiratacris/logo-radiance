import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCarousel } from "@/components/site/ProductCarousel";
import { BrandCarousel } from "@/components/site/BrandCarousel";
import { RecentlyViewed } from "@/components/site/RecentlyViewed";
import { TrustBar } from "@/components/site/TrustBar";
import departmentUomoWide from "@/assets/department-uomo-wide.jpg";
import departmentDonnaWide from "@/assets/department-donna-wide.jpg";
import departmentBambinoWide from "@/assets/department-bambino-wide.jpg";
import {
  bestSellers,
  campaigns,
  departments,
  editorialImage,
  newArrivals,
  promoProducts,
  type Product,
} from "@/lib/catalog";

export const Route = createFileRoute("/")({
  head: () => {
    const title = "MyBrand Italia — moda multibrand donna, uomo e bambino";
    const description =
      "Novità, promozioni e i migliori brand fashion: Peuterey, EA7, The North Face, K-Way, Liu Jo e molti altri. Spedizione tracciata in tutta Italia.";
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
  component: Home,
});

function Home() {
  const hero = campaigns[0]!;
  const promo = campaigns[1]!;

  /** Selezione generale, con priorità commerciale Uomo senza reparto preselezionato. */
  const prioritize = (list: Product[]) => {
    const ordered = [...list.filter((p) => p.department === "uomo"), ...list.filter((p) => p.department !== "uomo")];
    return Array.from(new Map(ordered.map((p) => [p.slug, p])).values()).slice(0, 10);
  };
  const news = prioritize(newArrivals());
  const best = prioritize(bestSellers());
  const promoList = prioritize(promoProducts());
  const departmentImages = {
    uomo: departmentUomoWide,
    donna: departmentDonnaWide,
    bambino: departmentBambinoWide,
  };

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative">
        <picture>
          {hero.imageMobile && <source media="(max-width: 767px)" srcSet={hero.imageMobile} />}
          <img
            src={hero.image}
            alt={hero.headline}
            width={1920}
            height={1080}
            // eslint-disable-next-line react/no-unknown-property
            fetchPriority="high"
            className="h-[calc(100svh-7.75rem)] min-h-[560px] w-full object-cover object-top md:h-[calc(100svh-8.5rem)] md:min-h-[620px]"
          />
        </picture>
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-foreground/75 via-foreground/20 to-transparent">
          <div className="container-mb pb-8 md:pb-12">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-background/90">
              {hero.label}
            </span>
            <h1 className="mt-2 max-w-xl text-3xl font-semibold leading-[1.05] tracking-tight text-background md:text-5xl">
              {hero.headline}
            </h1>
            <p className="mt-2 max-w-sm text-sm text-background/85 md:text-base">{hero.copy}</p>
            <div className="mt-5 grid grid-cols-3 gap-2 md:flex md:flex-wrap">
              {[...hero.cta].sort((a, b) => Number(b.to === "uomo") - Number(a.to === "uomo")).map((c) => (
                <Link
                  key={c.to}
                  to="/reparto/$slug"
                  params={{ slug: c.to }}
                  className="flex h-12 items-center justify-center bg-background px-2 text-center text-xs font-semibold text-foreground md:flex-none md:px-6 md:text-sm"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ACCESSO RAPIDO AI REPARTI — griglia cromatica dinamica */}
      <section className="bg-surface py-5 md:py-10">
        <div className="container-mb grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-5">
          {[...departments].sort((a, b) => Number(b.slug === "uomo") - Number(a.slug === "uomo")).map((d) => (
            <Link
              key={d.slug}
              to="/reparto/$slug"
              params={{ slug: d.slug }}
              className={`group relative overflow-hidden ${d.slug === "uomo" ? "col-span-2 md:col-span-7 md:row-span-2" : "md:col-span-5"}`}
            >
              <div className={d.slug === "uomo" ? "bg-foreground" : d.slug === "donna" ? "bg-brand-red" : "bg-background"}>
                <img
                  src={departmentImages[d.slug]}
                  alt={d.label}
                  width={800}
                  height={900}
                  loading="lazy"
                  className={`w-full object-contain transition-transform duration-500 group-hover:scale-[1.025] ${d.slug === "uomo" ? "aspect-[16/9] md:aspect-[4/3]" : "aspect-[16/9]"}`}
                />
              </div>
              <div className={`absolute inset-x-0 bottom-0 flex items-end justify-between p-4 md:p-6 ${d.slug !== "bambino" ? "text-background" : "text-foreground"}`}>
                <div><span className="text-[11px] font-bold uppercase tracking-[0.16em]">Esplora</span><h2 className="mt-1 text-2xl font-extrabold uppercase md:text-4xl">{d.label}</h2></div>
                <span className={`flex h-11 w-11 items-center justify-center rounded-full ${d.slug !== "bambino" ? "bg-background text-foreground" : "bg-foreground text-background"}`}><ArrowRight className="h-5 w-5" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* NOVITÀ */}
      <div className="border-y-8 border-brand-red bg-background"><ProductCarousel
        eyebrow="Appena arrivati"
        title="Novità"
        products={news}
      /></div>

      {/* BRAND */}
      <div className="border-t-8 border-foreground"><BrandCarousel /></div>

      {/* BEST SELLER */}
      <div className="bg-background"><ProductCarousel
        eyebrow="I più amati"
        title="Best seller"
        products={best}
      /></div>

      {/* PROMO ATTIVA */}
      <section className="bg-brand-red py-8 md:py-12">
        <div className="container-mb"><Link to="/promo/$slug" params={{ slug: promo.slug }} className="group relative block overflow-hidden">
          <img
            src={promo.image}
            alt={promo.headline}
            width={1600}
            height={900}
            loading="lazy"
            className="aspect-[4/5] w-full bg-surface object-contain sm:aspect-[16/7]"
          />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-foreground/75 to-transparent p-5 md:p-8">
            <span className="inline-flex h-6 w-fit items-center bg-[color:var(--color-sale)] px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-background">
              {promo.label}
            </span>
            <h2 className="mt-2 max-w-md text-2xl font-semibold tracking-tight text-background md:text-4xl">
              {promo.headline}
            </h2>
            <p className="mt-1 max-w-md text-sm text-background/85">{promo.copy}</p>
            <span className="mt-4 flex h-12 w-fit items-center bg-background px-6 text-sm font-semibold">
              Scopri la promo
            </span>
          </div>
        </Link></div>
      </section>

      <div className="bg-surface"><ProductCarousel eyebrow="In promozione" title="Prezzi ridotti" products={promoList} /></div>

      {/* EDITORIALE */}
      <section className="border-y-8 border-brand-red bg-foreground py-10 md:py-14">
        <div className="container-mb grid items-center gap-6 md:grid-cols-2">
          <img
            src={editorialImage}
            alt="Ispirazione stagionale"
            width={1600}
            height={1000}
            loading="lazy"
            className="aspect-[4/3] w-full bg-surface object-contain"
          />
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-background/70">
              Ispirazione
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-background md:text-3xl">
              Il layering dell'autunno
            </h2>
            <p className="mt-2 max-w-md text-sm text-background/80">
              Giubbotti tecnici, maglieria e denim: come combinare i capi dei brand del momento. PLACEHOLDER:
              contenuto editoriale gestito da backend.
            </p>
            <Link
              to="/categoria/$slug"
              params={{ slug: "uomo" }}
              search={{ cat: "giubbotti" }}
              className="mt-5 inline-flex h-12 items-center bg-background px-6 text-sm font-semibold text-foreground"
            >
              Scopri il look
            </Link>
          </div>
        </div>
      </section>

      <RecentlyViewed />
      <TrustBar />
    </SiteLayout>
  );
}
