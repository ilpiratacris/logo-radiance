import { Link, useLocation } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/mybrand-logo.avif.asset.json";
import { departments, navTree } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { CountDot } from "@/components/site/CountDot";
import { MegaMenu, type MegaKey } from "@/components/site/MegaMenu";
import { MobileMenu } from "@/components/site/MobileMenu";

/** Pagine con testata essenziale: niente reparto attivo, niente riga delle sottocategorie. */
const PLAIN_PATHS = ["/carrello", "/wishlist", "/account"];

export function Header() {
  const { pathname } = useLocation();
  const plain = pathname === "/" || PLAIN_PATHS.includes(pathname.replace(/\/$/, ""));
  const { department, setDepartment, cartCount, wishlist, setSearchOpen, openCart, hydrated } =
    useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mega, setMega] = useState<MegaKey | null>(null);

  /** Seconda riga: stesse voci del menu completo del reparto attivo. */
  const groups = navTree[department];
  const quickCats = groups[0]?.items.slice(0, 4) ?? [];
  const secondRow: {
    key: MegaKey | "novita" | `cat:${string}`;
    label: string;
    accent?: boolean;
  }[] = [
    { key: "novita", label: "Novità" },
    ...groups.map((g) => ({ key: g.slug as MegaKey, label: g.label })),
    ...quickCats.map((c) => ({ key: `cat:${c.slug}` as const, label: c.label })),
    { key: "brand", label: "Brand" },
    { key: "cat:outfit", label: "Outfit", accent: true },
  ];

  const wishCount = hydrated ? wishlist.length : 0;
  const bagCount = hydrated ? cartCount : 0;
  const nav2 =
    "flex items-center whitespace-nowrap text-sm font-semibold uppercase tracking-[0.08em] underline-offset-[10px] hover:underline";

  return (
    <>
      <header className="sticky top-0 z-50 bg-background" onMouseLeave={() => setMega(null)}>
        {/* ---------- MOBILE ---------- */}
        <div className="border-b border-border lg:hidden">
          <div className="flex h-14 items-center justify-between px-2">
            <button
              type="button"
              aria-label="Apri menu"
              onClick={() => setMenuOpen(true)}
              className="icon-btn"
            >
              <Menu className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
            </button>
            <Link to="/" aria-label="MyBrand Italia, home" className="flex items-center px-1">
              <img
                src={logo.url}
                alt="MyBrand Italia"
                width={110}
                height={28}
                className="h-7 w-auto"
              />
            </Link>
            <div className="flex items-center">
              <button
                type="button"
                aria-label="Cerca"
                onClick={() => setSearchOpen(true)}
                className="icon-btn"
              >
                <Search className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              </button>
              <Link to="/wishlist" aria-label="Wishlist" className="icon-btn">
                <Heart className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                {wishCount > 0 && (
                  <CountDot className="absolute right-1.5 top-1.5">{wishCount}</CountDot>
                )}
              </Link>
              <button type="button" aria-label="Carrello" onClick={openCart} className="icon-btn">
                <ShoppingBag className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                {bagCount > 0 && (
                  <CountDot className="absolute right-1.5 top-1.5">{bagCount}</CountDot>
                )}
              </button>
            </div>
          </div>

          {/* Nella home la scelta del reparto è nei contenuti. */}
          {!plain && (
            <nav aria-label="Reparti" className="grid grid-cols-3 border-t border-border">
              {departments.map((d) => (
                <Link
                  key={d.slug}
                  to="/reparto/$slug"
                  params={{ slug: d.slug }}
                  onClick={() => setDepartment(d.slug)}
                  aria-current={department === d.slug ? "true" : undefined}
                  className={`flex h-11 items-center justify-center border-b-2 text-[13px] font-bold uppercase tracking-[0.12em] ${
                    department === d.slug
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground"
                  }`}
                >
                  {d.label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* ---------- DESKTOP ---------- */}
        <div className="hidden lg:block">
          <div className="border-b border-border">
            <div className="container-mb flex h-[68px] items-center gap-8">
              <Link to="/" aria-label="MyBrand Italia, home" className="flex items-center">
                <img
                  src={logo.url}
                  alt="MyBrand Italia"
                  width={150}
                  height={40}
                  className="h-9 w-auto"
                />
              </Link>

              <nav aria-label="Reparti" className="flex h-full items-stretch gap-1">
                {departments.map((d) => {
                  const active = !plain && department === d.slug;
                  return (
                    <Link
                      key={d.slug}
                      to="/reparto/$slug"
                      params={{ slug: d.slug }}
                      onClick={() => {
                        setDepartment(d.slug);
                        setMega(null);
                      }}
                      aria-current={active ? "true" : undefined}
                      className={`flex items-center border-b-2 px-4 text-[15px] font-bold uppercase tracking-[0.12em] transition-colors ${
                        active
                          ? "border-foreground text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {d.label}
                    </Link>
                  );
                })}
              </nav>

              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="search-box ml-auto h-10 w-64 text-sm"
              >
                <Search className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                Cerca prodotti, brand…
              </button>

              <div className="flex items-center">
                <Link to="/account" aria-label="Account" className="icon-btn">
                  <User className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                </Link>
                <Link to="/wishlist" aria-label="Wishlist" className="icon-btn">
                  <Heart className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                  {wishCount > 0 && (
                    <CountDot className="absolute right-1.5 top-1.5">{wishCount}</CountDot>
                  )}
                </Link>
                <button type="button" onClick={openCart} aria-label="Carrello" className="icon-btn">
                  <ShoppingBag className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                  {bagCount > 0 && (
                    <CountDot className="absolute right-1.5 top-1.5">{bagCount}</CountDot>
                  )}
                </button>
              </div>
            </div>
          </div>

          {!plain && (
            <div className="border-b border-border">
              <nav
                aria-label="Categorie del reparto"
                className="container-mb flex h-11 items-stretch gap-5 xl:gap-7"
              >
                {secondRow.map((item) => {
                  if (item.key === "novita" || String(item.key).startsWith("cat:")) {
                    const isNew = item.key === "novita";
                    const cat = String(item.key).slice(4);
                    return (
                      <Link
                        key={item.key}
                        to="/categoria/$slug"
                        params={{ slug: department }}
                        search={isNew ? { novita: "1" } : { cat }}
                        onClick={() => setMega(null)}
                        onMouseEnter={() => setMega(null)}
                        className={`${nav2} ${item.accent ? "text-sale" : ""}`}
                      >
                        {item.label}
                      </Link>
                    );
                  }
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onMouseEnter={() => setMega(item.key as MegaKey)}
                      onFocus={() => setMega(item.key as MegaKey)}
                      onClick={() => setMega(mega === item.key ? null : (item.key as MegaKey))}
                      aria-expanded={mega === item.key}
                      className={`${nav2} ${mega === item.key ? "underline" : ""}`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          )}

          {!plain && mega && (
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
