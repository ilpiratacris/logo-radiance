import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { BottomSheet } from "@/components/site/BottomSheet";
import { CartLineRow } from "@/components/site/CartLineRow";
import { Price } from "@/components/site/Price";
import { Reassure } from "@/components/site/Reassure";
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
        <div className="grid gap-2">
          <div className="flex items-center justify-between px-1 text-sm">
            <span className="text-muted-foreground">Totale ({cartCount})</span>
            <span className="font-semibold">{formatPrice(cartTotal)}</span>
          </div>
          <Link to="/carrello" onClick={closeCart} className="btn-primary w-full">
            Vai al carrello
          </Link>
          <button type="button" onClick={closeCart} className="btn-outline w-full">
            Continua lo shopping
          </button>
        </div>
      }
    >
      <div className="p-4">
        {lastAdded && (
          <div className="flex items-start gap-3 border border-border p-3">
            <img
              src={lastAdded.image}
              alt=""
              width={72}
              height={96}
              className="h-24 w-[72px] shrink-0 object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs font-medium text-accent">
                <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" /> Aggiunto
              </div>
              <div className="brand-label mt-1">{lastAdded.brand}</div>
              <div className="truncate text-sm text-muted-foreground">{lastAdded.name}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {lastAdded.color} · Taglia {lastAdded.size}
              </div>
              <Price price={lastAdded.price} oldPrice={lastAdded.oldPrice} className="mt-1" />
            </div>
          </div>
        )}

        {cart.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Il tuo carrello è vuoto.
          </p>
        )}

        {cart.length > (lastAdded ? 1 : 0) && (
          <ul
            className={`divide-y divide-border border-t border-border ${lastAdded ? "mt-4" : ""}`}
          >
            {cart.map((l, i) => (
              <li key={`${l.slug}-${l.color}-${l.size}-${i}`}>
                <CartLineRow line={l} compact />
              </li>
            ))}
          </ul>
        )}

        <Reassure className={cart.length > 0 ? "mt-0" : "mt-4"} />

        {suggestions.length > 0 && (
          <div className="mt-6">
            <div className="eyebrow">Completa il look</div>
            <ul className="mt-3 grid gap-3">
              {suggestions.map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/prodotto/$slug"
                    params={{ slug: p.slug }}
                    onClick={closeCart}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={p.variants[0].image}
                      alt=""
                      width={56}
                      height={72}
                      loading="lazy"
                      className="h-[72px] w-14 shrink-0 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="brand-label">{p.brand}</div>
                      <div className="truncate text-xs text-muted-foreground">{p.name}</div>
                      <Price price={p.price} oldPrice={p.oldPrice} />
                    </div>
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
