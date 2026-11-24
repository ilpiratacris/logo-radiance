import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CatalogListing } from "@/components/site/CatalogListing";
import { PromoLabel } from "@/components/site/PromoBanner";
import { RecentlyViewed } from "@/components/site/RecentlyViewed";
import { TrustBar } from "@/components/site/TrustBar";
import { campaigns, promoProducts } from "@/lib/catalog";
import { validatePlpSearch, type PlpSearch } from "@/lib/filters";

export const Route = createFileRoute("/promo/$slug")({
  validateSearch: (raw: Record<string, unknown>) => validatePlpSearch(raw),
  loader: ({ params }) => {
    const c = campaigns.find((x) => x.slug === params.slug);
    if (!c) throw notFound();
    return { label: c.label, headline: c.headline, copy: c.copy };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Promozione non disponibile — MyBrand Italia" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.label} — ${loaderData.headline} | MyBrand Italia`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.copy },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.copy },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-mb py-20 text-center">
        <h1 className="text-xl font-semibold">Promozione non disponibile</h1>
        <Link to="/" className="btn-primary mt-5">
          Torna alla home
        </Link>
      </div>
    </SiteLayout>
  ),
  component: PromoPage,
});

function PromoPage() {
  const { slug } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/promo/$slug" });
  const campaign = campaigns.find((c) => c.slug === slug)!;
  const all = promoProducts();

  const onChange = (patch: Partial<PlpSearch>) =>
    navigate({ params: { slug }, search: (prev) => ({ ...prev, ...patch }), resetScroll: false });
  const onClear = () => navigate({ params: { slug }, search: {}, resetScroll: false });

  return (
    <SiteLayout>
      {/* apertura compatta: i prodotti restano vicini */}
      <section className="relative">
        <picture>
          {campaign.imageMobile && (
            <source media="(max-width: 767px)" srcSet={campaign.imageMobile} />
          )}
          <img
            src={campaign.image}
            alt=""
            width={1600}
            height={700}
            fetchPriority="high"
            className="h-[260px] w-full object-cover md:h-[320px]"
          />
        </picture>
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-foreground/75 to-transparent">
          <div className="container-mb pb-5 md:pb-8">
            <PromoLabel>{campaign.label}</PromoLabel>
            <h1 className="mt-2 max-w-xl text-2xl font-semibold leading-8 tracking-tight text-background md:text-4xl md:leading-10">
              {campaign.headline}
            </h1>
            <p className="mt-1 max-w-md text-sm text-background">{campaign.copy}</p>
          </div>
        </div>
      </section>

      {campaign.quickCats && (
        <nav
          aria-label="Categorie in promozione"
          className="container-mb no-scrollbar flex gap-2 overflow-x-auto py-4 md:flex-wrap"
        >
          {campaign.quickCats.map((c) => (
            <Link
              key={`${c.dep}-${c.slug}`}
              to="/categoria/$slug"
              params={{ slug: c.dep }}
              search={{ cat: c.slug, sconto: "1" }}
              className="chip"
            >
              {c.label} {c.dep}
            </Link>
          ))}
        </nav>
      )}

      <CatalogListing all={all} value={search} onChange={onChange} onClear={onClear} />

      <RecentlyViewed />
      <TrustBar />
    </SiteLayout>
  );
}
