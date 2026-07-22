import { Link } from "@tanstack/react-router";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/mybrand-logo.avif.asset.json";
import { mainNav } from "@/lib/mock-data";

export function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="container-mb flex h-16 items-center justify-between gap-6 lg:h-20">
        <div className="flex items-center gap-3 lg:gap-8">
          <button
            aria-label="Apri menu"
            className="lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6" strokeWidth={1.5} />
          </button>
          <Link to="/" className="flex items-center">
            <img
              src={logo.url}
              alt="MyBrand"
              width={120}
              height={40}
              className="h-8 w-auto lg:h-10"
            />
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          {mainNav.slice(0, 8).map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="text-sm font-medium text-foreground/85 hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          {searchOpen ? (
            <div className="flex items-center gap-2 rounded-sm border border-border-strong bg-background px-3">
              <Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              <input
                autoFocus
                placeholder="Cerca prodotti, brand..."
                className="h-9 w-40 bg-transparent text-sm outline-none sm:w-64"
                onBlur={() => setSearchOpen(false)}
              />
            </div>
          ) : (
            <button
              aria-label="Cerca"
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:bg-surface rounded-sm"
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </button>
          )}
          <button aria-label="Account" className="p-2 hover:bg-surface rounded-sm hidden sm:block">
            <User className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <button aria-label="Preferiti" className="p-2 hover:bg-surface rounded-sm hidden sm:block">
            <Heart className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <button aria-label="Carrello" className="relative p-2 hover:bg-surface rounded-sm">
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-accent-foreground">
              2
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 bg-foreground/40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="h-full w-[85%] max-w-sm bg-background p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <img src={logo.url} alt="MyBrand" className="h-8" />
              <button aria-label="Chiudi" onClick={() => setOpen(false)}>
                <X className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </div>
            <nav className="flex flex-col divide-y divide-border">
              {mainNav.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="py-4 text-base font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
