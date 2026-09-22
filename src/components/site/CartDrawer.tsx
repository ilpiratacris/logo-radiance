import { Link } from "@tanstack/react-router";
import { Check, CreditCard, RotateCcw, Truck } from "lucide-react";
import { BottomSheet } from "@/components/site/BottomSheet";
import { bestSellers, formatPrice } from "@/lib/catalog";
import { useStore } from "@/lib/store";

export function CartDrawer() {
  const { cartOpen, closeCart, lastAdded, cart, cartTotal, cartCount } = useStore();

  const suggestions = bestSellers()
    .filter((p) => p.slug !== lastAdded?.slug)
    .slice(0, 2);

  return (
    <BottomSheet
      open={cartOpen}
      onClose={closeCart}
      side="right"
      title={lastAdded ? "Aggiunto al carrello" : "Carrello"}
      footer={
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1 text-sm">
            <span className="text-muted-foreground">Totale ({cartCount})</span>
            <span className="font-semibold">{formatPrice(cartTotal)}</span>
          </div>
          <Link to="/carrello" onClick={closeCart} className="btn-primary w-full">
            Vai al checkout
          </Link>
          <button onClick={closeCart} className="btn-outline w-full">
            Continua lo shopping
          </button>
        </div>
      }
    >
      <div className="p-4">
        {lastAdded && (
          <div className="flex items-start gap-3 border border-border p-3">
            <img src={lastAdded.image} alt="" width={80} height={100} className="h-24 w-[72px] object-cover" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs font-medium text-[color:var(--color-accent)]">
                <Check className="h-3.5 w-3.5" strokeWidth={2} /> Aggiunto
              </div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em]">{lastAdded.brand}</div>
              <div className="truncate text-sm text-muted-foreground">{lastAdded.name}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {lastAdded.color} · Taglia {lastAdded.size}
              </div>
              <div className="mt-1 text-sm font-semibold">{formatPrice(lastAdded.price)}</div>
            </div>
          </div>
        )}

        {cart.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">Il tuo carrello è vuoto.</p>
        )}

        {cart.length > 1 && (
          <ul className="mt-4 divide-y divide-border border-t border-border">
            {cart.map((l, i) => (
              <li key={`${l.slug}-${l.color}-${l.size}-${i}`} className="flex items-center gap-3 py-3">
                <img src={l.image} alt="" width={56} height={72} className="h-[72px] w-14 object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.08em]">{l.brand}</div>
                  <div className="truncate text-xs text-muted-foreground">{l.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {l.color} · {l.size} · {l.qty} pz
                  </div>
                </div>
                <div className="text-sm font-semibold">{formatPrice(l.price * l.qty)}</div>
              </li>
            ))}
          </ul>
        )}

        <ul className="mt-5 space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
          <li className="flex items-center gap-2">
            <Truck className="h-4 w-4" strokeWidth={1.5} /> Spedizione tracciata
          </li>
          <li className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" strokeWidth={1.5} /> Reso facile
          </li>
          <li className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" strokeWidth={1.5} /> Pagamenti sicuri
          </li>
        </ul>

        {suggestions.length > 0 && (
          <div className="mt-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Completa il look
            </div>
            <ul className="mt-3 space-y-3">
              {suggestions.map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/prodotto/$slug"
                    params={{ slug: p.slug }}
                    onClick={closeCart}
                    className="flex items-center gap-3"
                  >
                    <img src={p.variants[0].image} alt="" width={56} height={72} loading="lazy" className="h-[72px] w-14 object-cover" />
                    <span className="min-w-0">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.08em]">{p.brand}</span>
                      <span className="block truncate text-xs text-muted-foreground">{p.name}</span>
                      <span className="block text-sm font-semibold">{formatPrice(p.price)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
