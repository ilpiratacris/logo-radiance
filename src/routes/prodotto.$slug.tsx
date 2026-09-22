import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronDown, CreditCard, Heart, Ruler, RotateCcw, Truck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCarousel } from "@/components/site/ProductCarousel";
import { RecentlyViewed } from "@/components/site/RecentlyViewed";
import { SizeGuide } from "@/components/site/SizeGuide";
import { BrandMark } from "@/components/site/BrandMark";
import {
  brandSlug,
  discountOf,
  findProduct,
  formatPrice,
  productsByBrand,
  productsByCategory,
  products,
  type Product,
} from "@/lib/catalog";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/prodotto/$slug")({
  loader: ({ params }) => {
    const p = findProduct(params.slug);
    if (!p) throw notFound();
    return { name: p.name, brand: p.brand, price: p.price };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Prodotto non disponibile — MyBrand Italia" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.brand} ${loaderData.name} | MyBrand Italia`;
    const description = `${loaderData.brand} ${loaderData.name} a ${formatPrice(loaderData.price)}. Acquista online su MyBrand Italia: taglie, colori e spedizione tracciata.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-mb py-20 text-center">
        <h1 className="text-xl font-semibold">Prodotto non disponibile</h1>
        <Link to="/" className="btn-primary mt-5 inline-flex">
          Torna alla home
        </Link>
      </div>
    </SiteLayout>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const product = findProduct(slug)!;
  const { addToCart, toggleWishlist, inWishlist, pushRecent, hydrated } = useStore();

  const [vi, setVi] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [openAcc, setOpenAcc] = useState<string | null>("descrizione");

  const variant = product.variants[vi] ?? product.variants[0]!;
  const discount = discountOf(product);
  const liked = hydrated && inWishlist(product.slug);

  useEffect(() => {
    setVi(0);
    setSize(null);
  }, [slug]);

  useEffect(() => {
    pushRecent(product.slug);
  }, [product.slug, pushRecent]);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 520);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const gallery = useMemo(
    () => [variant.image, variant.altImage, ...product.variants.filter((_, i) => i !== vi).map((v) => v.image)]
      .filter((x): x is string => Boolean(x))
      .slice(0, 5),
    [variant, product.variants, vi],
  );
  const [mainIdx, setMainIdx] = useState(0);
  useEffect(() => setMainIdx(0), [vi]);

  const stockOf = (s: string) => variant.sizes.find((x) => x.size === s)?.stock ?? 0;
  const selectedStock = size ? stockOf(size) : 0;

  const add = () => {
    if (!size) return;
    addToCart({
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      image: variant.image,
      color: variant.label,
      size,
      price: product.price,
      qty: 1,
    });
  };

  const related = productsByCategory(product.department, product.category).filter((p) => p.slug !== product.slug);
  const sameBrand = productsByBrand(brandSlug(product.brand)).filter((p) => p.slug !== product.slug);
  const look: Product[] = products
    .filter((p) => p.department === product.department && p.group !== product.group)
    .slice(0, 8);

  const accordions = [
    { id: "descrizione", label: "Descrizione", body: <p>{product.description}</p> },
    {
      id: "dettagli",
      label: "Dettagli",
      body: (
        <ul className="list-disc pl-4">
          {product.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      ),
    },
    { id: "composizione", label: "Composizione", body: <p>{product.composition}</p> },
    {
      id: "spedizione",
      label: "Spedizione e reso",
      body: <p>PLACEHOLDER: tempi, costi e condizioni di reso da backend.</p>,
    },
    { id: "pagamenti", label: "Pagamenti", body: <p>PLACEHOLDER: metodi di pagamento da backend.</p> },
  ];

  return (
    <SiteLayout hideBottomNav={showSticky}>
      <nav aria-label="Breadcrumb" className="container-mb pt-3 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="px-1.5">/</span>
        <Link to="/categoria/$slug" params={{ slug: product.department }} className="capitalize hover:text-foreground">
          {product.department}
        </Link>
        <span className="px-1.5">/</span>
        <Link
          to="/categoria/$slug"
          params={{ slug: product.department }}
          search={{ cat: product.category }}
          className="capitalize hover:text-foreground"
        >
          {product.category.replace(/-/g, " ")}
        </Link>
      </nav>

      <div className="container-mb grid gap-6 pt-3 lg:grid-cols-[55%_1fr] lg:gap-10">
        {/* GALLERY */}
        <div className="lg:flex lg:gap-3">
          <div className="order-2 hidden shrink-0 flex-col gap-2 lg:flex">
            {gallery.map((g, i) => (
              <button
                key={`${g}-${i}`}
                onClick={() => setMainIdx(i)}
                aria-label={`Immagine ${i + 1}`}
                className={`h-20 w-16 overflow-hidden border ${
                  mainIdx === i ? "border-foreground" : "border-border"
                }`}
              >
                <img src={g} alt="" width={64} height={80} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          {/* mobile: swipe */}
          <div className="order-1 -mx-4 flex snap-x snap-mandatory gap-1 overflow-x-auto lg:mx-0 lg:block lg:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {gallery.map((g, i) => (
              <img
                key={`${g}-m-${i}`}
                src={g}
                alt={`${product.brand} ${product.name}`}
                width={900}
                height={1200}
                loading={i === 0 ? "eager" : "lazy"}
                className={`w-[86%] shrink-0 snap-center bg-surface object-cover lg:w-full lg:max-h-[700px] ${
                  i === mainIdx ? "lg:block" : "lg:hidden"
                }`}
              />
            ))}
          </div>
          <div className="order-3 flex justify-center gap-1.5 lg:hidden">
            {gallery.map((_, i) => (
              <span key={i} className="h-1 w-6 bg-border" />
            ))}
          </div>
        </div>

        {/* INFO */}
        <div className="lg:pt-2">
          <div className="flex items-center gap-3">
            <BrandMark brand={product.brand} />
            <Link
              to="/brand/$slug"
              params={{ slug: brandSlug(product.brand) }}
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Vedi tutto {product.brand}
            </Link>
          </div>
          <h1 className="mt-2 text-xl font-medium md:text-2xl">{product.name}</h1>

          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-2xl font-semibold ${discount ? "text-[color:var(--color-sale)]" : ""}`}>
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <>
                <span className="text-sm text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
                <span className="text-sm font-semibold text-[color:var(--color-sale)]">−{discount}%</span>
              </>
            )}
          </div>

          {/* COLORE: thumbnail reali */}
          <div className="mt-6">
            <div className="text-xs font-semibold uppercase tracking-[0.12em]">
              Colore: <span className="font-normal normal-case tracking-normal text-muted-foreground">{variant.label}</span>
            </div>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {product.variants.map((v, i) => (
                <button
                  key={v.key}
                  onClick={() => setVi(i)}
                  aria-label={v.label}
                  aria-pressed={i === vi}
                  className={`h-16 w-14 shrink-0 overflow-hidden border-2 ${
                    i === vi ? "border-foreground" : "border-transparent"
                  }`}
                >
                  <img src={v.image} alt={v.label} width={56} height={64} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* TAGLIA */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-[0.12em]">Taglia</div>
              <button
                onClick={() => setGuideOpen(true)}
                className="flex h-9 items-center gap-1.5 text-xs underline underline-offset-4"
              >
                <Ruler className="h-3.5 w-3.5" strokeWidth={1.5} /> Guida alle taglie
              </button>
            </div>
            <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6">
              {variant.sizes.map((s) => {
                const out = s.stock === 0;
                return (
                  <button
                    key={s.size}
                    disabled={out}
                    onClick={() => setSize(s.size)}
                    aria-pressed={size === s.size}
                    className={`h-12 border text-sm ${
                      size === s.size
                        ? "border-foreground bg-foreground text-background"
                        : out
                          ? "cursor-not-allowed border-border text-muted-foreground line-through opacity-50"
                          : "border-border hover:border-foreground"
                    }`}
                  >
                    {s.size}
                  </button>
                );
              })}
            </div>
            {size && selectedStock > 0 && selectedStock <= 3 && (
              <p className="mt-2 text-xs text-[color:var(--color-sale)]">Solo {selectedStock} disponibili</p>
            )}
          </div>

          {/* CTA */}
          <div className="mt-6 flex gap-2">
            <button onClick={add} disabled={!size} className="btn-primary flex-1 disabled:opacity-60">
              {size ? "Aggiungi al carrello" : "Seleziona una taglia"}
            </button>
            <button
              onClick={() => toggleWishlist(product.slug)}
              aria-label={liked ? "Rimuovi dalla wishlist" : "Aggiungi alla wishlist"}
              aria-pressed={liked}
              className="flex h-12 w-12 shrink-0 items-center justify-center border border-border-strong"
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} strokeWidth={1.5} />
            </button>
          </div>

          <ul className="mt-5 space-y-2 border-t border-border pt-5 text-xs text-muted-foreground">
            <li className="flex items-center gap-2">
              <Truck className="h-4 w-4" strokeWidth={1.5} /> Spedizione tracciata — tempi da backend
            </li>
            <li className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" strokeWidth={1.5} /> Reso facile — condizioni da backend
            </li>
            <li className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" strokeWidth={1.5} /> Pagamenti sicuri
            </li>
          </ul>

          {/* ACCORDION */}
          <div className="mt-6 border-t border-border">
            {accordions.map((a) => (
              <div key={a.id} className="border-b border-border">
                <button
                  onClick={() => setOpenAcc(openAcc === a.id ? null : a.id)}
                  aria-expanded={openAcc === a.id}
                  className="flex h-14 w-full items-center justify-between text-sm font-medium"
                >
                  {a.label}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${openAcc === a.id ? "rotate-180" : ""}`}
                    strokeWidth={1.5}
                  />
                </button>
                {openAcc === a.id && (
                  <div className="pb-4 text-sm leading-relaxed text-muted-foreground">{a.body}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CROSS SELLING */}
      <ProductCarousel eyebrow="Completa il look" title="Si abbina con" products={look} />
      <ProductCarousel eyebrow="Potrebbe piacerti" title="Prodotti simili" products={related.slice(0, 10)} />
      {sameBrand.length > 0 && (
        <ProductCarousel
          eyebrow="Stesso brand"
          title={`Altri prodotti ${product.brand}`}
          products={sameBrand.slice(0, 10)}
          to="/brand/$slug"
          toParams={{ slug: brandSlug(product.brand) }}
        />
      )}
      <RecentlyViewed exclude={product.slug} />

      {/* STICKY ADD TO CART */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur transition-transform lg:hidden ${
          showSticky ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 8px)" }}
      >
        <div className="flex items-center gap-3 px-4 py-2.5">
          <img src={variant.image} alt="" width={40} height={52} className="h-[52px] w-10 object-cover" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[11px] font-semibold uppercase tracking-[0.08em]">{product.brand}</div>
            <div className="text-sm font-semibold">{formatPrice(product.price)}</div>
          </div>
          <button onClick={add} disabled={!size} className="btn-primary h-12 px-5 disabled:opacity-60">
            {size ? "Aggiungi" : "Seleziona taglia"}
          </button>
        </div>
      </div>

      <SizeGuide open={guideOpen} onClose={() => setGuideOpen(false)} brand={product.brand} />
    </SiteLayout>
  );
}
