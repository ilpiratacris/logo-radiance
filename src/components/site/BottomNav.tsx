import { Link } from "@tanstack/react-router";
import { Heart, Home, Search, ShoppingBag, User } from "lucide-react";
import { useStore } from "@/lib/store";

/** Barra mobile: solo azioni primarie, nascosta quando serve spazio (PDP sticky CTA). */
export function BottomNav({ hidden }: { hidden?: boolean }) {
  const { cartCount, wishlist, setSearchOpen, openCart, hydrated } = useStore();
  if (hidden) return null;

  const cls = "flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium";

  return (
    <nav
      aria-label="Navigazione rapida"
      className="fixed inset-x-0 bottom-0 z-40 flex h-[58px] border-t border-border bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <Link to="/" className={cls} activeProps={{ className: `${cls} text-foreground` }}>
        <Home className="h-5 w-5" strokeWidth={1.5} />
        Home
      </Link>
      <button onClick={() => setSearchOpen(true)} className={cls}>
        <Search className="h-5 w-5" strokeWidth={1.5} />
        Cerca
      </button>
      <Link to="/wishlist" className={`${cls} relative`}>
        <Heart className="h-5 w-5" strokeWidth={1.5} />
        Wishlist
        {hydrated && wishlist.length > 0 && <Badge>{wishlist.length}</Badge>}
      </Link>
      <Link to="/account" className={cls}>
        <User className="h-5 w-5" strokeWidth={1.5} />
        Account
      </Link>
      <button onClick={openCart} className={`${cls} relative`}>
        <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
        Carrello
        {hydrated && cartCount > 0 && <Badge>{cartCount}</Badge>}
      </button>
    </nav>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute right-4 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] leading-none text-background">
      {children}
    </span>
  );
}
