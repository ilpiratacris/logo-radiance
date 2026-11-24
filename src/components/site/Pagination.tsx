/** Pagine dei risultati: numeri come chip, più Precedente/Successiva. */
export function Pagination({
  page,
  pages,
  onPage,
  className = "",
}: {
  page: number;
  pages: number;
  onPage: (page: number) => void;
  className?: string;
}) {
  if (pages <= 1) return null;

  return (
    <nav
      aria-label="Pagine dei risultati"
      className={`flex flex-wrap items-center justify-center gap-2 ${className}`}
    >
      {page > 1 && (
        <button type="button" onClick={() => onPage(page - 1)} className="chip">
          Precedente
        </button>
      )}
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onPage(n)}
          aria-current={n === page ? "page" : undefined}
          aria-label={`Pagina ${n}`}
          className="chip"
        >
          {n}
        </button>
      ))}
      {page < pages && (
        <button type="button" onClick={() => onPage(page + 1)} className="chip">
          Successiva
        </button>
      )}
    </nav>
  );
}
