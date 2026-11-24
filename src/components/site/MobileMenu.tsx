import { Link } from "@tanstack/react-router";
import { ChevronDown, Percent, Sparkles, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { BottomSheet } from "@/components/site/BottomSheet";
import { brands, departments, navTree, type DepartmentSlug } from "@/lib/catalog";
import { useStore } from "@/lib/store";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { department, setDepartment } = useStore();
  const [dep, setDep] = useState<DepartmentSlug>(department);
  const [expanded, setExpanded] = useState<string | null>("abbigliamento");

  // a ogni apertura il menu riparte dal reparto della pagina corrente
  useEffect(() => {
    if (open) setDep(department);
  }, [open, department]);

  const pick = (d: DepartmentSlug) => {
    setDep(d);
    setDepartment(d);
    setExpanded("abbigliamento");
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Menu" side="right">
      <div>
        {/* Tab reparti */}
        <div className="grid grid-cols-3 border-b border-border">
          {departments.map((d) => (
            <button
              key={d.slug}
              onClick={() => pick(d.slug)}
              aria-pressed={dep === d.slug}
              className={`h-14 text-sm font-semibold uppercase tracking-[0.1em] ${
                dep === d.slug
                  ? "border-b-2 border-foreground text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <nav className="pb-8">
          <Link
            to="/categoria/$slug"
            params={{ slug: dep }}
            search={{ novita: "1" }}
            onClick={onClose}
            className="flex h-14 items-center gap-2 border-b border-border px-4 text-sm font-medium"
          >
            <Sparkles className="h-4 w-4" strokeWidth={1.5} /> Novità
          </Link>

          {navTree[dep].map((g) => (
            <div key={g.slug} className="border-b border-border">
              <button
                onClick={() => setExpanded(expanded === g.slug ? null : g.slug)}
                aria-expanded={expanded === g.slug}
                className="flex h-14 w-full items-center justify-between px-4 text-sm font-medium"
              >
                {g.label}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${expanded === g.slug ? "rotate-180" : ""}`}
                  strokeWidth={1.5}
                />
              </button>
              {expanded === g.slug && (
                <ul className="bg-surface pb-2">
                  <li>
                    <Link
                      to="/categoria/$slug"
                      params={{ slug: dep }}
                      search={{ cat: g.slug }}
                      onClick={onClose}
                      className="flex h-12 items-center px-4 text-sm font-medium"
                    >
                      Tutto {g.label.toLowerCase()}
                    </Link>
                  </li>
                  {g.items.map((i) => (
                    <li key={i.slug}>
                      <Link
                        to="/categoria/$slug"
                        params={{ slug: dep }}
                        search={{ cat: i.slug }}
                        onClick={onClose}
                        className="flex h-12 items-center px-4 text-sm text-muted-foreground"
                      >
                        {i.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="border-b border-border">
            <button
              onClick={() => setExpanded(expanded === "brand" ? null : "brand")}
              aria-expanded={expanded === "brand"}
              className="flex h-14 w-full items-center justify-between px-4 text-sm font-medium"
            >
              <span className="flex items-center gap-2">
                <Tag className="h-4 w-4" strokeWidth={1.5} /> Brand
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${expanded === "brand" ? "rotate-180" : ""}`}
                strokeWidth={1.5}
              />
            </button>
            {expanded === "brand" && (
              <ul className="bg-surface pb-2">
                {brands
                  .filter((b) => b.featured)
                  .map((b) => (
                    <li key={b.slug}>
                      <Link
                        to="/brand/$slug"
                        params={{ slug: b.slug }}
                        onClick={onClose}
                        className="flex h-12 items-center px-4 text-sm text-muted-foreground"
                      >
                        {b.name}
                      </Link>
                    </li>
                  ))}
                <li>
                  <Link
                    to="/brand"
                    onClick={onClose}
                    className="flex h-12 items-center px-4 text-sm font-medium underline"
                  >
                    Vedi tutti i brand
                  </Link>
                </li>
              </ul>
            )}
          </div>

          <Link
            to="/promo/$slug"
            params={{ slug: "promo-autunno" }}
            onClick={onClose}
            className="flex h-14 items-center gap-2 border-b border-border px-4 text-sm font-semibold text-sale"
          >
            <Percent className="h-4 w-4" strokeWidth={1.75} /> Promo
          </Link>

          <div className="mt-6 space-y-1 px-4">
            <Link
              to="/account"
              onClick={onClose}
              className="flex h-12 items-center text-sm text-muted-foreground"
            >
              Il mio account
            </Link>
            <Link
              to="/wishlist"
              onClick={onClose}
              className="flex h-12 items-center text-sm text-muted-foreground"
            >
              Wishlist
            </Link>
          </div>
        </nav>
      </div>
    </BottomSheet>
  );
}
