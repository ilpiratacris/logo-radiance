import { Link } from "@tanstack/react-router";
import { Heart, Plus } from "lucide-react";
import { useState } from "react";
import { discountOf, type Product } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { ColorThumbs } from "@/components/site/ColorThumbs";
import { Price } from "@/components/site/Price";
import { QuickAddSheet } from "@/components/site/QuickAddSheet";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const [vIndex, setVIndex] = useState(0);
  const [quickAdd, setQuickAdd] = useState(false);
  const { inWishlist, toggleWishlist, hydrated } = useStore();

  const variant = product.variants[vIndex] ?? product.variants[0];
  const discount = discountOf(product);
  const liked = hydrated && inWishlist(product.slug);

  const badge = product.newIn ? "Novità" : product.bestSeller ? "Best seller" : null;

  return (
    <>
      <div className="group relative">
        {/* Su mobile l'aggiunta rapida sta sulla foto; su desktop compare al passaggio sulla card. */}
        <div className="relative lg:static">
          <Link
            to="/prodotto/$slug"
            params={{ slug: product.slug }}
            className="relative block aspect-[3/4] overflow-hidden bg-background"
          >
            <img
              src={variant.image}
              alt={`${product.brand} ${product.name} — ${variant.label}`}
              loading={priority ? "eager" : "lazy"}
              width={800}
              height={1066}
              className={`h-full w-full object-contain transition-opacity duration-300 ${
                variant.altImage ? "md:group-hover:opacity-0" : ""
              }`}
            />
            {variant.altImage && (
              <img
                src={variant.altImage}
                alt=""
                aria-hidden="true"
                loading="lazy"
                width={800}
                height={1066}
                className="absolute inset-0 hidden h-full w-full object-contain opacity-0 transition-opacity duration-300 md:block md:group-hover:opacity-100"
              />
            )}

            {/* al massimo due etichette, allineate al bordo sinistro */}
            <div className="absolute left-0 top-2 flex flex-col items-stretch gap-1 text-center text-[10px] leading-[15px] text-background">
              {discount > 0 && (
                <span className="bg-sale px-1.5 py-0.5 font-semibold tracking-wide">
                  −{discount}%
                </span>
              )}
              {badge && (
                <span className="bg-foreground px-1.5 py-0.5 font-medium uppercase tracking-wider">
                  {badge}
                </span>
              )}
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setQuickAdd(true)}
            aria-label={`Aggiungi rapido ${product.name}`}
            className="icon-btn-float card-quick absolute bottom-2 right-2 h-9 w-9"
          >
            <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          aria-label={liked ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
          aria-pressed={liked}
          onClick={() => toggleWishlist(product.slug)}
          className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center"
        >
          <span className="icon-btn-float h-8 w-8">
            <Heart
              className={`h-4 w-4 transition-transform ${liked ? "scale-110 fill-sale text-sale" : ""}`}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </span>
        </button>

        <div className="pt-2.5">
          <Link to="/prodotto/$slug" params={{ slug: product.slug }} className="block">
            <div className="brand-label">{product.brand}</div>
            <div className="mt-0.5 truncate text-[13px] text-muted-foreground">{product.name}</div>
            <Price price={product.price} oldPrice={product.oldPrice} className="mt-1.5" />
          </Link>

          {product.variants.length > 1 && (
            <ColorThumbs
              variants={product.variants}
              value={vIndex}
              onChange={setVIndex}
              max={4}
              className="mt-2"
            />
          )}
        </div>
      </div>

      {quickAdd && (
        <QuickAddSheet
          product={product}
          initialVariant={vIndex}
          open={quickAdd}
          onClose={() => setQuickAdd(false)}
        />
      )}
    </>
  );
}
