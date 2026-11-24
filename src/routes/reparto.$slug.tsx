import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCarousel } from "@/components/site/ProductCarousel";
import { BrandCarousel } from "@/components/site/BrandCarousel";
import { EditorialBlock } from "@/components/site/EditorialBlock";
import { PromoBanner } from "@/components/site/PromoBanner";
import { SectionHeader } from "@/components/site/SectionHeader";
import { TrustBar } from "@/components/site/TrustBar";
import departmentUomoWide from "@/assets/department-uomo-wide.jpg";
import departmentDonnaWide from "@/assets/department-donna-wide.jpg";
import departmentBambinoWide from "@/assets/department-bambino-wide.jpg";
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
      return {
        meta: [
          { title: "Reparto non trovato — MyBrand Italia" },
          { name: "robots", content: "noindex" },
        ],
      };
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

/** Aspetto dell'apertura per reparto: fondo, pulsante principale e foto. */
const HERO: Record<DepartmentSlug, { tone: string; primary: string; image: string }> = {
  uomo: {
    tone: "bg-foreground text-background",
    primary: "btn-inverse",
    image: departmentUomoWide,
  },
  donna: {
    tone: "bg-brand-red text-brand-red-foreground",
    primary: "btn-inverse",
    image: departmentDonnaWide,
  },
  bambino: {
    tone: "bg-surface text-foreground",
    primary: "btn-primary h-12 py-0",
    image: departmentBambinoWide,
  },
};

/** Fascia scura con testata chiara, per i blocchi di accesso alle categorie. */
function DarkBand({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-foreground py-9 text-background md:py-14">
      <div className="container-mb">
        <p className="eyebrow-wide text-background/70">{eyebrow}</p>
        <h2 className="mt-1 text-xl font-semibold leading-7 tracking-tight md:text-2xl md:leading-8">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

function DepartmentHome() {
  const { dep, label } = Route.useLoaderData();
  const { setDepartment } = useStore();

  useEffect(() => {
    setDepartment(dep);
  }, [dep, setDepartment]);

  const promo = campaigns[1]!;
  const copy = categoryCopy(dep);
  const depProducts = productsByDepartment(dep);
  const hero = HERO[dep];

  const pick = (list: Product[], fill = true) => {
    const inDep = list.filter((p) => p.department === dep);
    // catalogo demo corto: la riga si completa con altri capi dello stesso reparto, mai di un altro;
    // `fill = false` dove il titolo promette un criterio preciso (prezzi ridotti)
    const source = inDep.length >= 4 || !fill ? inDep : [...inDep, ...depProducts];
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

  const listing = { to: "/categoria/$slug", toParams: { slug: dep } };
  const tileLabel = "mt-2 block text-sm font-semibold uppercase tracking-[0.08em]";

  return (
    <SiteLayout>
      {/* APERTURA DEL REPARTO */}
      <section className={`${hero.tone} overflow-hidden`}>
        <div className="container-mb grid items-stretch md:min-h-[520px] md:grid-cols-12">
          <div className="flex flex-col justify-center py-10 md:col-span-5 md:py-16">
            <span className="eyebrow-wide opacity-80">Nuova stagione · Reparto</span>
            <h1 className="mt-3 text-5xl font-extrabold uppercase leading-none md:text-7xl md:leading-none">
              {label}
            </h1>
            <p className="mt-4 max-w-md text-sm font-medium leading-relaxed md:text-base">
              {copy.short}
            </p>
            <div className="mt-7 grid grid-cols-2 gap-2 md:flex md:flex-wrap">
              <Link
                to="/categoria/$slug"
                params={{ slug: dep }}
                search={{ novita: "1" }}
                className={`${hero.primary} px-3 md:px-6`}
              >
                Novità {label.toLowerCase()}
              </Link>
              <Link
                to="/categoria/$slug"
                params={{ slug: dep }}
                className="inline-flex h-12 items-center justify-center border border-current px-3 text-sm font-semibold transition-colors hover:bg-current/10 md:px-6"
              >
                Tutto il reparto
              </Link>
            </div>
          </div>
          <div className="relative min-h-[300px] md:col-span-7 md:min-h-[520px]">
            <img
              src={hero.image}
              alt={label}
              width={1200}
              height={688}
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* Accessi rapidi alle categorie del reparto */}
      <nav aria-label={`Categorie ${label}`} className="border-b border-border bg-background">
        <div className="container-mb no-scrollbar flex gap-2 overflow-x-auto py-3 md:flex-wrap md:overflow-visible">
          {quickCats.map((c) => (
            <Link
              key={c.slug}
              to="/categoria/$slug"
              params={{ slug: dep }}
              search={{ cat: c.slug }}
              className="chip"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </nav>

      {dep === "donna" && (
        <>
          <section className="bg-background py-8 md:py-12">
            <div className="container-mb">
              <SectionHeader eyebrow="Ispirazione donna" title="Costruisci il tuo look" />
              <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
                {shopByCategory.slice(0, 4).map((category) => (
                  <Link
                    key={category.slug}
                    to="/categoria/$slug"
                    params={{ slug: dep }}
                    search={{ cat: category.slug }}
                    className="group"
                  >
                    <img
                      src={categoryImage(category.slug)}
                      alt=""
                      width={700}
                      height={933}
                      loading="lazy"
                      className="aspect-[3/4] w-full bg-surface object-contain"
                    />
                    <span className={`${tileLabel} underline-offset-4 group-hover:underline`}>
                      {category.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
          <div className="border-y-8 border-brand-red">
            <ProductCarousel
              eyebrow="Nuova stagione"
              title="Novità donna"
              products={pick(newArrivals())}
              {...listing}
              toSearch={{ novita: "1" }}
            />
          </div>
          <BrandCarousel />
          <EditorialBlock
            image={editorialImage}
            imageAlt="Ispirazione outfit donna"
            eyebrow="Outfit del momento"
            title="Nuovi equilibri, nuovi abbinamenti"
            copy="Capi e accessori da combinare per la nuova stagione."
            cta={{
              label: "Scopri la selezione",
              to: "/categoria/$slug",
              params: { slug: dep },
              search: { cat: "giacche" },
            }}
          />
          <div className="bg-surface">
            <ProductCarousel
              eyebrow="Scelti da voi"
              title="Best seller donna"
              products={pick(bestSellers())}
              {...listing}
              toSearch={{ sort: "venduti" }}
            />
          </div>
          <PromoBanner campaign={promo} />
        </>
      )}

      {dep === "uomo" && (
        <>
          <DarkBand eyebrow="Trova subito quello che cerchi" title="Categorie uomo">
            <div className="mt-5 grid gap-px bg-background/20 md:grid-cols-3">
              {groups.map((group) => (
                <div key={group.slug} className="bg-background p-5 text-foreground md:p-7">
                  <h3 className="label-caps font-display text-sm">{group.label}</h3>
                  <div className="mt-3 grid grid-cols-2 gap-x-4">
                    {group.items.slice(0, 8).map((item) => (
                      <Link
                        key={item.slug}
                        to="/categoria/$slug"
                        params={{ slug: dep }}
                        search={{ cat: item.slug }}
                        className="flex min-h-11 items-center border-b border-border text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </DarkBand>
          <div className="border-b-8 border-brand-red">
            <ProductCarousel
              eyebrow="I più scelti"
              title="Best seller uomo"
              products={pick(bestSellers())}
              {...listing}
              toSearch={{ sort: "venduti" }}
            />
          </div>
          <BrandCarousel />
          <div className="bg-surface">
            <ProductCarousel
              eyebrow="Appena arrivati"
              title="Novità uomo"
              products={pick(newArrivals())}
              {...listing}
              toSearch={{ novita: "1" }}
            />
          </div>
          <PromoBanner campaign={promo} />
          <div className="bg-surface">
            <ProductCarousel
              eyebrow="Occasioni"
              title="Prezzi ridotti uomo"
              products={pick(promoProducts(), false)}
              {...listing}
              toSearch={{ sconto: "1" }}
            />
          </div>
        </>
      )}

      {dep === "bambino" && (
        <>
          <DarkBand eyebrow="Per ogni giornata" title="Vestirsi diventa facile">
            <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
              {[
                { label: "Scuola", slug: "felpe" },
                { label: "Tempo libero", slug: "t-shirt" },
                { label: "Primi freddi", slug: "giubbotti" },
                { label: "Ogni giorno", slug: "sneakers" },
              ].map((item) => (
                <Link
                  key={item.label}
                  to="/categoria/$slug"
                  params={{ slug: dep }}
                  search={{ cat: item.slug }}
                  className="group bg-background p-3 text-foreground md:p-4"
                >
                  <img
                    src={categoryImage(item.slug)}
                    alt=""
                    width={500}
                    height={500}
                    loading="lazy"
                    className="aspect-square w-full object-contain"
                  />
                  <span
                    className={`${tileLabel} text-center underline-offset-4 group-hover:underline`}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </DarkBand>
          <ProductCarousel
            eyebrow="Per i più piccoli"
            title="Novità bambino"
            products={pick(newArrivals())}
            {...listing}
            toSearch={{ novita: "1" }}
          />
          <section className="bg-brand-red py-8 md:py-12">
            <div className="container-mb grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4">
              {shopByCategory.map((category) => (
                <Link
                  key={category.slug}
                  to="/categoria/$slug"
                  params={{ slug: dep }}
                  search={{ cat: category.slug }}
                  className="group bg-background p-3 text-foreground focus-visible:outline-background"
                >
                  <img
                    src={categoryImage(category.slug)}
                    alt=""
                    width={600}
                    height={600}
                    loading="lazy"
                    className="aspect-square w-full object-contain"
                  />
                  <span className={`${tileLabel} underline-offset-4 group-hover:underline`}>
                    {category.label}
                  </span>
                </Link>
              ))}
            </div>
          </section>
          <div className="bg-surface">
            <ProductCarousel
              eyebrow="Sempre utili"
              title="I più scelti per bambino"
              products={pick(bestSellers())}
              {...listing}
              toSearch={{ sort: "venduti" }}
            />
          </div>
          <PromoBanner campaign={promo} />
          <BrandCarousel />
        </>
      )}

      <TrustBar />
    </SiteLayout>
  );
}
