import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DepartmentSlug } from "@/lib/catalog";

export type CartLine = {
  slug: string;
  name: string;
  brand: string;
  image: string;
  color: string;
  size: string;
  price: number;
  oldPrice?: number;
  qty: number;
};

type Store = {
  hydrated: boolean;
  department: DepartmentSlug;
  setDepartment: (d: DepartmentSlug) => void;

  wishlist: string[];
  toggleWishlist: (slug: string) => void;
  inWishlist: (slug: string) => boolean;

  recent: string[];
  pushRecent: (slug: string) => void;

  cart: CartLine[];
  addToCart: (line: CartLine) => void;
  setQty: (i: number, qty: number) => void;
  removeLine: (i: number) => void;
  cartCount: number;
  cartTotal: number;
  /** Risparmio complessivo delle righe in offerta (prezzo pieno − prezzo ridotto). */
  cartDiscount: number;

  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  lastAdded: CartLine | null;

  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
};

const Ctx = createContext<Store | null>(null);

const KEY = "mybrand:v1";

type Persisted = {
  department: DepartmentSlug;
  wishlist: string[];
  recent: string[];
  cart: CartLine[];
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [department, setDepartmentState] = useState<DepartmentSlug>("uomo");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartLine | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw) as Partial<Persisted>;
        if (p.department) setDepartmentState(p.department);
        if (p.wishlist) setWishlist(p.wishlist);
        if (p.recent) setRecent(p.recent);
        if (p.cart) setCart(p.cart);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ department, wishlist, recent, cart }));
    } catch {
      /* ignore */
    }
  }, [hydrated, department, wishlist, recent, cart]);

  // blocca lo scroll del body quando un overlay è aperto
  useEffect(() => {
    const lock = cartOpen || searchOpen;
    document.body.style.overflow = lock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, searchOpen]);

  const toggleWishlist = useCallback((slug: string) => {
    setWishlist((w) => (w.includes(slug) ? w.filter((s) => s !== slug) : [slug, ...w]));
  }, []);

  const pushRecent = useCallback((slug: string) => {
    setRecent((r) => [slug, ...r.filter((s) => s !== slug)].slice(0, 12));
  }, []);

  const addToCart = useCallback((line: CartLine) => {
    setCart((c) => {
      const i = c.findIndex(
        (l) => l.slug === line.slug && l.color === line.color && l.size === line.size,
      );
      if (i >= 0) {
        const next = [...c];
        next[i] = { ...next[i], qty: next[i].qty + line.qty };
        return next;
      }
      return [...c, line];
    });
    setLastAdded(line);
    setCartOpen(true);
  }, []);

  const value = useMemo<Store>(
    () => ({
      hydrated,
      department,
      setDepartment: setDepartmentState,
      wishlist,
      toggleWishlist,
      inWishlist: (s) => wishlist.includes(s),
      recent,
      pushRecent,
      cart,
      addToCart,
      setQty: (i, qty) =>
        setCart((c) =>
          qty <= 0
            ? c.filter((_, idx) => idx !== i)
            : c.map((l, idx) => (idx === i ? { ...l, qty } : l)),
        ),
      removeLine: (i) => setCart((c) => c.filter((_, idx) => idx !== i)),
      cartCount: cart.reduce((n, l) => n + l.qty, 0),
      cartTotal: cart.reduce((n, l) => n + l.qty * l.price, 0),
      cartDiscount: cart.reduce(
        (n, l) => n + (l.oldPrice && l.oldPrice > l.price ? (l.oldPrice - l.price) * l.qty : 0),
        0,
      ),
      cartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      lastAdded,
      searchOpen,
      setSearchOpen,
    }),
    [
      hydrated,
      department,
      wishlist,
      recent,
      cart,
      cartOpen,
      searchOpen,
      lastAdded,
      addToCart,
      pushRecent,
      toggleWishlist,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore deve essere usato dentro StoreProvider");
  return ctx;
}
