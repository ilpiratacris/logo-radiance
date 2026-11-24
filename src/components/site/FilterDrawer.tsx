import { ChevronDown, Search } from "lucide-react";
import { useState, type ReactNode } from "react";
import { BottomSheet } from "@/components/site/BottomSheet";
import { SizeSelector } from "@/components/site/SizeSelector";
import { csv, toCsv, type Facets, type PlpSearch } from "@/lib/filters";

type Props = {
  open: boolean;
  onClose: () => void;
  facets: Facets;
  value: PlpSearch;
  resultCount: number;
  onChange: (patch: Partial<PlpSearch>) => void;
  onClear: () => void;
};

/** Filtri su mobile: pannello a tutto schermo aperto dal pulsante della barra. */
export function FilterDrawer({
  open,
  onClose,
  facets,
  value,
  resultCount,
  onChange,
  onClear,
}: Props) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Filtri"
      full
      footer={
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClear}
            className="btn-outline shrink-0 whitespace-nowrap px-4"
          >
            Rimuovi tutti
          </button>
          <button type="button" onClick={onClose} className="btn-primary min-w-0 flex-1">
            Mostra {resultCount} {resultCount === 1 ? "prodotto" : "prodotti"}
          </button>
        </div>
      }
    >
      <FilterSections facets={facets} value={value} onChange={onChange} />
    </BottomSheet>
  );
}

const SECTION_IDS = ["cat", "brand", "size", "color", "price", "promo"];

function Section({
  label,
  open,
  onToggle,
  grid,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  grid: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={
        grid
          ? "min-w-0 border-r border-border px-4 last:border-r-0 max-xl:border-b max-xl:[&:nth-child(3n)]:border-r-0 max-xl:[&:nth-last-child(-n+3)]:border-b-0"
          : "border-b border-border"
      }
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`flex h-14 w-full items-center justify-between text-left text-sm font-semibold ${grid ? "px-0" : "px-4"}`}
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </button>
      {open && <div className={grid ? "pb-5" : "px-4 pb-5"}>{children}</div>}
    </div>
  );
}

/**
 * Sezioni dei filtri. In colonna nel pannello mobile; su desktop (`desktopGrid`)
 * affiancate in sei colonne dentro il riquadro sopra la griglia.
 */
export function FilterSections({
  facets,
  value,
  onChange,
  defaultOpen,
  desktopGrid = false,
}: {
  facets: Facets;
  value: PlpSearch;
  onChange: (patch: Partial<PlpSearch>) => void;
  /** id della sezione aperta all'avvio, oppure "all" */
  defaultOpen?: string;
  desktopGrid?: boolean;
}) {
  const [openSections, setOpenSections] = useState<string[]>(
    defaultOpen === "all" ? SECTION_IDS : defaultOpen ? [defaultOpen] : [],
  );
  const [brandQuery, setBrandQuery] = useState("");
  const [showAllBrands, setShowAllBrands] = useState(false);

  const isOpen = (id: string) => openSections.includes(id);
  const toggle = (id: string) =>
    setOpenSections((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const toggleIn = (key: "brand" | "size" | "color", v: string) => {
    const cur = csv(value[key]);
    const next = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v];
    onChange({ [key]: toCsv(next) } as Partial<PlpSearch>);
  };

  const brandList = facets.brands.filter((b) =>
    b.label.toLowerCase().includes(brandQuery.trim().toLowerCase()),
  );
  const visibleBrands = showAllBrands || brandQuery ? brandList : brandList.slice(0, 6);
  const section = (id: string) => ({
    open: isOpen(id),
    onToggle: () => toggle(id),
    grid: desktopGrid,
  });

  return (
    <div className={desktopGrid ? "grid grid-cols-3 xl:grid-cols-6" : ""}>
      {facets.categories.length > 1 && (
        <Section label="Categoria" {...section("cat")}>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="chip"
              aria-pressed={!value.cat}
              onClick={() => onChange({ cat: undefined })}
            >
              Tutte
            </button>
            {facets.categories.map((c) => (
              <button
                key={c.value}
                type="button"
                className="chip"
                aria-pressed={value.cat === c.value}
                onClick={() => onChange({ cat: c.value })}
              >
                <span>{c.label}</span>
                <span className="opacity-60">({c.count})</span>
              </button>
            ))}
          </div>
        </Section>
      )}

      <Section label="Brand" {...section("brand")}>
        <label className="search-box mb-3 h-11 border-border text-sm">
          <Search className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
          <input
            value={brandQuery}
            onChange={(e) => setBrandQuery(e.target.value)}
            placeholder="Cerca brand"
            aria-label="Cerca brand"
          />
        </label>
        <ul>
          {visibleBrands.map((b) => (
            <li key={b.value}>
              <label className="flex h-11 cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={csv(value.brand).includes(b.value)}
                  onChange={() => toggleIn("brand", b.value)}
                  className="h-4 w-4 shrink-0 accent-foreground"
                />
                <span className="min-w-0 flex-1 truncate">{b.label}</span>
                <span className="text-xs text-muted-foreground">{b.count}</span>
              </label>
            </li>
          ))}
        </ul>
        {!showAllBrands && !brandQuery && brandList.length > 6 && (
          <button
            type="button"
            onClick={() => setShowAllBrands(true)}
            className="mt-2 text-xs font-medium underline underline-offset-4"
          >
            Mostra altri ({brandList.length - 6})
          </button>
        )}
      </Section>

      {facets.sizes.length > 0 && (
        <Section label="Taglia" {...section("size")}>
          <SizeSelector
            sizes={facets.sizes.map((s) => ({ size: s.value }))}
            selected={csv(value.size)}
            onSelect={(s) => toggleIn("size", s)}
            columns={
              desktopGrid ? "grid-cols-3 min-[1400px]:grid-cols-6" : "grid-cols-4 sm:grid-cols-6"
            }
          />
        </Section>
      )}

      <Section label="Colore" {...section("color")}>
        {/* nel pannello a 6 colonne i nomi lunghi non stanno in due colonne */}
        <div className={`grid grid-cols-2 gap-2 ${desktopGrid ? "xl:grid-cols-1" : ""}`}>
          {facets.colors.map((c) => {
            const on = csv(value.color).includes(c.value);
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => toggleIn("color", c.value)}
                aria-pressed={on}
                className={`flex h-11 min-w-0 items-center gap-2 border px-2 text-left text-sm transition-colors ${
                  on
                    ? "border-foreground"
                    : "border-border hover:border-foreground hover:bg-background"
                }`}
              >
                <span
                  className="h-5 w-5 shrink-0 rounded-full border border-border"
                  style={{ background: c.hex }}
                />
                <span className="truncate">{c.label}</span>
              </button>
            );
          })}
        </div>
      </Section>

      <Section label="Prezzo" {...section("price")}>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder={`${facets.priceRange[0]}`}
            value={value.min ?? ""}
            onChange={(e) => onChange({ min: e.target.value || undefined })}
            aria-label="Prezzo minimo"
            className="field"
          />
          <span className="text-muted-foreground">–</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder={`${facets.priceRange[1]}`}
            value={value.max ?? ""}
            onChange={(e) => onChange({ max: e.target.value || undefined })}
            aria-label="Prezzo massimo"
            className="field"
          />
        </div>
      </Section>

      <Section label="Sconto" {...section("promo")}>
        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={value.sconto === "1"}
            onChange={(e) => onChange({ sconto: e.target.checked ? "1" : undefined })}
            className="h-4 w-4 shrink-0 accent-foreground"
          />
          <span className="flex-1">Solo prodotti in promozione</span>
          <span className="text-xs text-muted-foreground">{facets.discounted}</span>
        </label>
      </Section>
    </div>
  );
}
