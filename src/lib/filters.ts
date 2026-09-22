import { COLORS, discountOf, type Product } from "@/lib/catalog";

export type PlpSearch = {
  cat?: string;
  brand?: string; // csv di brand slug
  size?: string; // csv
  color?: string; // csv di chiavi colore
  sconto?: string; // "1" = solo in promo
  min?: string;
  max?: string;
  sort?: SortKey;
  novita?: string;
};

export type SortKey = "rilevanza" | "novita" | "venduti" | "prezzo-asc" | "prezzo-desc" | "sconto";

export const SORTS: { key: SortKey; label: string }[] = [
  { key: "rilevanza", label: "Più rilevanti" },
  { key: "novita", label: "Novità" },
  { key: "venduti", label: "Più venduti" },
  { key: "prezzo-asc", label: "Prezzo crescente" },
  { key: "prezzo-desc", label: "Prezzo decrescente" },
  { key: "sconto", label: "Sconto maggiore" },
];

export const csv = (v?: string) => (v ? v.split(",").filter(Boolean) : []);
export const toCsv = (arr: string[]) => (arr.length ? arr.join(",") : undefined);

export function validatePlpSearch(raw: Record<string, unknown>): PlpSearch {
  const s = (k: string) => (typeof raw[k] === "string" && raw[k] ? (raw[k] as string) : undefined);
  const sort = s("sort") as SortKey | undefined;
  return {
    cat: s("cat"),
    brand: s("brand"),
    size: s("size"),
    color: s("color"),
    sconto: s("sconto"),
    min: s("min"),
    max: s("max"),
    novita: s("novita"),
    sort: SORTS.some((x) => x.key === sort) ? sort : undefined,
  };
}

const slugOfBrand = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export function applyFilters(list: Product[], f: PlpSearch): Product[] {
  const brandSel = csv(f.brand);
  const sizeSel = csv(f.size);
  const colorSel = csv(f.color);
  const min = f.min ? Number(f.min) : undefined;
  const max = f.max ? Number(f.max) : undefined;

  let out = list.filter((p) => {
    if (f.cat && p.category !== f.cat && p.group !== f.cat) return false;
    if (f.novita === "1" && !p.newIn) return false;
    if (brandSel.length && !brandSel.includes(slugOfBrand(p.brand))) return false;
    if (colorSel.length && !p.variants.some((v) => colorSel.includes(v.key))) return false;
    if (sizeSel.length && !p.variants.some((v) => v.sizes.some((s) => s.stock > 0 && sizeSel.includes(s.size))))
      return false;
    if (f.sconto === "1" && !p.oldPrice) return false;
    if (min !== undefined && p.price < min) return false;
    if (max !== undefined && p.price > max) return false;
    return true;
  });

  switch (f.sort) {
    case "prezzo-asc":
      out = [...out].sort((a, b) => a.price - b.price);
      break;
    case "prezzo-desc":
      out = [...out].sort((a, b) => b.price - a.price);
      break;
    case "sconto":
      out = [...out].sort((a, b) => discountOf(b) - discountOf(a));
      break;
    case "novita":
      out = [...out].sort((a, b) => Number(!!b.newIn) - Number(!!a.newIn));
      break;
    case "venduti":
      out = [...out].sort((a, b) => Number(!!b.bestSeller) - Number(!!a.bestSeller));
      break;
    default:
      break;
  }
  return out;
}

export type Facets = {
  categories: { value: string; label: string; count: number }[];
  brands: { value: string; label: string; count: number }[];
  sizes: { value: string; count: number }[];
  colors: { value: string; label: string; hex: string; count: number }[];
  discounted: number;
  priceRange: [number, number];
};

/** Costruisce i facet solo sui valori realmente disponibili nella lista corrente. */
export function buildFacets(list: Product[]): Facets {
  const cat = new Map<string, number>();
  const br = new Map<string, number>();
  const sz = new Map<string, number>();
  const col = new Map<string, number>();
  let discounted = 0;
  let min = Infinity;
  let max = 0;

  list.forEach((p) => {
    cat.set(p.category, (cat.get(p.category) ?? 0) + 1);
    br.set(p.brand, (br.get(p.brand) ?? 0) + 1);
    p.variants.forEach((v) => {
      col.set(v.key, (col.get(v.key) ?? 0) + 1);
      v.sizes.forEach((s) => s.stock > 0 && sz.set(s.size, (sz.get(s.size) ?? 0) + 1));
    });
    if (p.oldPrice) discounted++;
    min = Math.min(min, p.price);
    max = Math.max(max, p.price);
  });

  return {
    categories: [...cat.entries()]
      .map(([value, count]) => ({ value, label: value.replace(/-/g, " "), count }))
      .sort((a, b) => b.count - a.count),
    brands: [...br.entries()]
      .map(([label, count]) => ({ value: slugOfBrand(label), label, count }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    sizes: [...sz.entries()].map(([value, count]) => ({ value, count })),
    colors: [...col.entries()].map(([value, count]) => ({
      value,
      label: COLORS[value]?.label ?? value,
      hex: COLORS[value]?.hex ?? "#999",
      count,
    })),
    discounted,
    priceRange: [Number.isFinite(min) ? Math.floor(min) : 0, Math.ceil(max)],
  };
}

export function activeChips(f: PlpSearch, facets: Facets) {
  const chips: { label: string; clear: Partial<PlpSearch> }[] = [];
  csv(f.brand).forEach((b) =>
    chips.push({
      label: facets.brands.find((x) => x.value === b)?.label ?? b,
      clear: { brand: toCsv(csv(f.brand).filter((x) => x !== b)) },
    }),
  );
  csv(f.color).forEach((c) =>
    chips.push({ label: COLORS[c]?.label ?? c, clear: { color: toCsv(csv(f.color).filter((x) => x !== c)) } }),
  );
  csv(f.size).forEach((s) =>
    chips.push({ label: `Taglia ${s}`, clear: { size: toCsv(csv(f.size).filter((x) => x !== s)) } }),
  );
  if (f.sconto === "1") chips.push({ label: "In promo", clear: { sconto: undefined } });
  if (f.min || f.max)
    chips.push({
      label: `€ ${f.min ?? 0} – ${f.max ?? "∞"}`,
      clear: { min: undefined, max: undefined },
    });
  if (f.novita === "1") chips.push({ label: "Novità", clear: { novita: undefined } });
  return chips;
}

export const countActive = (f: PlpSearch) =>
  csv(f.brand).length +
  csv(f.color).length +
  csv(f.size).length +
  (f.sconto === "1" ? 1 : 0) +
  (f.min || f.max ? 1 : 0);
