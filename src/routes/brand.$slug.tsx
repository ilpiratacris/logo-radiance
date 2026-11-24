import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { CatalogListing } from "@/components/site/CatalogListing";
import { RecentlyViewed } from "@/components/site/RecentlyViewed";
import { TrustBar } from "@/components/site/TrustBar";
import { brandBySlug, departments, productsByBrand } from "@/lib/catalog";
import { applyFilters, validatePlpSearch, type PlpSearch } from "@/lib/filters";

export const Route = createFileRoute("/brand/$slug")({
  validateSearch: (raw: Record<string, unknown>) => validatePlpSearch(raw),
  loader: ({ params }) => {
    const brand = brandBySlug(params.slug);
    if (!brand) throw notFound();
    return { name: brand.name };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Brand non trovato — MyBrand Italia" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.name} — collezione ufficiale | MyBrand Italia`;
    const description = `Acquista ${loaderData.name} su MyBrand Italia: abbigliamento, calzature e accessori. Filtra per reparto, taglia e colore.`;
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
  notFoundComponent: BrandNotFound,
  component: BrandPage,
});

function BrandNotFound() {
  return (
    <SiteLayout>
      <div className="container-mb py-20 text-center">
        <h1 className="text-xl font-semibold">Brand non disponibile</h1>
        <Link to="/brand" className="btn-primary mt-5">
          Vedi tutti i brand
        </Link>
      </div>
    </SiteLayout>
  );
}

function BrandPage() {
  const { slug } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/brand/$slug" });
  const brand = brandBySlug(slug)!;
  const all = productsByBrand(slug);
  const count = applyFilters(all, search).length;

  const onChange = (patch: Partial<PlpSearch>) =>
    navigate({ params: { slug }, search: (prev) => ({ ...prev, ...patch }), resetScroll: false });
  const onClear = () => navigate({ params: { slug }, search: {}, resetScroll: false });

  const deps = departments.filter((d) => all.some((p) => p.department === d.slug));

  return (
    <SiteLayout>
      <div className="container-mb flex flex-col gap-3 py-4 lg:gap-4 lg:py-5">
        <Breadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: "Brand", to: "/brand" },
            { label: brand.name },
          ]}
        />
        <div className="flex flex-col gap-1.5 lg:gap-2">
          {brand.logo && (
            <img
              src={brand.logo}
              alt=""
              className="mb-1 h-9 w-auto max-w-[180px] self-start object-contain object-left brightness-0 lg:h-10"
            />
          )}
          <h1 className="text-2xl font-semibold leading-8 tracking-tight lg:text-3xl lg:leading-9">
            {brand.name}
          </h1>
          <p className="max-w-[640px] text-sm leading-5 text-muted-foreground">
            {brand.claim && <span className="max-lg:hidden">{brand.claim} </span>}
            <span className={brand.claim ? "lg:hidden" : ""}>
              {count} {count === 1 ? "prodotto" : "prodotti"}
            </span>
          </p>
        </div>

        {deps.length > 1 && (
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
            {deps.map((d) => (
              <Link
                key={d.slug}
                to="/categoria/$slug"
                params={{ slug: d.slug }}
                search={{ brand: slug }}
                className="chip"
              >
                {brand.name} {d.label.toLowerCase()}
              </Link>
            ))}
          </div>
        )}
      </div>

      <CatalogListing all={all} value={search} onChange={onChange} onClear={onClear} />

      <RecentlyViewed />
      <TrustBar />
    </SiteLayout>
  );
}
