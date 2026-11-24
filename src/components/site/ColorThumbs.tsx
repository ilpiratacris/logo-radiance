import type { Variant } from "@/lib/catalog";

/** Varianti colore come miniature reali del prodotto. */
export function ColorThumbs({
  variants,
  value,
  onChange,
  size = "sm",
  max,
  className = "",
}: {
  variants: Variant[];
  value: number;
  onChange: (index: number) => void;
  size?: "sm" | "md";
  max?: number;
  className?: string;
}) {
  const limit = max ?? variants.length;
  const md = size === "md";

  return (
    <div className={`flex items-center ${md ? "gap-2" : "gap-1.5"} ${className}`}>
      {variants.slice(0, limit).map((v, i) => {
        const on = i === value;
        return (
          <button
            key={v.key}
            type="button"
            onClick={() => onChange(i)}
            aria-label={`Colore ${v.label}`}
            aria-pressed={on}
            className={`shrink-0 overflow-hidden bg-background transition-colors ${
              md
                ? `h-16 w-14 border-2 ${on ? "border-foreground" : "border-transparent hover:border-border-strong"}`
                : `h-8 w-7 border ${on ? "border-foreground" : "border-border hover:border-border-strong"}`
            }`}
          >
            {v.image ? (
              <img
                src={v.image}
                alt=""
                width={56}
                height={64}
                loading="lazy"
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="block h-full w-full" style={{ background: v.hex }} />
            )}
          </button>
        );
      })}
      {variants.length > limit && (
        <span className="text-[11px] text-muted-foreground">+{variants.length - limit}</span>
      )}
    </div>
  );
}
