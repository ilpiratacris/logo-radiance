import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatPrice, popularSearches, search } from "@/lib/catalog";
import { useStore } from "@/lib/store";

const RECENT_KEY = "mybrand:searches";

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    if (!searchOpen) return;
    try {
      setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]"));
    } catch {
      /* ignore */
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSearchOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  const results = useMemo(() => search(q), [q]);

  const remember = (term: string) => {
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 6);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const close = () => {
    if (q.trim()) remember(q.trim());
    setSearchOpen(false);
  };

  if (!searchOpen) return null;

  const empty = q.trim().length < 2;
  const nothing =
    !empty && !results.brands.length && !results.products.length && !results.categories.length;

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col bg-background"
      role="dialog"
      aria-modal="true"
      aria-label="Ricerca"
    >
      <div className="border-b border-border">
        <div className="container-mb flex h-16 items-center gap-2">
          <div className="search-box h-12 flex-1 text-base">
            <Search className="h-5 w-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cerca prodotti, brand…"
              aria-label="Cerca"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                aria-label="Cancella"
                className="flex h-11 w-8 items-center justify-center"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            )}
          </div>
          <button onClick={close} className="h-12 px-3 text-sm font-medium">
            Chiudi
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain pb-16">
        <div className="container-mb py-5">
          {empty && (
            <div className="space-y-8">
              {recent.length > 0 && (
                <div>
                  <Title>Ultime ricerche</Title>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {recent.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setQ(r)}
                        className="chip gap-1.5"
                      >
                        <Clock
                          className="h-3.5 w-3.5 text-muted-foreground"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />{" "}
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <Title>Ricerche popolari</Title>
                <div className="mt-3 flex flex-wrap gap-2">
                  {popularSearches.map((r) => (
                    <button key={r} type="button" onClick={() => setQ(r)} className="chip">
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {nothing && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Nessun risultato per “{q}”. Prova con un brand o una categoria.
            </p>
          )}

          {!empty && (
            <div className="space-y-8">
              {results.brands.length > 0 && (
                <div>
                  <Title>Brand</Title>
                  <ul className="mt-2 divide-y divide-border border-y border-border">
                    {results.brands.map((b) => (
                      <li key={b.slug}>
                        <Link
                          to="/brand/$slug"
                          params={{ slug: b.slug }}
                          onClick={close}
                          className="flex h-14 items-center justify-between text-sm font-medium"
                        >
                          {b.name}
                          <ArrowRight className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {results.categories.length > 0 && (
                <div>
                  <Title>Categorie</Title>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {results.categories.map((c) => (
                      <Link
                        key={`${c.dep}-${c.slug}`}
                        to="/categoria/$slug"
                        params={{ slug: c.dep }}
                        search={{ cat: c.slug }}
                        onClick={close}
                        className="chip capitalize"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {results.products.length > 0 && (
                <div>
                  <Title>Prodotti</Title>
                  <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                    {results.products.map((p) => (
                      <li key={p.slug}>
                        <Link
                          to="/prodotto/$slug"
                          params={{ slug: p.slug }}
                          onClick={close}
                          className="flex items-center gap-3"
                        >
                          <img
                            src={p.variants[0].image}
                            alt=""
                            width={80}
                            height={100}
                            loading="lazy"
                            className="h-20 w-16 shrink-0 object-cover"
                          />
                          <span className="min-w-0">
                            <span className="block text-[11px] font-semibold uppercase tracking-[0.08em]">
                              {p.brand}
                            </span>
                            <span className="block truncate text-sm text-muted-foreground">
                              {p.name}
                            </span>
                            <span className="block text-sm font-semibold">
                              {formatPrice(p.price)}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </div>
  );
}
