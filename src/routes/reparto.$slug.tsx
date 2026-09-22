import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCarousel } from "@/components/site/ProductCarousel";
import { BrandCarousel } from "@/components/site/BrandCarousel";
import { RecentlyViewed } from "@/components/site/RecentlyViewed";
import { TrustBar } from "@/components/site/TrustBar";
import {
  bestSellers,
  campaigns,
  categoryCopy,
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

export const Route = createFileRoute("/reparto/$slug")({
  loader: ({ params }) => {
    const dep = departments.find((d) => d.slug === params.slug);
    if (!dep) throw notFound();
    return { dep: dep.slug as DepartmentSlug, label: dep.label, image: dep.image };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Reparto non trovato — MyBrand Italia" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.label} — novità, brand e promozioni | MyBrand Italia`;
    const description = `Scopri il reparto ${loaderData.label.toLowerCase()}: nuovi arrivi, abbigliamento, calzature, accessori e i brand più richiesti su MyBrand Italia.`;
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
  component: DepartmentHome,
});

function DepartmentHome() {
  const { dep, label, image } = Route.useLoaderData();
  const { setDepartment } = useStore();

  useEffect(() => {
    setDepartment(dep);
  }, [dep, setDepartment]);

  const promo = campaigns[1]!;
  const copy = categoryCopy(dep);
  const depProducts = productsByDepartment(dep);

  const pick = (list: Product[]) => {
    const inDep = list.filter((p) => p.department === dep);
    const source = inDep.length >= 4 ? inDep : [...inDep, ...list.filter((p) => p.department !== dep)];
    return Array.from(new Map(source.map((p) => [p.slug, p])).values()).slice(0, 10);
  };

  const groups = navTree[dep];
  const quickCats = groups.flatMap((g) => g.items).slice(0, 12);
  const shopByCategory = [
    ...(groups[0]?.items.slice(0, 3) ?? []),
    ...(groups[1]?.items.slice(0, 2) ?? []),
    ...(groups[2]?.items.slice(0, 1) ?? []),
  ];

  return (
    <SiteLayout>
      {/* HERO REPARTO */}
      <section className="relative">
        <img
          src={image}
          alt={label}
          width={1200}
          height={900}
          // eslint-disable-next-line react/no-unknown-property
          fetchPriority="high"
          className="h-[46vh] w-full bg-surface object-contain md:h-[52vh]"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-foreground/75 via-foreground/20 to-transparent">
          <div className="container-mb pb-6 md:pb-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-background/90">
              Reparto
            </span>
            <h1 className="mt-1 text-3xl font-semibold leading-[1.05] tracking-tight text-background md:text-5xl">
              {label}
            </h1>
            <p className="mt-2 max-w-md text-sm text-background/85">{copy.short}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                to="/categoria/$slug"
                params={{ slug: dep }}
                search={{ novita: "1" }}
                className="flex h-12 min-w-[46%] flex-1 items-center justify-center bg-background px-5 text-sm font-semibold text-foreground md:min-w-0 md:flex-none md:px-6"
              >
                Novità {label}
              </Link>
              <Link
                to="/categoria/$slug"
                params={{ slug: dep }}
                className="flex h-12 min-w-[46%] flex-1 items-center justify-center border border-background px-5 text-sm font-semibold text-background md:min-w-0 md:flex-none md:px-6"
              >
                Tutto il reparto
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIE RAPIDE (scroll orizzontale su mobile) */}
      <section className="border-b border-border">
        <div className="container-mb flex gap-2 overflow-x-auto py-3 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-wrap md:overflow-visible">
          {quickCats.map((c) => (
            <Link
              key={c.slug}
              to="/categoria/$slug"
              params={{ slug: dep }}
              search={{ cat: c.slug }}
              className="flex h-10 shrink-0 items-center border border-border-strong px-4 text-xs font-medium uppercase tracking-[0.06em] hover:border-foreground"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      <ProductCarousel
        eyebrow="Appena arrivati"
        title={`Novità ${label}`}
        products={pick(newArrivals())}
        to="/categoria/$slug"
        toParams={{ slug: dep }}
      />

      {/* SHOP BY CATEGORY */}
      <section className="py-8 md:py-12">
        <div className="container-mb">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Scopri per categoria
          </div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">{label}, categoria per categoria</h2>
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

      <BrandCarousel />

      <ProductCarousel
        eyebrow="I più amati"
        title={`Best seller ${label}`}
        products={pick(bestSellers())}
        to="/categoria/$slug"
        toParams={{ slug: dep }}
      />

      {/* PROMO */}
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

      <ProductCarousel eyebrow="In promozione" title="Prezzi ridotti" products={pick(promoProducts())} />

      <RecentlyViewed />

      {/* DESCRIZIONE REPARTO */}
      <section className="container-mb py-8">
        <details className="border-t border-border pt-4">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
            {label} su MyBrand Italia
            <ArrowRight className="h-4 w-4 opacity-60" strokeWidth={1.5} />
          </summary>
          <div className="mt-3 max-w-3xl space-y-3 text-sm leading-relaxed text-muted-foreground">
            {copy.long.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </details>
      </section>

      <TrustBar />
    </SiteLayout>
  );
}
