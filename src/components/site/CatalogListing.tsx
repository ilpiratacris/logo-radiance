import { SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductGrid } from "@/components/site/ProductGrid";
import { FilterDrawer, FilterSections } from "@/components/site/FilterDrawer";
import { SortSheet } from "@/components/site/SortSheet";
import {
  activeChips,
  applyFilters,
  buildFacets,
  countActive,
  SORTS,
  type PlpSearch,
  type SortKey,
} from "@/lib/filters";
import type { Product } from "@/lib/catalog";

export function CatalogListing({
  all,
  value,
  onChange,
  onClear,
  showCategoryFilter = true,
}: {
  all: Product[];
  value: PlpSearch;
  onChange: (patch: Partial<PlpSearch>) => void;
  onClear: () => void;
  showCategoryFilter?: boolean;
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const facets = useMemo(() => {
    const f = buildFacets(all);
    return showCategoryFilter ? f : { ...f, categories: [] };
  }, [all, showCategoryFilter]);
  const results = useMemo(() => applyFilters(all, value), [all, value]);
  const chips = activeChips(value, facets);
  const nActive = countActive(value);
  const sortLabel = SORTS.find((s) => s.key === (value.sort ?? "rilevanza"))!.label;

  return (
    <>
      {/* barra filtri sticky */}
      <div className="sticky top-[100px] z-30 border-y border-border bg-background lg:top-[111px]">
        <div className="container-mb flex h-12 items-center gap-2">
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex h-10 flex-1 items-center justify-center gap-2 border border-border-strong text-sm font-medium lg:flex-none lg:px-5"
          >
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
            Filtri{nActive > 0 ? ` (${nActive})` : ""}
          </button>
          <button
            onClick={() => setSortOpen(true)}
            className="flex h-10 flex-1 items-center justify-center gap-2 border border-border-strong text-sm font-medium lg:flex-none lg:px-5"
          >
            <ArrowUpDown className="h-4 w-4" strokeWidth={1.5} />
            <span className="lg:hidden">Ordina</span>
            <span className="hidden lg:inline">{sortLabel}</span>
          </button>
          <span className="ml-auto hidden text-xs text-muted-foreground lg:block">
            {results.length} prodotti
          </span>
        </div>

        {chips.length > 0 && (
          <div className="container-mb flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {chips.map((c, i) => (
              <button
                key={`${c.label}-${i}`}
                onClick={() => onChange(c.clear)}
                className="flex h-9 shrink-0 items-center gap-1.5 border border-border bg-surface px-2.5 text-xs"
              >
                {c.label}
                <X className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            ))}
            <button onClick={onClear} className="h-9 shrink-0 px-2 text-xs font-medium underline underline-offset-4">
              Rimuovi tutti
            </button>
          </div>
        )}
      </div>

      <div className="container-mb flex gap-8 py-6">
        {/* filtri desktop */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="border border-border">
            <FilterSections facets={facets} value={value} onChange={onChange} />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-3 text-xs text-muted-foreground lg:hidden">{results.length} prodotti</div>
          {results.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-muted-foreground">Nessun prodotto con questi filtri.</p>
              <button onClick={onClear} className="btn-outline mt-4">
                Rimuovi i filtri
              </button>
            </div>
          ) : (
            <ProductGrid products={results} />
          )}
        </div>
      </div>

      <FilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        facets={facets}
        value={value}
        resultCount={results.length}
        onChange={onChange}
        onClear={onClear}
      />
      <SortSheet
        open={sortOpen}
        onClose={() => setSortOpen(false)}
        value={value.sort}
        onChange={(k: SortKey) => onChange({ sort: k })}
      />
    </>
  );
}
