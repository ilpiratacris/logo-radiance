import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/mock-data";

export function ProductCard({ product }: { product: Product }) {
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  return (
    <Link
      to="/prodotto/$slug"
      params={{ slug: product.slug }}
      className="group block"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={1000}
          className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
        />
        {product.altImage && (
          <img
            src={product.altImage}
            alt=""
            loading="lazy"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
              product.badge === "Ultimi pezzi"
                ? "bg-accent text-accent-foreground"
                : "bg-foreground text-background"
            }`}
          >
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-medium bg-background text-[color:var(--color-sale)]">
            −{discount}%
          </span>
        )}
        <button
          aria-label="Aggiungi ai preferiti"
          onClick={(e) => e.preventDefault()}
          className="absolute bottom-3 right-3 h-8 w-8 items-center justify-center rounded-full bg-background/90 backdrop-blur hidden group-hover:flex hover:bg-background"
        >
          <Heart className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
      <div className="pt-3">
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground">
          {product.brand}
        </div>
        <div className="mt-1 text-sm text-muted-foreground line-clamp-1">{product.name}</div>
        <div className="mt-2 flex items-baseline gap-2">
          <span
            className={`text-sm font-semibold ${
              discount > 0 ? "text-[color:var(--color-sale)]" : "text-foreground"
            }`}
          >
            € {product.price.toFixed(2).replace(".", ",")}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">
              € {product.oldPrice.toFixed(2).replace(".", ",")}
            </span>
          )}
        </div>
        {product.colors.length > 0 && (
          <div className="mt-2 flex gap-1">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c}
                className="h-3 w-3 rounded-full border border-border"
                style={{ background: c }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-muted-foreground">+{product.colors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
