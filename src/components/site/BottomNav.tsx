import { Link } from "@tanstack/react-router";
import { Heart, Home, Search, ShoppingBag, User } from "lucide-react";
import { CountDot } from "@/components/site/CountDot";
import { useStore } from "@/lib/store";

/** Barra mobile: solo azioni primarie, nascosta quando serve spazio (barra Aggiungi della scheda prodotto). */
export function BottomNav({ hidden }: { hidden?: boolean }) {
  const { cartCount, wishlist, setSearchOpen, openCart, hydrated } = useStore();
  if (hidden) return null;

  const cls =
    "relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium";
  // ancorato all'icona (centro della cella), non al bordo: resta vicino anche su tablet
  const dot = "absolute left-1/2 top-1 ml-1.5 font-normal";

  return (
    <nav
      aria-label="Navigazione rapida"
      className="fixed inset-x-0 bottom-0 z-40 flex h-[58px] border-t border-border bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <Link to="/" className={cls}>
        <Home className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
        Home
      </Link>
      <button type="button" onClick={() => setSearchOpen(true)} className={cls}>
        <Search className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
        Cerca
      </button>
      <Link to="/wishlist" className={cls}>
        <Heart className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
        Wishlist
        {hydrated && wishlist.length > 0 && <CountDot className={dot}>{wishlist.length}</CountDot>}
      </Link>
      <Link to="/account" className={cls}>
        <User className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
        Account
      </Link>
      <button type="button" onClick={openCart} className={cls}>
        <ShoppingBag className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
        Carrello
        {hydrated && cartCount > 0 && <CountDot className={dot}>{cartCount}</CountDot>}
      </button>
    </nav>
  );
}
