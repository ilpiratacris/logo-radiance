import { Link } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/mybrand-logo.avif.asset.json";
import { departments, navTree } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { MegaMenu, type MegaKey } from "@/components/site/MegaMenu";
import { MobileMenu } from "@/components/site/MobileMenu";

export function Header() {
  const { department, setDepartment, cartCount, wishlist, setSearchOpen, openCart, hydrated } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mega, setMega] = useState<MegaKey | null>(null);

  const secondRow: { key: MegaKey | "novita"; label: string }[] = [
    { key: "novita", label: "Novità" },
    ...navTree[department].map((g) => ({ key: g.slug as MegaKey, label: g.label })),
    { key: "brand", label: "Brand" },
    { key: "promo", label: "Promo" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-background" onMouseLeave={() => setMega(null)}>
        {/* ---------- MOBILE ---------- */}
        <div className="border-b border-border lg:hidden">
          <div className="flex h-14 items-center justify-between px-2">
            <button
              aria-label="Apri menu"
              onClick={() => setMenuOpen(true)}
              className="flex h-11 w-11 items-center justify-center"
            >
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            </button>
            <Link to="/" aria-label="MyBrand Italia, home" className="flex items-center px-1">
              <img src={logo.url} alt="MyBrand Italia" width={110} height={28} className="h-7 w-auto" />
            </Link>
            <div className="flex items-center">
              <button
                aria-label="Cerca"
                onClick={() => setSearchOpen(true)}
                className="flex h-11 w-11 items-center justify-center"
              >
                <Search className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <Link to="/wishlist" aria-label="Wishlist" className="relative flex h-11 w-11 items-center justify-center">
                <Heart className="h-5 w-5" strokeWidth={1.5} />
                {hydrated && wishlist.length > 0 && <Dot>{wishlist.length}</Dot>}
              </Link>
              <button
                aria-label="Carrello"
                onClick={openCart}
                className="relative flex h-11 w-11 items-center justify-center"
              >
                <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                {hydrated && cartCount > 0 && <Dot>{cartCount}</Dot>}
              </button>
            </div>
          </div>

          {/* tab reparti sempre visibili su mobile */}
          <div className="grid grid-cols-3 border-t border-border">
            {departments.map((d) => (
              <Link
                key={d.slug}
                to="/categoria/$slug"
                params={{ slug: d.slug }}
                onClick={() => setDepartment(d.slug)}
                className={`flex h-11 items-center justify-center text-xs font-semibold uppercase tracking-[0.12em] ${
                  department === d.slug
                    ? "border-b-2 border-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {d.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ---------- DESKTOP ---------- */}
        <div className="hidden lg:block">
          <div className="border-b border-border">
            <div className="container-mb flex h-[68px] items-center gap-8">
              <Link to="/" aria-label="MyBrand Italia, home">
                <img src={logo.url} alt="MyBrand Italia" width={150} height={40} className="h-9 w-auto" />
              </Link>

              <nav aria-label="Reparti" className="flex h-full items-stretch gap-1">
                {departments.map((d) => (
                  <Link
                    key={d.slug}
                    to="/categoria/$slug"
                    params={{ slug: d.slug }}
                    onClick={() => setDepartment(d.slug)}
                    onMouseEnter={() => setDepartment(d.slug)}
                    className={`flex items-center px-4 text-sm font-semibold uppercase tracking-[0.12em] ${
                      department === d.slug
                        ? "border-b-2 border-foreground text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {d.label}
                  </Link>
                ))}
              </nav>

              <button
                onClick={() => setSearchOpen(true)}
                className="ml-auto flex h-10 w-64 items-center gap-2 border border-border-strong px-3 text-sm text-muted-foreground hover:border-foreground xl:w-80"
              >
                <Search className="h-4 w-4" strokeWidth={1.5} />
                Cerca prodotti, brand…
              </button>

              <div className="flex items-center">
                <Link to="/account" aria-label="Account" className="flex h-11 w-11 items-center justify-center">
                  <User className="h-5 w-5" strokeWidth={1.5} />
                </Link>
                <Link to="/wishlist" aria-label="Wishlist" className="relative flex h-11 w-11 items-center justify-center">
                  <Heart className="h-5 w-5" strokeWidth={1.5} />
                  {hydrated && wishlist.length > 0 && <Dot>{wishlist.length}</Dot>}
                </Link>
                <button onClick={openCart} aria-label="Carrello" className="relative flex h-11 w-11 items-center justify-center">
                  <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                  {hydrated && cartCount > 0 && <Dot>{cartCount}</Dot>}
                </button>
              </div>
            </div>
          </div>

          <div className="border-b border-border">
            <div className="container-mb flex h-11 items-stretch gap-7">
              {secondRow.map((item) =>
                item.key === "novita" ? (
                  <Link
                    key="novita"
                    to="/categoria/$slug"
                    params={{ slug: department }}
                    search={{ novita: "1" }}
                    onMouseEnter={() => setMega(null)}
                    className="flex items-center text-[13px] font-medium uppercase tracking-[0.08em] hover:underline"
                  >
                    Novità
                  </Link>
                ) : (
                  <button
                    key={item.key}
                    onMouseEnter={() => setMega(item.key as MegaKey)}
                    onFocus={() => setMega(item.key as MegaKey)}
                    onClick={() => setMega(mega === item.key ? null : (item.key as MegaKey))}
                    aria-expanded={mega === item.key}
                    className={`flex items-center text-[13px] font-medium uppercase tracking-[0.08em] ${
                      item.key === "promo" ? "text-[color:var(--color-sale)]" : ""
                    } ${mega === item.key ? "underline underline-offset-[10px]" : ""}`}
                  >
                    {item.label}
                  </button>
                ),
              )}
            </div>
          </div>

          {mega && (
            <div className="absolute inset-x-0 top-full">
              <MegaMenu active={mega} department={department} onNavigate={() => setMega(null)} />
            </div>
          )}
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function Dot({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold leading-none text-background">
      {children}
    </span>
  );
}
