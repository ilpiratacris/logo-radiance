import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Heart, MapPin, Package, RotateCcw, Settings, Ticket } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Il mio account — MyBrand Italia" },
      {
        name: "description",
        content: "Ordini, indirizzi, dati personali e wishlist del tuo account MyBrand Italia.",
      },
      { property: "og:title", content: "Il mio account — MyBrand Italia" },
      {
        property: "og:description",
        content: "Ordini, indirizzi, dati personali e wishlist del tuo account MyBrand Italia.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

const items = [
  { icon: Package, label: "I miei ordini", sub: "Stato e tracking" },
  { icon: RotateCcw, label: "Resi", sub: "Richiedi un reso" },
  { icon: MapPin, label: "Indirizzi", sub: "Spedizione e fatturazione" },
  { icon: Settings, label: "Dati personali", sub: "Email e password" },
  { icon: Ticket, label: "Coupon", sub: "I tuoi codici sconto" },
];

const row = "flex h-16 w-full items-center gap-3 text-left transition-colors hover:bg-surface";

function AccountPage() {
  return (
    <SiteLayout>
      <div className="container-mb pb-8 pt-5 lg:pb-14 lg:pt-8">
        <h1 className="text-2xl font-semibold leading-8 tracking-tight">Il mio account</h1>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          Ordini, resi, indirizzi e wishlist in un unico posto.
        </p>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-12">
          <ul className="divide-y divide-border border-y border-border">
            <li>
              <Link to="/wishlist" className={row}>
                <Heart className="h-5 w-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                <span className="flex-1">
                  <span className="block text-sm font-medium">Wishlist</span>
                  <span className="block text-xs text-muted-foreground">
                    I capi che hai salvato
                  </span>
                </span>
                <ChevronRight
                  className="h-4 w-4 text-muted-foreground"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </Link>
            </li>
            {items.map(({ icon: Icon, label, sub }) => (
              <li key={label}>
                <button type="button" className={row}>
                  <Icon className="h-5 w-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  <span className="flex-1">
                    <span className="block text-sm font-medium">{label}</span>
                    <span className="block text-xs text-muted-foreground">{sub}</span>
                  </span>
                  <ChevronRight
                    className="h-4 w-4 text-muted-foreground"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </button>
              </li>
            ))}
          </ul>

          <div className="grid gap-5">
            <div className="border border-border p-4">
              <h2 className="label-caps text-sm">Accedi o registrati</h2>
              <p className="mt-2 text-sm leading-5 text-muted-foreground">
                Ritrova wishlist e ordini su tutti i tuoi dispositivi.
              </p>
              <div className="mt-4 grid gap-2">
                <button type="button" className="btn-primary w-full">
                  Accedi
                </button>
                <button type="button" className="btn-outline w-full">
                  Crea account
                </button>
              </div>
            </div>

            <div className="border border-border p-4">
              <h2 className="label-caps text-sm">Newsletter</h2>
              <p className="mt-2 text-sm leading-5 text-muted-foreground">
                Novità, promo e anteprime saldi. Un'email a settimana.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-4 flex border border-border-strong transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring hover:border-foreground"
              >
                <input
                  type="email"
                  placeholder="La tua email"
                  aria-label="Email"
                  className="h-11 min-w-0 flex-1 bg-background px-3 text-sm outline-none"
                />
                <button
                  type="submit"
                  className="h-11 bg-primary px-4 text-sm text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  Iscriviti
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
