/**
 * Catalogo demo MyBrand Italia.
 * PLACEHOLDER: tutti i dati (prodotti, prezzi, sconti, disponibilità taglie)
 * dovranno arrivare dal backend. Nessuna condizione commerciale reale.
 */
import tshirt from "@/assets/p-tshirt.jpg";
import jeans from "@/assets/p-jeans.jpg";
import sneakers from "@/assets/p-sneakers.jpg";
import bag from "@/assets/p-bag.jpg";
import sweater from "@/assets/p-sweater.jpg";
import jacket from "@/assets/p-jacket.jpg";
import dress from "@/assets/p-dress.jpg";
import boots from "@/assets/p-boots.jpg";
import heroAw from "@/assets/hero-aw-desktop.jpg";
import heroAwMobile from "@/assets/hero-aw-mobile.jpg";
import promoAutunno from "@/assets/promo-autunno.jpg";
import editorial from "@/assets/editorial-street.jpg";
import catDonna from "@/assets/cat-donna.jpg";
import catUomo from "@/assets/cat-uomo.jpg";
import catBambino from "@/assets/cat-bambino.jpg";

export const IMG = {
  tshirt, jeans, sneakers, bag, sweater, jacket, dress, boots,
  heroAw, heroAwMobile, promoAutunno, editorial, catDonna, catUomo, catBambino,
};

export type DepartmentSlug = "donna" | "uomo" | "bambino";

export type SizeStock = { size: string; stock: number };

export type Variant = {
  key: string;
  label: string;
  hex: string;
  image: string;
  altImage?: string;
  sizes: SizeStock[];
};

export type Product = {
  slug: string;
  name: string;
  brand: string;
  department: DepartmentSlug;
  group: "abbigliamento" | "calzature" | "accessori";
  category: string;
  price: number;
  oldPrice?: number;
  variants: Variant[];
  newIn?: boolean;
  bestSeller?: boolean;
  description: string;
  details: string[];
  composition: string;
};

/* ------------------------------------------------------------------ */
/* Reparti e navigazione                                               */
/* ------------------------------------------------------------------ */

export const departments: { slug: DepartmentSlug; label: string; image: string }[] = [
  { slug: "donna", label: "Donna", image: catDonna },
  { slug: "uomo", label: "Uomo", image: catUomo },
  { slug: "bambino", label: "Bambino", image: catBambino },
];

export type NavItem = { label: string; slug: string };
export type NavGroup = { label: string; slug: string; items: NavItem[] };

const apparelDonna: NavItem[] = [
  { label: "T-shirt e top", slug: "t-shirt" },
  { label: "Felpe", slug: "felpe" },
  { label: "Maglieria", slug: "maglieria" },
  { label: "Camicie e bluse", slug: "camicie" },
  { label: "Abiti", slug: "abiti" },
  { label: "Giubbotti", slug: "giubbotti" },
  { label: "Giacche e cappotti", slug: "giacche" },
  { label: "Jeans", slug: "jeans" },
  { label: "Pantaloni", slug: "pantaloni" },
  { label: "Gonne", slug: "gonne" },
];

const apparelUomo: NavItem[] = [
  { label: "T-shirt", slug: "t-shirt" },
  { label: "Polo", slug: "polo" },
  { label: "Felpe", slug: "felpe" },
  { label: "Maglieria", slug: "maglieria" },
  { label: "Camicie", slug: "camicie" },
  { label: "Giubbotti", slug: "giubbotti" },
  { label: "Giacche", slug: "giacche" },
  { label: "Jeans", slug: "jeans" },
  { label: "Pantaloni", slug: "pantaloni" },
  { label: "Bermuda", slug: "bermuda" },
];

const apparelBambino: NavItem[] = [
  { label: "T-shirt", slug: "t-shirt" },
  { label: "Felpe", slug: "felpe" },
  { label: "Maglieria", slug: "maglieria" },
  { label: "Giubbotti", slug: "giubbotti" },
  { label: "Jeans", slug: "jeans" },
  { label: "Pantaloni", slug: "pantaloni" },
];

const shoes: NavItem[] = [
  { label: "Sneakers", slug: "sneakers" },
  { label: "Scarpe", slug: "scarpe" },
  { label: "Stivaletti", slug: "stivaletti" },
  { label: "Sandali", slug: "sandali" },
  { label: "Ciabatte", slug: "ciabatte" },
];

const accessories: NavItem[] = [
  { label: "Borse", slug: "borse" },
  { label: "Zaini", slug: "zaini" },
  { label: "Cinture", slug: "cinture" },
  { label: "Cappelli", slug: "cappelli" },
  { label: "Portafogli", slug: "portafogli" },
  { label: "Sciarpe", slug: "sciarpe" },
];

export const navTree: Record<DepartmentSlug, NavGroup[]> = {
  donna: [
    { label: "Abbigliamento", slug: "abbigliamento", items: apparelDonna },
    { label: "Calzature", slug: "calzature", items: shoes },
    { label: "Accessori", slug: "accessori", items: accessories },
  ],
  uomo: [
    { label: "Abbigliamento", slug: "abbigliamento", items: apparelUomo },
    { label: "Calzature", slug: "calzature", items: shoes },
    { label: "Accessori", slug: "accessori", items: accessories },
  ],
  bambino: [
    { label: "Abbigliamento", slug: "abbigliamento", items: apparelBambino },
    { label: "Calzature", slug: "calzature", items: shoes.slice(0, 3) },
    { label: "Accessori", slug: "accessori", items: accessories.slice(0, 4) },
  ],
};

export function categoryLabel(dep: DepartmentSlug, slug: string): string {
  for (const g of navTree[dep]) {
    if (g.slug === slug) return g.label;
    const hit = g.items.find((i) => i.slug === slug);
    if (hit) return hit.label;
  }
  return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
}

/* ------------------------------------------------------------------ */
/* Brand                                                               */
/* ------------------------------------------------------------------ */

export type Brand = { slug: string; name: string; featured?: boolean; image?: string; claim?: string };

export const brands: Brand[] = [
  { slug: "peuterey", name: "Peuterey", featured: true, image: jacket, claim: "Capispalla italiano, dal 1992." },
  { slug: "ea7", name: "EA7", featured: true, image: sweater, claim: "Sportswear tecnico Emporio Armani." },
  { slug: "the-north-face", name: "The North Face", featured: true, image: jacket, claim: "Outdoor performance." },
  { slug: "k-way", name: "K-Way", featured: true, image: jacket, claim: "La giacca antipioggia iconica." },
  { slug: "tommy-hilfiger", name: "Tommy Hilfiger", featured: true, image: tshirt, claim: "Classic american cool." },
  { slug: "calvin-klein", name: "Calvin Klein", featured: true, image: tshirt, claim: "Minimal urban." },
  { slug: "liu-jo", name: "Liu Jo", featured: true, image: dress, claim: "Femminile e contemporaneo." },
  { slug: "guess", name: "Guess", featured: true, image: bag },
  { slug: "napapijri", name: "Napapijri", image: jacket },
  { slug: "levis", name: "Levi's", image: jeans },
  { slug: "vans", name: "Vans", image: sneakers },
  { slug: "dr-martens", name: "Dr. Martens", image: boots },
  { slug: "birkenstock", name: "Birkenstock", image: boots },
  { slug: "adidas", name: "adidas", image: sneakers },
  { slug: "nike", name: "Nike", image: sneakers },
  { slug: "new-balance", name: "New Balance", image: sneakers },
  { slug: "colmar", name: "Colmar", image: jacket },
  { slug: "save-the-duck", name: "Save The Duck", image: jacket },
  { slug: "patrizia-pepe", name: "Patrizia Pepe", image: dress },
  { slug: "michael-kors", name: "Michael Kors", image: bag },
  { slug: "pinko", name: "Pinko", image: dress },
  { slug: "stone-island", name: "Stone Island", image: jacket },
  { slug: "timberland", name: "Timberland", image: boots },
  { slug: "converse", name: "Converse", image: sneakers },
];

export const brandBySlug = (slug: string) => brands.find((b) => b.slug === slug);
export const brandSlug = (name: string) =>
  brands.find((b) => b.name.toLowerCase() === name.toLowerCase())?.slug ??
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/* ------------------------------------------------------------------ */
/* Colori                                                              */
/* ------------------------------------------------------------------ */

export const COLORS: Record<string, { label: string; hex: string }> = {
  nero: { label: "Nero", hex: "#14140f" },
  bianco: { label: "Bianco", hex: "#f6f4ef" },
  blu: { label: "Blu", hex: "#2f4a6b" },
  beige: { label: "Beige", hex: "#d8c6ab" },
  verde: { label: "Verde militare", hex: "#5c6248" },
  grigio: { label: "Grigio", hex: "#8f9092" },
  marrone: { label: "Marrone", hex: "#6c4a30" },
  rosso: { label: "Rosso", hex: "#9c3428" },
  denim: { label: "Denim", hex: "#3c5a78" },
  cuoio: { label: "Cuoio", hex: "#8a5a34" },
};

const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const SHOE_SIZES = ["38", "39", "40", "41", "42", "43", "44", "45"];
const KID_SIZES = ["4A", "6A", "8A", "10A", "12A", "14A"];

function sizesFor(group: Product["group"], dep: DepartmentSlug, out: string[] = []): SizeStock[] {
  const base = group === "calzature" ? SHOE_SIZES : dep === "bambino" ? KID_SIZES : CLOTHING_SIZES;
  if (group === "accessori") return [{ size: "Taglia unica", stock: 6 }];
  return base.map((s, i) => ({ size: s, stock: out.includes(s) ? 0 : ((i * 7) % 5) + 1 }));
}

function v(
  key: string,
  image: string,
  group: Product["group"],
  dep: DepartmentSlug,
  out: string[] = [],
  altImage?: string,
): Variant {
  const c = COLORS[key] ?? { label: key, hex: "#999" };
  return { key, label: c.label, hex: c.hex, image, altImage, sizes: sizesFor(group, dep, out) };
}

type Seed = {
  name: string;
  brand: string;
  dep: DepartmentSlug;
  group: Product["group"];
  cat: string;
  price: number;
  old?: number;
  colors: [string, string][];
  newIn?: boolean;
  best?: boolean;
};

const seeds: Seed[] = [
  // ---- UOMO
  { name: "Giubbotto Guardian", brand: "Peuterey", dep: "uomo", group: "abbigliamento", cat: "giubbotti", price: 329, old: 470, colors: [["verde", jacket], ["nero", jacket], ["beige", sweater]], best: true },
  { name: "Piumino corto imbottito", brand: "Colmar", dep: "uomo", group: "abbigliamento", cat: "giubbotti", price: 289, colors: [["nero", jacket], ["blu", jacket]], newIn: true },
  { name: "Giacca Claude antipioggia", brand: "K-Way", dep: "uomo", group: "abbigliamento", cat: "giubbotti", price: 119, old: 149, colors: [["blu", jacket], ["nero", jacket], ["rosso", jacket]], best: true },
  { name: "Felpa con cappuccio logo", brand: "EA7", dep: "uomo", group: "abbigliamento", cat: "felpe", price: 89.9, old: 119, colors: [["nero", sweater], ["grigio", sweater]], best: true },
  { name: "Maglione girocollo lana", brand: "Napapijri", dep: "uomo", group: "abbigliamento", cat: "maglieria", price: 99, colors: [["beige", sweater], ["blu", sweater], ["nero", sweater]] },
  { name: "T-shirt cotone logo", brand: "Calvin Klein", dep: "uomo", group: "abbigliamento", cat: "t-shirt", price: 39.9, colors: [["bianco", tshirt], ["nero", tshirt]], newIn: true },
  { name: "Polo piqué regular fit", brand: "Tommy Hilfiger", dep: "uomo", group: "abbigliamento", cat: "polo", price: 79.9, old: 99, colors: [["blu", tshirt], ["bianco", tshirt], ["verde", tshirt]] },
  { name: "Jeans slim fit lavaggio medio", brand: "Levi's", dep: "uomo", group: "abbigliamento", cat: "jeans", price: 79.9, old: 109.9, colors: [["denim", jeans], ["nero", jeans]], best: true },
  { name: "Camicia flanella quadri", brand: "Tommy Hilfiger", dep: "uomo", group: "abbigliamento", cat: "camicie", price: 89, colors: [["rosso", tshirt], ["blu", tshirt]], newIn: true },
  { name: "Sneakers basse in pelle", brand: "Vans", dep: "uomo", group: "calzature", cat: "sneakers", price: 89, colors: [["bianco", sneakers], ["nero", sneakers]], best: true },
  { name: "Sneakers running mesh", brand: "New Balance", dep: "uomo", group: "calzature", cat: "sneakers", price: 129, old: 159, colors: [["grigio", sneakers], ["blu", sneakers]] },
  { name: "Stivaletti pelle scamosciata", brand: "Timberland", dep: "uomo", group: "calzature", cat: "stivaletti", price: 179, colors: [["cuoio", boots], ["nero", boots]] },
  { name: "Zaino tecnico 20L", brand: "The North Face", dep: "uomo", group: "accessori", cat: "zaini", price: 95, colors: [["nero", bag], ["verde", bag]] },
  { name: "Cintura pelle reversibile", brand: "Calvin Klein", dep: "uomo", group: "accessori", cat: "cinture", price: 69, old: 89, colors: [["nero", bag]] },
  { name: "Cappello beanie a costine", brand: "Napapijri", dep: "uomo", group: "accessori", cat: "cappelli", price: 35, colors: [["nero", sweater], ["beige", sweater]] },

  // ---- DONNA
  { name: "Abito corto in denim", brand: "Liu Jo", dep: "donna", group: "abbigliamento", cat: "abiti", price: 149, old: 199, colors: [["denim", dress], ["nero", dress]], best: true },
  { name: "Abito midi stampa floreale", brand: "Pinko", dep: "donna", group: "abbigliamento", cat: "abiti", price: 189, colors: [["beige", dress], ["rosso", dress]], newIn: true },
  { name: "Piumino leggero con cappuccio", brand: "Save The Duck", dep: "donna", group: "abbigliamento", cat: "giubbotti", price: 249, old: 299, colors: [["beige", jacket], ["nero", jacket], ["verde", jacket]], best: true },
  { name: "Cappotto in misto lana", brand: "Patrizia Pepe", dep: "donna", group: "abbigliamento", cat: "giacche", price: 349, colors: [["beige", jacket], ["nero", jacket]], newIn: true },
  { name: "Maglione a costa inglese", brand: "Liu Jo", dep: "donna", group: "abbigliamento", cat: "maglieria", price: 99, colors: [["beige", sweater], ["nero", sweater], ["blu", sweater]] },
  { name: "Felpa oversize con logo", brand: "EA7", dep: "donna", group: "abbigliamento", cat: "felpe", price: 89, old: 109, colors: [["grigio", sweater], ["nero", sweater]] },
  { name: "T-shirt in cotone organico", brand: "Calvin Klein", dep: "donna", group: "abbigliamento", cat: "t-shirt", price: 29.9, colors: [["bianco", tshirt], ["nero", tshirt], ["beige", tshirt]], newIn: true },
  { name: "Jeans vita alta wide leg", brand: "Levi's", dep: "donna", group: "abbigliamento", cat: "jeans", price: 99, old: 129, colors: [["denim", jeans], ["nero", jeans]], best: true },
  { name: "Sneakers platform in pelle", brand: "adidas", dep: "donna", group: "calzature", cat: "sneakers", price: 109, colors: [["bianco", sneakers], ["nero", sneakers]] },
  { name: "Stivaletti in pelle con tacco", brand: "Dr. Martens", dep: "donna", group: "calzature", cat: "stivaletti", price: 179, colors: [["marrone", boots], ["nero", boots]], best: true },
  { name: "Borsa a tracolla piccola", brand: "Guess", dep: "donna", group: "accessori", cat: "borse", price: 119, old: 149, colors: [["nero", bag], ["marrone", bag]], best: true },
  { name: "Borsa shopper logata", brand: "Michael Kors", dep: "donna", group: "accessori", cat: "borse", price: 229, colors: [["cuoio", bag], ["nero", bag]], newIn: true },
  { name: "Sciarpa in lana con frange", brand: "Liu Jo", dep: "donna", group: "accessori", cat: "sciarpe", price: 59, old: 79, colors: [["beige", sweater], ["grigio", sweater]] },

  // ---- BAMBINO
  { name: "Giubbotto imbottito junior", brand: "K-Way", dep: "bambino", group: "abbigliamento", cat: "giubbotti", price: 129, old: 159, colors: [["blu", jacket], ["rosso", jacket]], best: true },
  { name: "Felpa con cappuccio kids", brand: "EA7", dep: "bambino", group: "abbigliamento", cat: "felpe", price: 69, colors: [["nero", sweater], ["grigio", sweater]], newIn: true },
  { name: "T-shirt stampa kids", brand: "Tommy Hilfiger", dep: "bambino", group: "abbigliamento", cat: "t-shirt", price: 34.9, colors: [["bianco", tshirt], ["blu", tshirt]] },
  { name: "Jeans regular junior", brand: "Levi's", dep: "bambino", group: "abbigliamento", cat: "jeans", price: 59, old: 75, colors: [["denim", jeans]] },
  { name: "Sneakers strappo kids", brand: "Nike", dep: "bambino", group: "calzature", cat: "sneakers", price: 69, colors: [["bianco", sneakers], ["nero", sneakers]], best: true },
  { name: "Zainetto scuola", brand: "Vans", dep: "bambino", group: "accessori", cat: "zaini", price: 45, colors: [["nero", bag], ["blu", bag]] },
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const products: Product[] = seeds.map((s) => {
  const outOfStock = s.best ? ["XS", "38"] : [];
  return {
    slug: `${slugify(s.name)}-${slugify(s.brand)}`,
    name: s.name,
    brand: s.brand,
    department: s.dep,
    group: s.group,
    category: s.cat,
    price: s.price,
    oldPrice: s.old,
    newIn: s.newIn,
    bestSeller: s.best,
    variants: s.colors.map(([k, img], i) =>
      v(k, img, s.group, s.dep, i === 0 ? outOfStock : [], s.colors[(i + 1) % s.colors.length]?.[1]),
    ),
    description: `${s.name} di ${s.brand}. PLACEHOLDER: descrizione prodotto dal catalogo.`,
    details: ["Vestibilità regolare", "Logo del brand", "PLACEHOLDER: dettagli da backend"],
    composition: "PLACEHOLDER: composizione da backend",
  };
});

/* ------------------------------------------------------------------ */
/* Query helpers                                                       */
/* ------------------------------------------------------------------ */

export const discountOf = (p: Product) =>
  p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

export const findProduct = (slug: string) => products.find((p) => p.slug === slug);

export const productsByDepartment = (dep: DepartmentSlug) =>
  products.filter((p) => p.department === dep);

export function productsByCategory(dep: DepartmentSlug, cat?: string) {
  const list = productsByDepartment(dep);
  if (!cat) return list;
  return list.filter((p) => p.category === cat || p.group === cat);
}

export const productsByBrand = (slug: string) =>
  products.filter((p) => brandSlug(p.brand) === slug);

export const promoProducts = () => products.filter((p) => p.oldPrice);
export const newArrivals = () => products.filter((p) => p.newIn);
export const bestSellers = () => products.filter((p) => p.bestSeller);

export const colorKeysOf = (p: Product) => p.variants.map((x) => x.key);
export const sizesOf = (p: Product) => {
  const set = new Set<string>();
  p.variants.forEach((x) => x.sizes.forEach((s) => s.stock > 0 && set.add(s.size)));
  return [...set];
};

export function formatPrice(n: number) {
  return `€ ${n.toFixed(2).replace(".", ",")}`;
}

/* Ricerca: prodotti, brand, categorie */
export type SearchResults = {
  brands: Brand[];
  categories: { label: string; dep: DepartmentSlug; slug: string }[];
  products: Product[];
};

export function search(q: string): SearchResults {
  const t = q.trim().toLowerCase();
  if (t.length < 2) return { brands: [], categories: [], products: [] };
  const b = brands.filter((x) => x.name.toLowerCase().includes(t));
  const cats: SearchResults["categories"] = [];
  (Object.keys(navTree) as DepartmentSlug[]).forEach((dep) => {
    navTree[dep].forEach((g) =>
      g.items.forEach((i) => {
        if (i.label.toLowerCase().includes(t) && cats.length < 6)
          cats.push({ label: `${i.label} ${dep}`, dep, slug: i.slug });
      }),
    );
  });
  const p = products.filter(
    (x) =>
      x.name.toLowerCase().includes(t) ||
      x.brand.toLowerCase().includes(t) ||
      x.category.includes(t),
  );
  return { brands: b.slice(0, 4), categories: cats, products: p.slice(0, 8) };
}

export const popularSearches = ["Peuterey", "Piumino", "Sneakers", "Liu Jo", "Felpe EA7", "Jeans"];

/* Campagne / promo — PLACEHOLDER: gestibili da backend */
export type Campaign = {
  slug: string;
  label: string;
  headline: string;
  copy: string;
  image: string;
  imageMobile?: string;
  cta: { label: string; to: string }[];
  quickCats?: { label: string; dep: DepartmentSlug; slug: string }[];
};

export const campaigns: Campaign[] = [
  {
    slug: "new-season",
    label: "New season",
    headline: "Autunno / Inverno 2026",
    copy: "I nuovi arrivi dei brand che ami, selezionati per te.",
    image: heroAw,
    imageMobile: heroAwMobile,
    cta: [
      { label: "Shop Donna", to: "donna" },
      { label: "Shop Uomo", to: "uomo" },
    ],
  },
  {
    slug: "promo-autunno",
    label: "Promo d'autunno",
    headline: "Fino al -40% su capispalla",
    copy: "Giubbotti, piumini e cappotti selezionati dei migliori brand.",
    image: promoAutunno,
    imageMobile: promoAutunno,
    cta: [{ label: "Scopri la promo", to: "promo" }],
    quickCats: [
      { label: "Giubbotti", dep: "uomo", slug: "giubbotti" },
      { label: "Giacche e cappotti", dep: "donna", slug: "giacche" },
      { label: "Felpe", dep: "uomo", slug: "felpe" },
      { label: "Sneakers", dep: "donna", slug: "sneakers" },
    ],
  },
];

export const editorialImage = editorial;
