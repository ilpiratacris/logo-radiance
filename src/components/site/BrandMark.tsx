import { Link } from "@tanstack/react-router";
import { brandBySlug, brandSlug } from "@/lib/catalog";

/**
 * Marchio del brand: usa il logo quando disponibile (campo `logo` del catalogo),
 * altrimenti mostra un wordmark tipografico.
 * PLACEHOLDER: i file logo dei brand dovranno arrivare dal backend.
 */
export function BrandMark({ brand, size = "md" }: { brand: string; size?: "sm" | "md" }) {
  const slug = brandSlug(brand);
  const logo = brandBySlug(slug)?.logo;
  const h = size === "sm" ? "h-8" : "h-10";

  return (
    <Link
      to="/brand/$slug"
      params={{ slug }}
      aria-label={`Vedi tutti i prodotti ${brand}`}
      className={`inline-flex ${h} items-center border border-border bg-background px-3 transition-colors hover:border-foreground`}
    >
      {logo ? (
        <img src={logo} alt={brand} height={24} className="max-h-6 w-auto object-contain" />
      ) : (
        <span className="text-sm font-semibold uppercase tracking-[0.18em]">{brand}</span>
      )}
    </Link>
  );
}
