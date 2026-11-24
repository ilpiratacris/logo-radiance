import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CartLineRow } from "@/components/site/CartLineRow";
import { EmptyState } from "@/components/site/EmptyState";
import { OrderSummary } from "@/components/site/OrderSummary";
import { ProductCarousel } from "@/components/site/ProductCarousel";
import { findProduct, products } from "@/lib/catalog";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/carrello")({
  head: () => ({
    meta: [
      { title: "Carrello — MyBrand Italia" },
      {
        name: "description",
        content: "Rivedi i tuoi articoli e completa l'ordine su MyBrand Italia.",
      },
      { property: "og:title", content: "Carrello — MyBrand Italia" },
      {
        property: "og:description",
        content: "Rivedi i tuoi articoli e completa l'ordine su MyBrand Italia.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, cartTotal, cartCount, cartDiscount, setQty, removeLine, hydrated, department } =
    useStore();

  /** Abbinamenti: prodotti non ancora nel carrello, prima quelli del reparto degli articoli scelti. */
  const inCart = new Set(cart.map((l) => l.slug));
  const dep = (cart[0] && findProduct(cart[0].slug)?.department) ?? department;
  const look = [
    ...products.filter((p) => p.department === dep && !inCart.has(p.slug)),
    ...products.filter((p) => p.department !== dep && !inCart.has(p.slug)),
  ].slice(0, 10);

  const keepShopping = (className: string) => (
    <Link to="/" className={`btn-outline ${className}`}>
      Continua lo shopping
    </Link>
  );

  return (
    <SiteLayout>
      <div className="container-mb pb-8 pt-5 lg:pb-14 lg:pt-8">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-semibold leading-8 tracking-tight">Carrello</h1>
          {cart.length > 0 && (
            <p className="text-sm leading-5 text-muted-foreground">
              {cartCount} {cartCount === 1 ? "articolo" : "articoli"}
            </p>
          )}
        </div>

        {hydrated && cart.length === 0 && (
          <EmptyState icon={ShoppingBag} text="Il tuo carrello è vuoto.">
            <Link to="/" className="btn-primary">
              Torna allo shopping
            </Link>
          </EmptyState>
        )}

        {cart.length > 0 && (
          <div className="mt-5 grid gap-5 lg:mt-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-12">
            <div className="flex flex-col items-start gap-5">
              <ul className="w-full divide-y divide-border border-y border-border">
                {cart.map((l, i) => (
                  <li key={`${l.slug}-${l.color}-${l.size}-${i}`}>
                    <CartLineRow
                      line={l}
                      onQty={(qty) => setQty(i, qty)}
                      onRemove={() => removeLine(i)}
                    />
                  </li>
                ))}
              </ul>
              {keepShopping("hidden lg:inline-flex")}
            </div>

            <aside className="lg:sticky lg:top-24">
              <OrderSummary
                count={cartCount}
                total={cartTotal}
                discount={cartDiscount}
                shipping="Gratuita"
              />
            </aside>

            {keepShopping("w-full lg:hidden")}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="bg-surface">
          <ProductCarousel eyebrow="Abbinamenti" title="Completa il look" products={look} />
        </div>
      )}
    </SiteLayout>
  );
}
