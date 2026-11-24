export type SizeOption = { size: string; stock?: number };

/**
 * Griglia taglie. Selezione singola nella scheda prodotto, multipla nei filtri.
 * Taglia esaurita: barrata e non selezionabile.
 */
export function SizeSelector({
  sizes,
  selected,
  onSelect,
  large,
  columns = "grid-cols-4",
  showStock,
}: {
  sizes: SizeOption[];
  selected: string[];
  onSelect: (size: string) => void;
  /** 48px invece di 44px (scheda prodotto). */
  large?: boolean;
  /** classi Tailwind delle colonne, es. "grid-cols-4 lg:grid-cols-6" */
  columns?: string;
  /** mostra «Solo N disponibili» per la taglia scelta */
  showStock?: boolean;
}) {
  const current = selected.length === 1 ? sizes.find((s) => s.size === selected[0]) : undefined;
  const stock = current?.stock ?? 0;

  return (
    <div>
      <div className={`grid gap-2 ${columns}`}>
        {sizes.map((s) => {
          const out = s.stock === 0;
          const on = selected.includes(s.size);
          // le etichette lunghe («Taglia unica») occupano più celle invece di sbordare
          const wide = s.size.length > 4;
          return (
            <button
              key={s.size}
              type="button"
              disabled={out}
              onClick={() => onSelect(s.size)}
              aria-pressed={on}
              aria-label={out ? `Taglia ${s.size}, esaurita` : `Taglia ${s.size}`}
              className={`${large ? "h-12" : "h-11"} ${wide ? "col-span-3 px-3" : ""} whitespace-nowrap border text-sm transition-colors ${
                on
                  ? "border-foreground bg-foreground text-background"
                  : out
                    ? "cursor-not-allowed border-border text-muted-foreground line-through opacity-50"
                    : "border-border hover:border-foreground hover:bg-surface"
              }`}
            >
              {s.size}
            </button>
          );
        })}
      </div>
      {showStock && stock > 0 && stock <= 3 && (
        <p className="mt-2 text-xs text-sale">Solo {stock} disponibili</p>
      )}
    </div>
  );
}
