import { SlidersHorizontal, ArrowUpDown, ChevronDown, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CountDot } from "@/components/site/CountDot";
import { EmptyState } from "@/components/site/EmptyState";
import { FilterDrawer, FilterSections } from "@/components/site/FilterDrawer";
import { Pagination } from "@/components/site/Pagination";
import { ProductGrid } from "@/components/site/ProductGrid";
import { SortSheet } from "@/components/site/SortSheet";
import {
  activeChips,
  applyFilters,
  buildFacets,
  countActive,
  PAGE_SIZE,
  SORTS,
  type PlpSearch,
  type SortKey,
} from "@/lib/filters";
import type { Product } from "@/lib/catalog";

const barBtn =
  "flex h-10 flex-1 items-center justify-center gap-2 border border-border-strong text-sm font-medium transition-colors hover:border-foreground hover:bg-surface";

/** Altezza della testata desktop: sotto questa quota la barra dei filtri è agganciata. */
const STUCK_BELOW = 120;
/** Stessa soglia del breakpoint `lg` di Tailwind, in rem come nel CSS. */
const DESKTOP = "(min-width: 64rem)";

/**
 * Listing prodotti: barra con filtri e ordinamento, chip dei filtri attivi, griglia e pagine.
 * Il pulsante «Filtri» apre il pannello a scomparsa su mobile e, su desktop, il riquadro
 * sopra la griglia, chiuso finché non lo si chiede.
 */
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
  const [panelOpen, setPanelOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // il riquadro esiste solo su desktop: scendendo sotto la soglia si richiude
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const sync = () => {
      setDesktop(mq.matches);
      if (!mq.matches) setPanelOpen(false);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const facets = useMemo(() => {
    const f = buildFacets(all);
    return showCategoryFilter ? f : { ...f, categories: [] };
  }, [all, showCategoryFilter]);
  const results = useMemo(() => applyFilters(all, value), [all, value]);
  const chips = activeChips(value, facets, all[0]?.department);
  const nActive = countActive(value);
  const sortLabel = SORTS.find((s) => s.key === (value.sort ?? "rilevanza"))!.label;

  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(pages, Math.max(1, Number(value.page ?? 1)));
  const visible = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /** Ogni cambio di filtro o ordinamento riparte dalla prima pagina. */
  const change = (patch: Partial<PlpSearch>) => onChange({ ...patch, page: undefined });
  const goTo = (n: number) => {
    onChange({ page: n === 1 ? undefined : String(n) });
    topRef.current?.scrollIntoView({ block: "start" });
  };

  const toggleFilters = () => {
    if (!desktop) {
      setFiltersOpen(true);
      return;
    }
    // con la barra agganciata il riquadro si aprirebbe fuori vista: si torna in cima al listing
    const top = topRef.current;
    if (!panelOpen && top && top.getBoundingClientRect().top < STUCK_BELOW)
      top.scrollIntoView({ block: "start" });
    setPanelOpen(!panelOpen);
  };

  return (
    <>
      <div ref={topRef} className="scroll-mt-[102px] lg:scroll-mt-[114px]" />

      {/* barra filtri sticky sotto la testata */}
      <div className="sticky top-[100px] z-30 border-y border-border bg-background lg:top-[111px]">
        <div className="container-mb flex h-12 items-center gap-2">
          <button
            type="button"
            onClick={toggleFilters}
            aria-expanded={desktop ? panelOpen : undefined}
            aria-haspopup={desktop ? undefined : "dialog"}
            aria-label={
              nActive > 0 ? `Filtri, ${nActive} ${nActive === 1 ? "attivo" : "attivi"}` : "Filtri"
            }
            className={`${barBtn} lg:flex-none lg:px-5 ${nActive > 0 ? "border-foreground" : ""}`}
          >
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            Filtri
            {nActive > 0 && <CountDot>{nActive}</CountDot>}
            <ChevronDown
              className={`hidden h-4 w-4 transition-transform duration-200 lg:block ${panelOpen ? "rotate-180" : ""}`}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            onClick={() => setSortOpen(true)}
            className={`${barBtn} lg:flex-none lg:px-5`}
          >
            <ArrowUpDown className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            <span className="lg:hidden">Ordina</span>
            <span className="hidden lg:inline">{sortLabel}</span>
          </button>
          <span className="ml-auto hidden text-xs text-muted-foreground lg:block">
            {results.length} {results.length === 1 ? "prodotto" : "prodotti"}
          </span>
        </div>

        {chips.length > 0 && (
          <div className="container-mb no-scrollbar flex gap-2 overflow-x-auto pb-3 pt-1">
            {chips.map((c, i) => (
              <button
                key={`${c.label}-${i}`}
                type="button"
                onClick={() => change(c.clear)}
                aria-label={`Rimuovi il filtro ${c.label}`}
                className="flex h-9 shrink-0 items-center gap-1.5 border border-border bg-surface px-2.5 text-xs transition-colors hover:border-foreground"
              >
                {c.label}
                <X className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              </button>
            ))}
            <button
              type="button"
              onClick={onClear}
              className="h-9 shrink-0 px-2 text-xs font-medium underline underline-offset-4"
            >
              Rimuovi tutti
            </button>
          </div>
        )}
      </div>

      {/* riquadro filtri desktop: sei colonne sopra la griglia, aperto dal pulsante della barra */}
      {panelOpen && (
        <section className="container-mb hidden pt-5 lg:block" aria-label="Filtri prodotti">
          <div className="border border-border bg-surface">
            <FilterSections
              facets={facets}
              value={value}
              onChange={change}
              desktopGrid
              defaultOpen="all"
            />
            <div className="flex h-14 items-center justify-end gap-5 border-t border-border px-4">
              {nActive > 0 && (
                <button
                  type="button"
                  onClick={onClear}
                  className="h-11 text-xs font-medium underline underline-offset-4"
                >
                  Rimuovi tutti
                </button>
              )}
              <button type="button" onClick={() => setPanelOpen(false)} className="btn-outline">
                Mostra {results.length} {results.length === 1 ? "prodotto" : "prodotti"}
              </button>
            </div>
          </div>
        </section>
      )}

      <div className="container-mb pb-8 pt-4 lg:pb-10 lg:pt-7">
        {results.length === 0 ? (
          <EmptyState text="Nessun prodotto con questi filtri.">
            <button type="button" onClick={onClear} className="btn-outline">
              Rimuovi i filtri
            </button>
          </EmptyState>
        ) : (
          <ProductGrid products={visible} />
        )}
      </div>

      <Pagination page={page} pages={pages} onPage={goTo} className="container-mb pb-10 lg:pb-14" />

      <FilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        facets={facets}
        value={value}
        resultCount={results.length}
        onChange={change}
        onClear={onClear}
      />
      <SortSheet
        open={sortOpen}
        onClose={() => setSortOpen(false)}
        value={value.sort}
        onChange={(k: SortKey) => change({ sort: k })}
      />
    </>
  );
}
