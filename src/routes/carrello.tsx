import { createFileRoute, Link } from "@tanstack/react-router";
import { CreditCard, Minus, Plus, RotateCcw, ShoppingBag, Trash2, Truck } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { formatPrice } from "@/lib/catalog";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/carrello")({
  head: () => ({
    meta: [
      { title: "Carrello — MyBrand Italia" },
      { name: "description", content: "Rivedi i tuoi articoli e completa l'ordine su MyBrand Italia." },
      { property: "og:title", content: "Carrello — MyBrand Italia" },
      { property: "og:description", content: "Rivedi i tuoi articoli e completa l'ordine su MyBrand Italia." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, cartTotal, cartCount, setQty, removeLine, hydrated } = useStore();

  return (
    <SiteLayout>
      <div className="container-mb py-8">
        <h1 className="text-2xl font-semibold tracking-tight">Carrello</h1>

        {hydrated && cart.length === 0 && (
          <div className="py-16 text-center">
            <ShoppingBag className="mx-auto h-8 w-8 text-muted-foreground" strokeWidth={1.25} />
            <p className="mt-3 text-sm text-muted-foreground">Il tuo carrello è vuoto.</p>
            <Link to="/" className="btn-primary mt-5 inline-flex">
              Torna allo shopping
            </Link>
          </div>
        )}

        {cart.length > 0 && (
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
            <ul className="divide-y divide-border border-y border-border">
              {cart.map((l, i) => (
                <li key={`${l.slug}-${l.color}-${l.size}-${i}`} className="flex gap-3 py-4">
                  <Link to="/prodotto/$slug" params={{ slug: l.slug }} className="shrink-0">
                    <img src={l.image} alt="" width={96} height={128} className="h-32 w-24 object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.08em]">{l.brand}</div>
                    <Link to="/prodotto/$slug" params={{ slug: l.slug }} className="block text-sm text-muted-foreground">
                      {l.name}
                    </Link>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Colore {l.color} · Taglia {l.size}
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => setQty(i, l.qty - 1)}
                          aria-label="Riduci quantità"
                          className="flex h-10 w-10 items-center justify-center"
                        >
                          <Minus className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                        <span className="w-8 text-center text-sm">{l.qty}</span>
                        <button
                          onClick={() => setQty(i, l.qty + 1)}
                          aria-label="Aumenta quantità"
                          className="flex h-10 w-10 items-center justify-center"
                        >
                          <Plus className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeLine(i)}
                        aria-label="Rimuovi"
                        className="flex h-10 w-10 items-center justify-center text-muted-foreground"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                      <div className="ml-auto text-sm font-semibold">{formatPrice(l.price * l.qty)}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="lg:sticky lg:top-40 lg:self-start">
              <div className="border border-border p-4">
                <h2 className="text-sm font-semibold uppercase tracking-[0.12em]">Riepilogo</h2>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Articoli ({cartCount})</dt>
                    <dd>{formatPrice(cartTotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Spedizione</dt>
                    <dd className="text-muted-foreground">Calcolata al checkout</dd>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
                    <dt>Totale</dt>
                    <dd>{formatPrice(cartTotal)}</dd>
                  </div>
                </dl>
                <button className="btn-primary mt-4 w-full">Vai al checkout</button>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  PLACEHOLDER: il checkout sarà collegato al backend.
                </p>
                <ul className="mt-4 space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
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
              </div>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
