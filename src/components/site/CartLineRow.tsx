import { Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { QuantityStepper } from "@/components/site/QuantityStepper";
import { formatPrice } from "@/lib/catalog";
import type { CartLine } from "@/lib/store";

/** Totale di riga: in offerta il pieno barrato sopra il ridotto in rosso. */
function LineTotal({ line }: { line: CartLine }) {
  const sale = line.oldPrice !== undefined && line.oldPrice > line.price;
  return (
    <div
      className={`ml-auto text-sm font-semibold ${sale ? "whitespace-nowrap text-right text-sale" : ""}`}
    >
      {sale && (
        <span className="block text-xs font-normal leading-4 text-muted-foreground line-through">
          {formatPrice(line.oldPrice! * line.qty)}
        </span>
      )}
      {formatPrice(line.price * line.qty)}
    </div>
  );
}

/**
 * Riga prodotto del carrello.
 * `compact`: versione del pannello laterale, senza controlli.
 */
export function CartLineRow({
  line,
  compact,
  onQty,
  onRemove,
  onNavigate,
}: {
  line: CartLine;
  compact?: boolean;
  onQty?: (qty: number) => void;
  onRemove?: () => void;
  onNavigate?: () => void;
}) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 py-3">
        <img
          src={line.image}
          alt=""
          width={56}
          height={72}
          loading="lazy"
          className="h-[72px] w-14 shrink-0 object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="brand-label">{line.brand}</div>
          <div className="truncate text-xs text-muted-foreground">{line.name}</div>
          <div className="truncate text-xs text-muted-foreground">
            {line.color} · {line.size} · {line.qty} pz
          </div>
        </div>
        <LineTotal line={line} />
      </div>
    );
  }

  return (
    <div className="flex gap-3 py-4">
      <Link
        to="/prodotto/$slug"
        params={{ slug: line.slug }}
        onClick={onNavigate}
        className="shrink-0"
      >
        <img
          src={line.image}
          alt={`${line.brand} ${line.name}`}
          width={96}
          height={128}
          className="h-32 w-24 object-cover"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="brand-label">{line.brand}</div>
        <Link
          to="/prodotto/$slug"
          params={{ slug: line.slug }}
          onClick={onNavigate}
          className="block text-sm text-muted-foreground hover:text-foreground"
        >
          {line.name}
        </Link>
        <div className="mt-1 text-xs text-muted-foreground">
          Colore {line.color} · Taglia {line.size}
        </div>
        <div className="mt-2 flex items-center gap-3">
          <QuantityStepper value={line.qty} onChange={(q) => onQty?.(q)} />
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Rimuovi ${line.name}`}
            className="icon-btn text-muted-foreground"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
          <LineTotal line={line} />
        </div>
      </div>
    </div>
  );
}
