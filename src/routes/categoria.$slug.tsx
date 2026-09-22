import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CatalogListing } from "@/components/site/CatalogListing";
import {
  categoryLabel,
  departments,
  navTree,
  productsByDepartment,
  type DepartmentSlug,
} from "@/lib/catalog";
import { validatePlpSearch, type PlpSearch } from "@/lib/filters";
import { useStore } from "@/lib/store";
import { useEffect } from "react";

const isDep = (s: string): s is DepartmentSlug => departments.some((d) => d.slug === s);

export const Route = createFileRoute("/categoria/$slug")({
  validateSearch: (raw: Record<string, unknown>) => validatePlpSearch(raw),
  head: ({ params }) => {
    const dep = isDep(params.slug) ? params.slug : "donna";
    const label = departments.find((d) => d.slug === dep)!.label;
    const title = `${label} — abbigliamento, calzature e accessori multibrand | MyBrand Italia`;
    const description = `Scopri la selezione ${label.toLowerCase()} MyBrand Italia: novità, promozioni e i migliori brand. Filtra per brand, taglia, colore e prezzo.`;
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
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/categoria/$slug" });
  const { department, setDepartment } = useStore();

  const dep: DepartmentSlug = isDep(slug) ? slug : department;
  const depLabel = departments.find((d) => d.slug === dep)!.label;

  useEffect(() => {
    if (isDep(slug) && slug !== department) setDepartment(slug);
  }, [slug, department, setDepartment]);

  const all = productsByDepartment(dep);
  const subCats = navTree[dep].flatMap((g) => g.items).slice(0, 14);

  const onChange = (patch: Partial<PlpSearch>) =>
    navigate({ params: { slug }, search: (prev) => ({ ...prev, ...patch }), resetScroll: false });
  const onClear = () => navigate({ params: { slug }, search: { cat: search.cat }, resetScroll: false });

  const heading = search.novita === "1"
    ? `Novità ${depLabel}`
    : search.cat
      ? `${categoryLabel(dep, search.cat)} ${depLabel}`
      : depLabel;

  return (
    <SiteLayout>
      {/* breadcrumb */}
      <nav aria-label="Breadcrumb" className="container-mb pt-3 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="px-1.5">/</span>
        <Link to="/categoria/$slug" params={{ slug: dep }} className="hover:text-foreground">
          {depLabel}
        </Link>
        {search.cat && (
          <>
            <span className="px-1.5">/</span>
            <span className="text-foreground">{categoryLabel(dep, search.cat)}</span>
          </>
        )}
      </nav>

      <header className="container-mb pt-2 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{heading}</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {all.length} prodotti · PLACEHOLDER: conteggio reale dal catalogo
        </p>
      </header>

      {/* sottocategorie: fila scrollabile su mobile */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-4 md:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Link
          to="/categoria/$slug"
          params={{ slug: dep }}
          search={{}}
          className={`flex h-10 shrink-0 items-center border px-3 text-xs font-medium ${
            !search.cat ? "border-foreground bg-foreground text-background" : "border-border"
          }`}
        >
          Tutto
        </Link>
        {subCats.map((c) => (
          <Link
            key={c.slug}
            to="/categoria/$slug"
            params={{ slug: dep }}
            search={{ cat: c.slug }}
            className={`flex h-10 shrink-0 items-center border px-3 text-xs font-medium ${
              search.cat === c.slug ? "border-foreground bg-foreground text-background" : "border-border"
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      <CatalogListing all={all} value={search} onChange={onChange} onClear={onClear} />
    </SiteLayout>
  );
}
