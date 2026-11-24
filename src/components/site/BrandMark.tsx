import { Link } from "@tanstack/react-router";
import { brandBySlug, brandSlug } from "@/lib/catalog";

/**
 * Marchio del brand: il logo quando il file è disponibile (campo `logo` del catalogo),
 * altrimenti il nome scritto. Porta alla pagina del brand.
 */
const BOX = { sm: "h-8", md: "h-10", auto: "h-8 lg:h-10" };
const LOGO = { sm: "h-5", md: "h-6", auto: "h-5 lg:h-6" };

export function BrandMark({
  brand,
  size = "md",
}: {
  brand: string;
  /** `auto`: piccolo su mobile, medio su desktop */
  size?: "sm" | "md" | "auto";
}) {
  const slug = brandSlug(brand);
  const logo = brandBySlug(slug)?.logo;

  return (
    <Link
      to="/brand/$slug"
      params={{ slug }}
      aria-label={`Vedi tutti i prodotti ${brand}`}
      className={`inline-flex ${BOX[size]} items-center border border-border bg-background px-3 transition-colors hover:border-foreground hover:bg-surface`}
    >
      {logo ? (
        <img
          src={logo}
          alt={brand}
          className={`${LOGO[size]} w-auto max-w-[140px] object-contain brightness-0`}
        />
      ) : (
        <span className="text-sm font-semibold uppercase tracking-[0.18em]">{brand}</span>
      )}
    </Link>
  );
}
