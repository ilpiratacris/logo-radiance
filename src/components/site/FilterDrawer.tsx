import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import { BottomSheet } from "@/components/site/BottomSheet";
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

export function FilterDrawer({ open, onClose, facets, value, resultCount, onChange, onClear }: Props) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Filtri"
      full
      footer={
        <div className="flex gap-2">
          <button onClick={onClear} className="btn-outline flex-1">
            Rimuovi tutti
          </button>
          <button onClick={onClose} className="btn-primary flex-[2]">
            Mostra {resultCount} prodotti
          </button>
        </div>
      }
    >
      <FilterSections facets={facets} value={value} onChange={onChange} />
    </BottomSheet>
  );
}

export function FilterSections({
  facets,
  value,
  onChange,
  defaultOpen = "all",
  desktopGrid = false,
}: {
  facets: Facets;
  value: PlpSearch;
  onChange: (patch: Partial<PlpSearch>) => void;
  defaultOpen?: string;
  desktopGrid?: boolean;
}) {
  const sectionIds = ["cat", "brand", "size", "color", "price", "promo"];
  const [openSections, setOpenSections] = useState<string[]>(defaultOpen === "all" ? sectionIds : [defaultOpen]);
  const [brandQuery, setBrandQuery] = useState("");
  const [showAllBrands, setShowAllBrands] = useState(false);

  const toggleIn = (key: "brand" | "size" | "color", v: string) => {
    const cur = csv(value[key]);
    const next = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v];
    onChange({ [key]: toCsv(next) } as Partial<PlpSearch>);
  };

  const brandList = facets.brands.filter((b) =>
    b.label.toLowerCase().includes(brandQuery.trim().toLowerCase()),
  );
  const visibleBrands = showAllBrands || brandQuery ? brandList : brandList.slice(0, 6);

  const Section = ({ id, label, children }: { id: string; label: string; children: React.ReactNode }) => {
    const isOpen = openSections.includes(id);
    return (
    <div className={desktopGrid ? "min-w-0 border-r border-border px-4 last:border-r-0" : "border-b border-border"}>
      <button
        onClick={() => setOpenSections((current) => isOpen ? current.filter((item) => item !== id) : [...current, id])}
        aria-expanded={isOpen}
        className={`flex h-14 w-full items-center justify-between text-sm font-semibold ${desktopGrid ? "px-0" : "px-4"}`}
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} strokeWidth={1.5} />
      </button>
      {isOpen && <div className={desktopGrid ? "pb-5" : "px-4 pb-5"}>{children}</div>}
    </div>
    );
  };

  return (
    <div className={desktopGrid ? "grid grid-cols-3 xl:grid-cols-6" : ""}>
      {facets.categories.length > 1 && (
        <Section id="cat" label="Categoria">
          <div className="flex flex-wrap gap-2">
            <Chip active={!value.cat} onClick={() => onChange({ cat: undefined })}>
              Tutte
            </Chip>
            {facets.categories.map((c) => (
              <Chip key={c.value} active={value.cat === c.value} onClick={() => onChange({ cat: c.value })}>
                <span className="capitalize">{c.label}</span> <span className="text-muted-foreground">({c.count})</span>
              </Chip>
            ))}
          </div>
        </Section>
      )}

      <Section id="brand" label="Brand">
        <div className="mb-3 flex h-11 items-center gap-2 border border-border px-3">
          <Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <input
            value={brandQuery}
            onChange={(e) => setBrandQuery(e.target.value)}
            placeholder="Cerca brand"
            aria-label="Cerca brand"
            className="h-full w-full bg-transparent text-sm outline-none"
          />
        </div>
        <ul>
          {visibleBrands.map((b) => (
            <li key={b.value}>
              <label className="flex h-11 cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={csv(value.brand).includes(b.value)}
                  onChange={() => toggleIn("brand", b.value)}
                  className="h-4 w-4 accent-[color:var(--color-foreground)]"
                />
                <span className="flex-1">{b.label}</span>
                <span className="text-xs text-muted-foreground">{b.count}</span>
              </label>
            </li>
          ))}
        </ul>
        {!showAllBrands && !brandQuery && brandList.length > 6 && (
          <button onClick={() => setShowAllBrands(true)} className="mt-2 text-xs font-medium underline underline-offset-4">
            Mostra altri ({brandList.length - 6})
          </button>
        )}
      </Section>

      {facets.sizes.length > 0 && (
        <Section id="size" label="Taglia">
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {facets.sizes.map((s) => (
              <button
                key={s.value}
                onClick={() => toggleIn("size", s.value)}
                aria-pressed={csv(value.size).includes(s.value)}
                className={`h-11 border text-sm ${
                  csv(value.size).includes(s.value)
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground"
                }`}
              >
                {s.value}
              </button>
            ))}
          </div>
        </Section>
      )}

      <Section id="color" label="Colore">
        <div className="grid grid-cols-2 gap-2">
          {facets.colors.map((c) => (
            <button
              key={c.value}
              onClick={() => toggleIn("color", c.value)}
              aria-pressed={csv(value.color).includes(c.value)}
              className={`flex h-11 items-center gap-2 border px-2 text-sm ${
                csv(value.color).includes(c.value) ? "border-foreground" : "border-border"
              }`}
            >
              <span className="h-5 w-5 rounded-full border border-border" style={{ background: c.hex }} />
              {c.label}
            </button>
          ))}
        </div>
      </Section>

      <Section id="price" label="Prezzo">
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder={`${facets.priceRange[0]}`}
            value={value.min ?? ""}
            onChange={(e) => onChange({ min: e.target.value || undefined })}
            aria-label="Prezzo minimo"
            className="h-11 w-full border border-border px-3 text-sm"
          />
          <span className="text-muted-foreground">–</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder={`${facets.priceRange[1]}`}
            value={value.max ?? ""}
            onChange={(e) => onChange({ max: e.target.value || undefined })}
            aria-label="Prezzo massimo"
            className="h-11 w-full border border-border px-3 text-sm"
          />
        </div>
      </Section>

      <Section id="promo" label="Sconto">
        <label className="flex h-11 cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={value.sconto === "1"}
            onChange={(e) => onChange({ sconto: e.target.checked ? "1" : undefined })}
            className="h-4 w-4"
          />
          Solo prodotti in promozione
          <span className="ml-auto text-xs text-muted-foreground">{facets.discounted}</span>
        </label>
      </Section>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex h-10 items-center gap-1 border px-3 text-sm ${
        active ? "border-foreground bg-foreground text-background" : "border-border"
      }`}
    >
      {children}
    </button>
  );
}
