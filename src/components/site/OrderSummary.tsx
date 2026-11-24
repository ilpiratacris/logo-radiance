import { Reassure } from "@/components/site/Reassure";
import { formatPrice } from "@/lib/catalog";

/** Riepilogo ordine: articoli a prezzo pieno, sconto, spedizione e totale. */
export function OrderSummary({
  count,
  total,
  discount = 0,
  shipping = "Calcolata al checkout",
}: {
  count: number;
  total: number;
  discount?: number;
  shipping?: string;
}) {
  return (
    <div className="border border-border p-4">
      <h2 className="label-caps text-sm">Riepilogo</h2>
      <dl className="mt-4 grid gap-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Articoli ({count})</dt>
          <dd>{formatPrice(total + discount)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sale">
            <dt>Sconto</dt>
            <dd>− {formatPrice(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Spedizione</dt>
          <dd className="text-muted-foreground">{shipping}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
          <dt>Totale</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
      <button type="button" className="btn-primary mt-4 w-full">
        Vai al checkout
      </button>
      <Reassure />
    </div>
  );
}
