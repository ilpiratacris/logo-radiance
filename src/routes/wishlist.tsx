import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { EmptyState } from "@/components/site/EmptyState";
import { ProductGrid } from "@/components/site/ProductGrid";
import { RecentlyViewed } from "@/components/site/RecentlyViewed";
import { findProduct } from "@/lib/catalog";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "La tua wishlist — MyBrand Italia" },
      {
        name: "description",
        content: "I capi e gli accessori che hai salvato dai brand MyBrand Italia.",
      },
      { property: "og:title", content: "La tua wishlist — MyBrand Italia" },
      {
        property: "og:description",
        content: "I capi e gli accessori che hai salvato dai brand MyBrand Italia.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist, hydrated, department } = useStore();
  const items = wishlist.map(findProduct).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <SiteLayout>
      <div className="container-mb pb-8 pt-5 lg:pb-14 lg:pt-8">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-semibold leading-8 tracking-tight">Wishlist</h1>
          {items.length > 0 && (
            <p className="text-sm leading-5 text-muted-foreground">
              {items.length} {items.length === 1 ? "articolo" : "articoli"}
            </p>
          )}
        </div>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          Salvata su questo dispositivo. Accedi per ritrovarla ovunque.
        </p>

        {hydrated && items.length === 0 && (
          <EmptyState icon={Heart} text="Non hai ancora salvato nulla.">
            <Link to="/reparto/$slug" params={{ slug: department }} className="btn-primary">
              Inizia a esplorare
            </Link>
          </EmptyState>
        )}

        {items.length > 0 && (
          <div className="mt-6">
            <ProductGrid products={items} />
          </div>
        )}
      </div>
      <div className="bg-surface">
        <RecentlyViewed />
      </div>
    </SiteLayout>
  );
}
