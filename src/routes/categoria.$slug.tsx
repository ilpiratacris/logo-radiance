import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumb, type Crumb } from "@/components/site/Breadcrumb";
import { CatalogListing } from "@/components/site/CatalogListing";
import {
  categoryCopy,
  categoryLabel,
  departments,
  productsByDepartment,
  type DepartmentSlug,
} from "@/lib/catalog";
import { applyFilters, validatePlpSearch, type PlpSearch } from "@/lib/filters";
import { useStore } from "@/lib/store";

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
  const count = applyFilters(all, search).length;

  const onChange = (patch: Partial<PlpSearch>) =>
    navigate({ params: { slug }, search: (prev) => ({ ...prev, ...patch }), resetScroll: false });
  const onClear = () =>
    navigate({ params: { slug }, search: { cat: search.cat }, resetScroll: false });

  const isNew = search.novita === "1";
  const catLabel = search.cat ? categoryLabel(dep, search.cat) : null;
  const heading = isNew
    ? `Novità ${depLabel.toLowerCase()}`
    : catLabel
      ? `${catLabel} ${depLabel.toLowerCase()}`
      : depLabel;
  const intro = isNew
    ? "Gli ultimi arrivi dei brand selezionati per la stagione."
    : categoryCopy(dep, search.cat).short;

  const crumbs: Crumb[] = [
    { label: "Home", to: "/" },
    { label: depLabel, to: "/categoria/$slug", params: { slug: dep } },
  ];
  if (isNew) crumbs.push({ label: "Novità" });
  else if (catLabel) crumbs.push({ label: catLabel });

  return (
    <SiteLayout>
      <div className="container-mb flex flex-col gap-3 py-4 lg:gap-4 lg:py-5">
        <Breadcrumb items={crumbs} />
        <div className="flex flex-col gap-1.5 lg:gap-2">
          <h1 className="text-2xl font-semibold leading-8 tracking-tight lg:text-3xl lg:leading-9">
            {heading}
          </h1>
          <p className="text-sm leading-5 text-muted-foreground lg:hidden">
            {count} {count === 1 ? "prodotto" : "prodotti"}
          </p>
          <p className="hidden max-w-[640px] text-sm leading-5 text-muted-foreground lg:block">
            {intro}
          </p>
        </div>
      </div>

      <CatalogListing all={all} value={search} onChange={onChange} onClear={onClear} />
    </SiteLayout>
  );
}
