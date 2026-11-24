import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Accordion, type AccordionItem } from "@/components/site/Accordion";
import { BrandMark } from "@/components/site/BrandMark";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { ColorThumbs } from "@/components/site/ColorThumbs";
import { Price } from "@/components/site/Price";
import { ProductCarousel } from "@/components/site/ProductCarousel";
import { Reassure } from "@/components/site/Reassure";
import { SizeGuide } from "@/components/site/SizeGuide";
import { SizeSelector } from "@/components/site/SizeSelector";
import { StickyAddToCart } from "@/components/site/StickyAddToCart";
import {
  categoryLabel,
  departments,
  discountOf,
  findProduct,
  formatPrice,
  productsByCategory,
  productsByDepartment,
  products,
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
      return {
        meta: [
          { title: "Prodotto non disponibile — MyBrand Italia" },
          { name: "robots", content: "noindex" },
        ],
      };
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
        <Link to="/" className="btn-primary mt-5">
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
  const { addToCart, toggleWishlist, inWishlist, pushRecent, hydrated, department, setDepartment } =
    useStore();

  const [vi, setVi] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  const variant = product.variants[vi] ?? product.variants[0]!;
  const discount = discountOf(product);
  const onSale = discount > 0 && product.oldPrice !== undefined;
  const liked = hydrated && inWishlist(product.slug);
  const depLabel = departments.find((d) => d.slug === product.department)!.label;

  useEffect(() => {
    setVi(0);
    setSize(null);
  }, [slug]);

  useEffect(() => {
    pushRecent(product.slug);
  }, [product.slug, pushRecent]);

  // la testata segue il reparto del prodotto (scheda aperta e sottocategorie)
  useEffect(() => {
    if (product.department !== department) setDepartment(product.department);
  }, [product.department, department, setDepartment]);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 520);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const gallery = useMemo(
    () =>
      [
        variant.image,
        variant.altImage,
        ...product.variants.filter((_, i) => i !== vi).map((v) => v.image),
      ]
        .filter((x): x is string => Boolean(x))
        .filter((x, i, list) => list.indexOf(x) === i)
        .slice(0, 5),
    [variant, product.variants, vi],
  );
  const [mainIdx, setMainIdx] = useState(0);
  useEffect(() => setMainIdx(0), [vi, slug]);
  const mainImage = gallery[mainIdx] ?? variant.image;

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
      oldPrice: product.oldPrice,
      qty: 1,
    });
  };

  const sameCategory = productsByCategory(product.department, product.category).filter(
    (p) => p.slug !== product.slug,
  );
  const similar = (
    sameCategory.length >= 4
      ? sameCategory
      : [
          ...sameCategory,
          ...productsByDepartment(product.department).filter(
            (p) =>
              p.slug !== product.slug && p.group === product.group && !sameCategory.includes(p),
          ),
        ]
  ).slice(0, 10);
  const look = products
    .filter((p) => p.department === product.department && p.group !== product.group)
    .slice(0, 8);

  const accordion: AccordionItem[] = [
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
      body: <p>[Condizioni di spedizione e reso del negozio]</p>,
    },
    { id: "pagamenti", label: "Pagamenti", body: <p>[Metodi di pagamento attivi]</p> },
  ];

  return (
    <SiteLayout hideBottomNav={showSticky}>
      <div className="container-mb pb-8 pt-3 lg:pb-14 lg:pt-5">
        <Breadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: depLabel, to: "/categoria/$slug", params: { slug: product.department } },
            {
              label: categoryLabel(product.department, product.category),
              to: "/categoria/$slug",
              params: { slug: product.department },
              search: { cat: product.category },
            },
          ]}
        />

        <div className="mt-3 grid gap-5 lg:mt-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start lg:gap-12">
          {/* GALLERIA: foto grande, miniature sotto (mobile) o a sinistra (desktop) */}
          <div className="-mx-4 grid gap-3 md:mx-auto md:w-full md:max-w-lg lg:mx-0 lg:max-w-none lg:grid-cols-[88px_minmax(0,1fr)] lg:items-start">
            <div className="relative lg:order-2">
              <img
                src={mainImage}
                alt={`${product.brand} ${product.name}, colore ${variant.label.toLowerCase()}`}
                width={900}
                height={1200}
                fetchPriority="high"
                className="aspect-[3/4] w-full bg-background object-contain"
              />
              {onSale && (
                <span className="absolute left-0 top-3 bg-sale px-2 py-[3px] text-xs font-semibold leading-[18px] tracking-wide text-background">
                  −{discount}%
                </span>
              )}
            </div>
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 md:px-0 lg:order-1 lg:flex-col lg:overflow-visible">
              {gallery.map((g, i) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setMainIdx(i)}
                  aria-label={`Foto ${i + 1}`}
                  aria-pressed={mainIdx === i}
                  className={`w-14 shrink-0 border bg-background transition-colors lg:w-[88px] ${
                    mainIdx === i ? "border-foreground" : "border-border hover:border-border-strong"
                  }`}
                >
                  <img
                    src={g}
                    alt=""
                    width={86}
                    height={115}
                    className="aspect-[3/4] w-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* INFO */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-start gap-2.5 lg:gap-3">
              <BrandMark brand={product.brand} size="auto" />
              <h1 className="text-xl font-medium leading-7 tracking-tight lg:text-2xl lg:leading-8">
                {product.name}
              </h1>
              <Price price={product.price} oldPrice={product.oldPrice} size="lg" showDiscount />
              {onSale && (
                <div className="flex flex-col gap-0.5">
                  <p className="text-[13px] font-semibold leading-[18px] text-sale">
                    Risparmi {formatPrice(product.oldPrice! - product.price)}
                  </p>
                  <p className="text-xs leading-4 text-muted-foreground">
                    Prezzo più basso nei 30 giorni precedenti la riduzione:{" "}
                    <span className="whitespace-nowrap">{formatPrice(product.oldPrice!)}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="label-caps">
                Colore{" "}
                <span className="font-normal normal-case tracking-normal text-muted-foreground">
                  {variant.label}
                </span>
              </div>
              <ColorThumbs
                variants={product.variants}
                value={vi}
                onChange={(i) => {
                  setVi(i);
                  setSize(null);
                }}
                size="md"
                className="no-scrollbar overflow-x-auto"
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="label-caps">Taglia</div>
                <button
                  type="button"
                  onClick={() => setGuideOpen(true)}
                  className="-my-3 py-3 text-xs font-medium leading-4 underline underline-offset-4"
                >
                  Guida alle taglie
                </button>
              </div>
              <SizeSelector
                sizes={variant.sizes}
                selected={size ? [size] : []}
                onSelect={setSize}
                large
                columns="grid-cols-4 lg:grid-cols-6"
                showStock
              />
            </div>

            <div className="flex items-stretch gap-2">
              <button type="button" onClick={add} disabled={!size} className="btn-primary flex-1">
                {size ? "Aggiungi al carrello" : "Seleziona una taglia"}
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.slug)}
                aria-label={liked ? "Rimuovi dalla wishlist" : "Aggiungi alla wishlist"}
                aria-pressed={liked}
                className="icon-btn-boxed"
              >
                <Heart
                  className={`h-5 w-5 ${liked ? "fill-current" : ""}`}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </button>
            </div>

            <Reassure className="mt-0" />

            <Accordion key={product.slug} items={accordion} defaultOpen="descrizione" />
          </div>
        </div>
      </div>

      <ProductCarousel eyebrow="Abbinamenti" title="Completa il look" products={look} />
      <div className="bg-surface">
        <ProductCarousel
          eyebrow="Dalla stessa categoria"
          title="Prodotti simili"
          products={similar}
          to="/categoria/$slug"
          toParams={{ slug: product.department }}
          toSearch={{ cat: product.category }}
        />
      </div>

      <StickyAddToCart
        product={product}
        image={variant.image}
        size={size}
        visible={showSticky}
        onAdd={add}
      />

      <SizeGuide open={guideOpen} onClose={() => setGuideOpen(false)} brand={product.brand} />
    </SiteLayout>
  );
}
