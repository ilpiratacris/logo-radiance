import { Link } from "@tanstack/react-router";
import { Heart, Plus } from "lucide-react";
import { useState } from "react";
import { discountOf, formatPrice, type Product } from "@/lib/catalog";
import { useStore } from "@/lib/store";
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
        <Link
          to="/prodotto/$slug"
          params={{ slug: product.slug }}
          className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-surface">
            <img
              src={variant.image}
              alt={`${product.brand} ${product.name} — ${variant.label}`}
              loading={priority ? "eager" : "lazy"}
              width={800}
              height={1066}
              className="h-full w-full object-cover transition-opacity duration-300 md:group-hover:opacity-0"
            />
            {variant.altImage && (
              <img
                src={variant.altImage}
                alt=""
                aria-hidden="true"
                loading="lazy"
                width={800}
                height={1066}
                className="absolute inset-0 hidden h-full w-full object-cover opacity-0 transition-opacity duration-300 md:block md:group-hover:opacity-100"
              />
            )}

            {/* max 2 badge */}
            <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
              {discount > 0 && (
                <span className="bg-[color:var(--color-sale)] px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-background">
                  −{discount}%
                </span>
              )}
              {badge && (
                <span className="bg-foreground px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-background">
                  {badge}
                </span>
              )}
            </div>
          </div>
        </Link>

        <button
          aria-label={liked ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
          aria-pressed={liked}
          onClick={() => toggleWishlist(product.slug)}
          className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-background/85 backdrop-blur">
            <Heart
              className={`h-4 w-4 transition-transform ${liked ? "scale-110 fill-[color:var(--color-sale)] text-[color:var(--color-sale)]" : ""}`}
              strokeWidth={1.5}
            />
          </span>
        </button>

        {/* Quick add: discreto su mobile, in hover su desktop */}
        <button
          onClick={() => setQuickAdd(true)}
          aria-label={`Aggiungi rapido ${product.name}`}
          className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 backdrop-blur transition-opacity md:opacity-0 md:group-hover:opacity-100"
        >
          <Plus className="h-4 w-4" strokeWidth={1.75} />
        </button>

        <div className="pt-2.5">
          <Link to="/prodotto/$slug" params={{ slug: product.slug }} className="block">
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em]">{product.brand}</div>
            <div className="mt-0.5 line-clamp-1 text-[13px] text-muted-foreground">{product.name}</div>
            <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
              <span
                className={`text-sm font-semibold ${discount > 0 ? "text-[color:var(--color-sale)]" : ""}`}
              >
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
          </Link>

          {/* varianti colore: miniature reali del prodotto */}
          {product.variants.length > 1 && (
            <div className="mt-2 flex items-center gap-1.5">
              {product.variants.slice(0, 4).map((v, i) => (
                <button
                  key={v.key}
                  onClick={() => setVIndex(i)}
                  aria-label={`Colore ${v.label}`}
                  aria-pressed={i === vIndex}
                  className={`h-8 w-7 overflow-hidden border ${
                    i === vIndex ? "border-foreground" : "border-border"
                  }`}
                >
                  {v.image ? (
                    <img src={v.image} alt="" width={56} height={64} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <span className="block h-full w-full" style={{ background: v.hex }} />
                  )}
                </button>
              ))}
              {product.variants.length > 4 && (
                <span className="text-[11px] text-muted-foreground">+{product.variants.length - 4}</span>
              )}
            </div>
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
