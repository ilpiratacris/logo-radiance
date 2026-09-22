import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductGrid } from "@/components/site/ProductGrid";
import { RecentlyViewed } from "@/components/site/RecentlyViewed";
import { findProduct } from "@/lib/catalog";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "La tua wishlist — MyBrand Italia" },
      { name: "description", content: "I capi e gli accessori che hai salvato dai brand MyBrand Italia." },
      { property: "og:title", content: "La tua wishlist — MyBrand Italia" },
      { property: "og:description", content: "I capi e gli accessori che hai salvato dai brand MyBrand Italia." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist, hydrated } = useStore();
  const items = wishlist.map(findProduct).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <SiteLayout>
      <div className="container-mb py-8">
        <h1 className="text-2xl font-semibold tracking-tight">Wishlist</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Salvata su questo dispositivo. Accedi per ritrovarla ovunque.
        </p>

        {hydrated && items.length === 0 && (
          <div className="py-16 text-center">
            <Heart className="mx-auto h-8 w-8 text-muted-foreground" strokeWidth={1.25} />
            <p className="mt-3 text-sm text-muted-foreground">Non hai ancora salvato nulla.</p>
            <Link to="/categoria/$slug" params={{ slug: "donna" }} className="btn-primary mt-5 inline-flex">
              Inizia a esplorare
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-6">
            <ProductGrid products={items} />
          </div>
        )}
      </div>
      <RecentlyViewed />
    </SiteLayout>
  );
}
