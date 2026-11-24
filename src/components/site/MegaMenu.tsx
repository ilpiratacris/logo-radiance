import { Link } from "@tanstack/react-router";
import { brands, navTree, type DepartmentSlug, IMG } from "@/lib/catalog";

export type MegaKey = "abbigliamento" | "calzature" | "accessori" | "brand" | "promo";

export function MegaMenu({
  active,
  department,
  onNavigate,
}: {
  active: MegaKey;
  department: DepartmentSlug;
  onNavigate: () => void;
}) {
  if (active === "brand") {
    return (
      <Panel>
        <div className="grid flex-1 grid-cols-4 gap-x-8 gap-y-2">
          {brands.slice(0, 16).map((b) => (
            <Link
              key={b.slug}
              to="/brand/$slug"
              params={{ slug: b.slug }}
              onClick={onNavigate}
              className="py-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              {b.name}
            </Link>
          ))}
          <Link
            to="/brand"
            onClick={onNavigate}
            className="py-1.5 text-sm font-semibold underline underline-offset-4"
          >
            Vedi tutti i brand
          </Link>
        </div>
        <Visual
          image={IMG.editorial}
          label="Brand del mese"
          title="Peuterey"
          to={{ to: "/brand/$slug", params: { slug: "peuterey" } }}
          onNavigate={onNavigate}
        />
      </Panel>
    );
  }

  if (active === "promo") {
    return (
      <Panel>
        <div className="flex-1 space-y-2">
          <Link
            to="/promo/$slug"
            params={{ slug: "promo-autunno" }}
            onClick={onNavigate}
            className="block py-1.5 text-sm font-semibold text-sale"
          >
            Promo d’autunno — fino al −40%
          </Link>
          <Link
            to="/categoria/$slug"
            params={{ slug: department }}
            search={{ sconto: "1" }}
            onClick={onNavigate}
            className="block py-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            Tutti i prodotti in promozione
          </Link>
          <Link
            to="/categoria/$slug"
            params={{ slug: department }}
            search={{ sconto: "1", sort: "sconto" }}
            onClick={onNavigate}
            className="block py-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            Sconti maggiori
          </Link>
        </div>
        <Visual
          image={IMG.promoAutunno}
          label="Promo d'autunno"
          title="Capispalla selezionati"
          to={{ to: "/promo/$slug", params: { slug: "promo-autunno" } }}
          onNavigate={onNavigate}
        />
      </Panel>
    );
  }

  const group = navTree[department].find((g) => g.slug === active);
  if (!group) return null;

  return (
    <Panel>
      <div className="grid flex-1 grid-cols-4 gap-x-8 gap-y-1">
        <Link
          to="/categoria/$slug"
          params={{ slug: department }}
          search={{ cat: group.slug }}
          onClick={onNavigate}
          className="col-span-4 pb-2 text-sm font-semibold underline underline-offset-4"
        >
          Tutto {group.label.toLowerCase()} {department}
        </Link>
        {group.items.map((i) => (
          <Link
            key={i.slug}
            to="/categoria/$slug"
            params={{ slug: department }}
            search={{ cat: i.slug }}
            onClick={onNavigate}
            className="py-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            {i.label}
          </Link>
        ))}
      </div>
      <Visual
        image={
          department === "donna"
            ? IMG.catDonna
            : department === "uomo"
              ? IMG.catUomo
              : IMG.catBambino
        }
        label="Nuova stagione"
        title="Autunno / Inverno 2026"
        to={{ to: "/categoria/$slug", params: { slug: department }, search: { novita: "1" } }}
        onNavigate={onNavigate}
      />
    </Panel>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-t border-border bg-background shadow-[0_12px_24px_-16px_rgba(0,0,0,0.25)]">
      <div className="container-mb flex gap-10 py-7">{children}</div>
    </div>
  );
}

function Visual({
  image,
  label,
  title,
  to,
  onNavigate,
}: {
  image: string;
  label: string;
  title: string;
  to: { to: string; params?: Record<string, string>; search?: Record<string, string> };
  onNavigate: () => void;
}) {
  return (
    <Link
      to={to.to}
      params={to.params as never}
      search={to.search as never}
      onClick={onNavigate}
      className="group relative hidden w-64 shrink-0 overflow-hidden xl:block"
    >
      <img
        src={image}
        alt=""
        width={512}
        height={320}
        loading="lazy"
        className="h-40 w-full object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent p-3">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-background/80">
          {label}
        </div>
        <div className="text-sm font-semibold text-background">{title}</div>
      </div>
    </Link>
  );
}
