import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CatalogListing } from "@/components/site/CatalogListing";
import { RecentlyViewed } from "@/components/site/RecentlyViewed";
import { TrustBar } from "@/components/site/TrustBar";
import { brandBySlug, departments, productsByBrand } from "@/lib/catalog";
import { validatePlpSearch, type PlpSearch } from "@/lib/filters";

export const Route = createFileRoute("/brand/$slug")({
  validateSearch: (raw: Record<string, unknown>) => validatePlpSearch(raw),
  loader: ({ params }) => {
    const brand = brandBySlug(params.slug);
    if (!brand) throw notFound();
    return { name: brand.name };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Brand non trovato — MyBrand Italia" }, { name: "robots", content: "noindex" }] };
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
        <Link to="/brand" className="btn-primary mt-5 inline-flex">
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

  const onChange = (patch: Partial<PlpSearch>) =>
    navigate({ params: { slug }, search: (prev) => ({ ...prev, ...patch }), resetScroll: false });
  const onClear = () => navigate({ params: { slug }, search: {}, resetScroll: false });

  const deps = departments.filter((d) => all.some((p) => p.department === d.slug));

  return (
    <SiteLayout>
      <nav aria-label="Breadcrumb" className="container-mb pt-3 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="px-1.5">/</span>
        <Link to="/brand" className="hover:text-foreground">
          Brand
        </Link>
        <span className="px-1.5">/</span>
        <span className="text-foreground">{brand.name}</span>
      </nav>

      {brand.image && (
        <div className="relative mt-3">
          <img
            src={brand.image}
            alt={brand.name}
            width={1600}
            height={700}
            className="h-[34vh] w-full object-cover md:h-[38vh]"
          />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-foreground/70 to-transparent">
            <div className="container-mb pb-5">
              <h1 className="text-2xl font-semibold uppercase tracking-[0.1em] text-background md:text-4xl">
                {brand.name}
              </h1>
              {brand.claim && <p className="mt-1 max-w-md text-sm text-background/85">{brand.claim}</p>}
            </div>
          </div>
        </div>
      )}
      {!brand.image && (
        <h1 className="container-mb pt-2 text-2xl font-semibold uppercase tracking-[0.1em] md:text-3xl">
          {brand.name}
        </h1>
      )}

      <div className="container-mb flex flex-wrap items-center gap-2 py-4">
        <span className="text-xs text-muted-foreground">{all.length} prodotti ·</span>
        {deps.map((d) => (
          <Link
            key={d.slug}
            to="/categoria/$slug"
            params={{ slug: d.slug }}
            search={{ brand: slug }}
            className="flex h-10 items-center border border-border px-3 text-xs font-medium"
          >
            {brand.name} {d.label}
          </Link>
        ))}
      </div>

      <CatalogListing all={all} value={search} onChange={onChange} onClear={onClear} />

      <RecentlyViewed />
      <TrustBar />
    </SiteLayout>
  );
}
