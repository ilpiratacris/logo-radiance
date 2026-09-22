import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCarousel } from "@/components/site/ProductCarousel";
import { BrandCarousel } from "@/components/site/BrandCarousel";
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

  const categoryImage = (slug: string) =>
    depProducts.find((product) => product.category === slug)?.variants[0]?.image ?? editorialImage;

  const categoryLink = (slug: string, labelText: string, className = "") => (
    <Link
      key={slug}
      to="/categoria/$slug"
      params={{ slug: dep }}
      search={{ cat: slug }}
      className={className}
    >
      {labelText}
    </Link>
  );

  const promoBlock = (
    <section className="py-8 md:py-12">
      <Link to="/promo/$slug" params={{ slug: promo.slug }} className="group relative block overflow-hidden">
        <img
          src={promo.image}
          alt={promo.headline}
          width={1600}
          height={900}
          loading="lazy"
          className="aspect-[4/5] w-full bg-surface object-contain sm:aspect-[16/7]"
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-foreground/75 to-transparent p-5 md:p-8 lg:px-[max(2rem,calc((100vw-1440px)/2+2rem))]">
          <span className="inline-flex h-6 w-fit items-center bg-[color:var(--color-sale)] px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-background">
            {promo.label}
          </span>
          <h2 className="mt-2 max-w-md text-2xl font-semibold text-background md:text-4xl">{promo.headline}</h2>
          <p className="mt-1 max-w-md text-sm text-background/85">{promo.copy}</p>
          <span className="mt-4 flex h-12 w-fit items-center bg-background px-6 text-sm font-semibold text-foreground">
            Scopri la promo
          </span>
        </div>
      </Link>
    </section>
  );

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

      {/* Accessi rapidi comuni, contenuti e gerarchia restano specifici per reparto */}
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

      {dep === "donna" && (
        <>
          <section className="py-8 md:py-12">
            <div className="container-mb">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Ispirazione donna</p>
              <h2 className="mt-1 text-xl font-semibold md:text-3xl">Costruisci il tuo look</h2>
              <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
                {shopByCategory.slice(0, 4).map((category, index) => (
                  <Link key={category.slug} to="/categoria/$slug" params={{ slug: dep }} search={{ cat: category.slug }} className={index === 0 ? "group col-span-2 md:row-span-2" : "group"}>
                    <img src={categoryImage(category.slug)} alt={category.label} width={700} height={850} className="aspect-[4/5] w-full bg-surface object-contain" />
                    <span className="mt-2 block text-sm font-semibold uppercase">{category.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
          <ProductCarousel eyebrow="Nuova stagione" title="Novità Donna" products={pick(newArrivals())} to="/categoria/$slug" toParams={{ slug: dep }} />
          <section className="bg-foreground py-10 text-background md:py-14">
            <div className="container-mb grid items-center gap-6 md:grid-cols-[1.25fr_.75fr]">
              <img src={editorialImage} alt="Ispirazione outfit donna" width={1600} height={1000} loading="lazy" className="aspect-[4/3] w-full object-contain" />
              <div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-background/70">Outfit del momento</p><h2 className="mt-2 text-2xl font-semibold md:text-4xl">Nuovi equilibri, nuovi abbinamenti</h2><p className="mt-3 text-sm text-background/80">Capi e accessori da combinare per la nuova stagione.</p>{categoryLink("giacche", "Scopri la selezione", "mt-5 inline-flex h-12 items-center bg-background px-6 text-sm font-semibold text-foreground")}</div>
            </div>
          </section>
          <BrandCarousel />
          <ProductCarousel eyebrow="Scelti da voi" title="Best seller Donna" products={pick(bestSellers())} />
          {promoBlock}
        </>
      )}

      {dep === "uomo" && (
        <>
          <section className="container-mb py-9 md:py-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Trova subito quello che cerchi</p>
            <h2 className="mt-1 text-xl font-semibold md:text-3xl">Categorie Uomo</h2>
            <div className="mt-5 grid gap-px bg-border md:grid-cols-3">
              {groups.map((group) => (
                <div key={group.slug} className="bg-background p-5 md:p-7">
                  <h3 className="text-base font-semibold uppercase">{group.label}</h3>
                  <div className="mt-3 grid grid-cols-2 gap-x-4">
                    {group.items.slice(0, 8).map((item) => categoryLink(item.slug, item.label, "flex min-h-11 items-center border-b border-border text-sm hover:underline"))}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <ProductCarousel eyebrow="I più scelti" title="Best seller Uomo" products={pick(bestSellers())} to="/categoria/$slug" toParams={{ slug: dep }} />
          <BrandCarousel />
          <ProductCarousel eyebrow="Appena arrivati" title="Novità Uomo" products={pick(newArrivals())} />
          {promoBlock}
          <ProductCarousel eyebrow="Occasioni" title="Prezzi ridotti Uomo" products={pick(promoProducts())} />
        </>
      )}

      {dep === "bambino" && (
        <>
          <section className="bg-surface py-9 md:py-14">
            <div className="container-mb">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Per ogni giornata</p>
              <h2 className="mt-1 text-xl font-semibold md:text-3xl">Vestirsi diventa facile</h2>
              <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
                {[{ label: "Scuola", slug: "felpe" }, { label: "Tempo libero", slug: "t-shirt" }, { label: "Primi freddi", slug: "giubbotti" }, { label: "Ogni giorno", slug: "sneakers" }].map((item) => (
                  <Link key={item.label} to="/categoria/$slug" params={{ slug: dep }} search={{ cat: item.slug }} className="bg-background p-3 md:p-4">
                    <img src={categoryImage(item.slug)} alt={item.label} width={500} height={600} className="aspect-square w-full object-contain" />
                    <span className="mt-3 block text-center text-sm font-semibold uppercase">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
          <ProductCarousel eyebrow="Per i più piccoli" title="Novità Bambino" products={pick(newArrivals())} to="/categoria/$slug" toParams={{ slug: dep }} />
          <section className="container-mb py-8 md:py-12">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4">
              {shopByCategory.map((category) => (
                <Link key={category.slug} to="/categoria/$slug" params={{ slug: dep }} search={{ cat: category.slug }} className="border border-border p-3">
                  <img src={categoryImage(category.slug)} alt={category.label} width={600} height={600} loading="lazy" className="aspect-square w-full object-contain" />
                  <span className="mt-2 block text-sm font-semibold">{category.label}</span>
                </Link>
              ))}
            </div>
          </section>
          {promoBlock}
          <ProductCarousel eyebrow="Sempre utili" title="I più scelti per Bambino" products={pick(bestSellers())} />
          <BrandCarousel />
        </>
      )}

      <TrustBar />
    </SiteLayout>
  );
}
