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
      </Link></div>
    </section>
  );

  const heroTone = dep === "donna" ? "bg-brand-pink" : dep === "uomo" ? "bg-foreground text-background" : "bg-brand-yellow";

  return (
    <SiteLayout>
      {/* HERO REPARTO */}
      <section className={`${heroTone} overflow-hidden`}>
        <div className="container-mb grid min-h-[520px] items-stretch md:grid-cols-12">
          <div className="flex flex-col justify-center py-10 md:col-span-5 md:py-16">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] opacity-70">Nuova stagione · Reparto</span>
            <h1 className="mt-3 text-5xl font-extrabold uppercase leading-none md:text-7xl">{label}</h1>
            <p className="mt-4 max-w-md text-base font-medium opacity-80">{copy.short}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              <Link
                to="/categoria/$slug"
                params={{ slug: dep }}
                search={{ novita: "1" }}
                className="flex h-12 min-w-[46%] flex-1 items-center justify-center bg-foreground px-5 text-sm font-bold text-background md:min-w-0 md:flex-none md:px-6"
              >
                Novità {label}
              </Link>
              <Link
                to="/categoria/$slug"
                params={{ slug: dep }}
                className="flex h-12 min-w-[46%] flex-1 items-center justify-center border-2 border-current px-5 text-sm font-bold md:min-w-0 md:flex-none md:px-6"
              >
                Tutto il reparto
              </Link>
            </div>
          </div>
          <div className="relative min-h-[340px] md:col-span-7 md:min-h-[520px]">
            <img src={image} alt={label} width={1200} height={900} fetchPriority="high" className="absolute inset-0 h-full w-full object-contain transition-transform duration-700 hover:scale-[1.025]" />
            <span className="absolute bottom-3 right-3 text-5xl font-extrabold uppercase opacity-10 md:text-8xl">MyBrand</span>
          </div>
        </div>
      </section>

      {/* Accessi rapidi comuni, contenuti e gerarchia restano specifici per reparto */}
      <section className="border-b-4 border-foreground bg-background">
        <div className="container-mb flex gap-2 overflow-x-auto py-3 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-wrap md:overflow-visible">
          {quickCats.map((c) => (
            <Link
              key={c.slug}
              to="/categoria/$slug"
              params={{ slug: dep }}
              search={{ cat: c.slug }}
              className="flex h-11 shrink-0 items-center border-2 border-foreground px-4 text-xs font-bold uppercase tracking-[0.06em] hover:bg-foreground hover:text-background"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {dep === "donna" && (
        <>
          <section className="bg-brand-pink py-8 md:py-12">
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
           <div className="border-y-8 border-brand-red bg-background"><ProductCarousel eyebrow="Nuova stagione" title="Novità Donna" products={pick(newArrivals())} to="/categoria/$slug" toParams={{ slug: dep }} /></div>
           <section className="bg-brand-red py-10 text-background md:py-14">
            <div className="container-mb grid items-center gap-6 md:grid-cols-[1.25fr_.75fr]">
              <img src={editorialImage} alt="Ispirazione outfit donna" width={1600} height={1000} loading="lazy" className="aspect-[4/3] w-full object-contain" />
              <div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-background/70">Outfit del momento</p><h2 className="mt-2 text-2xl font-semibold md:text-4xl">Nuovi equilibri, nuovi abbinamenti</h2><p className="mt-3 text-sm text-background/80">Capi e accessori da combinare per la nuova stagione.</p>{categoryLink("giacche", "Scopri la selezione", "mt-5 inline-flex h-12 items-center bg-background px-6 text-sm font-semibold text-foreground")}</div>
            </div>
          </section>
          <BrandCarousel />
          <div className="bg-surface"><ProductCarousel eyebrow="Scelti da voi" title="Best seller Donna" products={pick(bestSellers())} /></div>
          {promoBlock}
        </>
      )}

      {dep === "uomo" && (
        <>
          <section className="bg-foreground py-9 text-background md:py-14">
            <div className="container-mb">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Trova subito quello che cerchi</p>
            <h2 className="mt-1 text-xl font-semibold md:text-3xl">Categorie Uomo</h2>
            <div className="mt-5 grid gap-px bg-border md:grid-cols-3">
              {groups.map((group) => (
                <div key={group.slug} className="bg-background p-5 text-foreground md:p-7">
                  <h3 className="text-base font-semibold uppercase">{group.label}</h3>
                  <div className="mt-3 grid grid-cols-2 gap-x-4">
                    {group.items.slice(0, 8).map((item) => categoryLink(item.slug, item.label, "flex min-h-11 items-center border-b border-border text-sm hover:underline"))}
                  </div>
                </div>
              ))}
            </div></div>
          </section>
          <div className="border-y-8 border-brand-blue bg-background"><ProductCarousel eyebrow="I più scelti" title="Best seller Uomo" products={pick(bestSellers())} to="/categoria/$slug" toParams={{ slug: dep }} /></div>
          <BrandCarousel />
          <div className="bg-surface"><ProductCarousel eyebrow="Appena arrivati" title="Novità Uomo" products={pick(newArrivals())} /></div>
          {promoBlock}
          <div className="bg-surface"><ProductCarousel eyebrow="Occasioni" title="Prezzi ridotti Uomo" products={pick(promoProducts())} /></div>
        </>
      )}

      {dep === "bambino" && (
        <>
          <section className="bg-brand-yellow py-9 md:py-14">
            <div className="container-mb">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Per ogni giornata</p>
              <h2 className="mt-1 text-xl font-semibold md:text-3xl">Vestirsi diventa facile</h2>
              <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
                {[{ label: "Scuola", slug: "felpe" }, { label: "Tempo libero", slug: "t-shirt" }, { label: "Primi freddi", slug: "giubbotti" }, { label: "Ogni giorno", slug: "sneakers" }].map((item) => (
                   <Link key={item.label} to="/categoria/$slug" params={{ slug: dep }} search={{ cat: item.slug }} className="group bg-background p-3 md:p-4">
                     <img src={categoryImage(item.slug)} alt={item.label} width={500} height={600} className="aspect-square w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]" />
                    <span className="mt-3 block text-center text-sm font-semibold uppercase">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
          <div className="bg-background"><ProductCarousel eyebrow="Per i più piccoli" title="Novità Bambino" products={pick(newArrivals())} to="/categoria/$slug" toParams={{ slug: dep }} /></div>
           <section className="bg-brand-red py-8 text-background md:py-12">
            <div className="container-mb grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4">
              {shopByCategory.map((category) => (
                <Link key={category.slug} to="/categoria/$slug" params={{ slug: dep }} search={{ cat: category.slug }} className="bg-background p-3 text-foreground">
                  <img src={categoryImage(category.slug)} alt={category.label} width={600} height={600} loading="lazy" className="aspect-square w-full object-contain" />
                  <span className="mt-2 block text-sm font-semibold">{category.label}</span>
                </Link>
              ))}
            </div>
          </section>
          {promoBlock}
          <div className="bg-surface"><ProductCarousel eyebrow="Sempre utili" title="I più scelti per Bambino" products={pick(bestSellers())} /></div>
          <BrandCarousel />
        </>
      )}

      <TrustBar />
    </SiteLayout>
  );
}
