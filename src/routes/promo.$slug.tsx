import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CatalogListing } from "@/components/site/CatalogListing";
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
      return { meta: [{ title: "Promozione non disponibile — MyBrand Italia" }, { name: "robots", content: "noindex" }] };
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
        <Link to="/" className="btn-primary mt-5 inline-flex">
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
      {/* hero compatto: i prodotti restano vicini */}
      <div className="relative">
        <picture>
          {campaign.imageMobile && <source media="(max-width: 767px)" srcSet={campaign.imageMobile} />}
          <img
            src={campaign.image}
            alt={campaign.headline}
            width={1600}
            height={700}
            className="h-[30vh] w-full object-cover md:h-[34vh]"
          />
        </picture>
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-foreground/75 to-transparent">
          <div className="container-mb pb-4">
            <span className="inline-flex h-6 items-center bg-[color:var(--color-sale)] px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-background">
              {campaign.label}
            </span>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-background md:text-4xl">
              {campaign.headline}
            </h1>
            <p className="mt-1 max-w-lg text-sm text-background/85">{campaign.copy}</p>
          </div>
        </div>
      </div>

      {campaign.quickCats && (
        <div className="flex gap-2 overflow-x-auto px-4 py-4 md:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {campaign.quickCats.map((c) => (
            <Link
              key={`${c.dep}-${c.slug}`}
              to="/categoria/$slug"
              params={{ slug: c.dep }}
              search={{ cat: c.slug, sconto: "1" }}
              className="flex h-10 shrink-0 items-center border border-border px-3 text-xs font-medium"
            >
              {c.label} {c.dep}
            </Link>
          ))}
        </div>
      )}

      <CatalogListing all={all} value={search} onChange={onChange} onClear={onClear} />

      <RecentlyViewed />
      <TrustBar />
    </SiteLayout>
  );
}
