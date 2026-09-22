import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCarousel } from "@/components/site/ProductCarousel";
import { BrandCarousel } from "@/components/site/BrandCarousel";
import { RecentlyViewed } from "@/components/site/RecentlyViewed";
import { TrustBar } from "@/components/site/TrustBar";
import {
  bestSellers,
  campaigns,
  departments,
  editorialImage,
  navTree,
  newArrivals,
  productsByDepartment,
  promoProducts,
  type DepartmentSlug,
  type Product,
} from "@/lib/catalog";
import { useStore } from "@/lib/store";

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
  const { department, hydrated } = useStore();
  const dep: DepartmentSlug = hydrated ? department : "donna";
  const depLabel = departments.find((d) => d.slug === dep)!.label;

  const hero = campaigns[0]!;
  const promo = campaigns[1]!;

  const depProducts = productsByDepartment(dep);
  /** priorità al reparto attivo, senza duplicati */
  const prioritize = (list: Product[]) => {
    const ordered = [...list.filter((p) => p.department === dep), ...list.filter((p) => p.department !== dep)];
    return Array.from(new Map(ordered.map((p) => [p.slug, p])).values()).slice(0, 10);
  };
  const news = prioritize(newArrivals());
  const best = prioritize(bestSellers());
  const promoList = prioritize(promoProducts());

  const shopByCategory = navTree[dep][0]!.items.slice(0, 3)
    .concat(navTree[dep][1]!.items.slice(0, 2))
    .concat(navTree[dep][2]!.items.slice(0, 1));

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
              {hero.cta.map((c) => (
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

      {/* ACCESSO RAPIDO AI REPARTI */}
      <section className="container-mb py-6">
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {departments.map((d) => (
            <Link key={d.slug} to="/reparto/$slug" params={{ slug: d.slug }} className="group block">
              <img
                src={d.image}
                alt={d.label}
                width={600}
                height={750}
                loading="lazy"
                className="aspect-[4/5] w-full bg-surface object-contain md:aspect-[3/4]"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-[0.08em]">{d.label}</span>
                <ArrowRight className="h-4 w-4 opacity-60" strokeWidth={1.5} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* NOVITÀ */}
      <ProductCarousel
        eyebrow="Appena arrivati"
        title={`Novità ${depLabel}`}
        products={news}
        to="/categoria/$slug"
        toParams={{ slug: dep }}
      />

      {/* SHOP BY CATEGORY */}
      <section className="py-8 md:py-12">
        <div className="container-mb">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Scopri per categoria
          </div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">{depLabel}, reparto per reparto</h2>
        </div>
        <div className="container-mb mt-4 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4">
          {shopByCategory.map((c, i) => {
            const img = depProducts.find((p) => p.category === c.slug)?.variants[0]?.image ?? editorialImage;
            return (
              <Link
                key={c.slug}
                to="/categoria/$slug"
                params={{ slug: dep }}
                search={{ cat: c.slug }}
                className="group relative overflow-hidden"
              >
                <img
                  src={img}
                  alt={c.label}
                  width={600}
                  height={600}
                  loading={i < 2 ? "eager" : "lazy"}
                  className="aspect-square w-full bg-surface object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute bottom-0 left-0 m-2 bg-background px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.06em]">
                  {c.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* BRAND */}
      <BrandCarousel />

      {/* BEST SELLER */}
      <ProductCarousel
        eyebrow="I più amati"
        title="Best seller"
        products={best}
        to="/categoria/$slug"
        toParams={{ slug: dep }}
      />

      {/* PROMO ATTIVA */}
      <section className="container-mb py-8 md:py-12">
        <Link to="/promo/$slug" params={{ slug: promo.slug }} className="group relative block overflow-hidden">
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
        </Link>
      </section>

      <ProductCarousel eyebrow="In promozione" title="Prezzi ridotti" products={promoList} />

      {/* EDITORIALE */}
      <section className="bg-foreground py-10 md:py-14">
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
              params={{ slug: dep }}
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
