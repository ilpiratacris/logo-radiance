import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Heart, MapPin, Package, Receipt, Settings, Ticket } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Il mio account — MyBrand Italia" },
      { name: "description", content: "Ordini, indirizzi, dati personali e wishlist del tuo account MyBrand Italia." },
      { property: "og:title", content: "Il mio account — MyBrand Italia" },
      { property: "og:description", content: "Ordini, indirizzi, dati personali e wishlist del tuo account MyBrand Italia." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

const items = [
  { icon: Package, label: "I miei ordini", sub: "Stato e tracking" },
  { icon: Receipt, label: "Resi", sub: "Richiedi un reso" },
  { icon: MapPin, label: "Indirizzi", sub: "Spedizione e fatturazione" },
  { icon: Settings, label: "Dati personali", sub: "Email e password" },
  { icon: Ticket, label: "Coupon", sub: "I tuoi codici sconto" },
];

function AccountPage() {
  return (
    <SiteLayout>
      <div className="container-mb py-8">
        <h1 className="text-2xl font-semibold tracking-tight">Il mio account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          PLACEHOLDER: area cliente da collegare all'autenticazione del backend.
        </p>

        <div className="mt-6 border border-border p-4">
          <div className="text-sm font-medium">Accedi o registrati</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Ritrova wishlist e ordini su tutti i tuoi dispositivi.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="btn-primary">Accedi</button>
            <button className="btn-outline">Crea account</button>
          </div>
        </div>

        <ul className="mt-6 divide-y divide-border border-y border-border">
          <li>
            <Link to="/wishlist" className="flex h-16 items-center gap-3">
              <Heart className="h-5 w-5" strokeWidth={1.5} />
              <span className="flex-1">
                <span className="block text-sm font-medium">Wishlist</span>
                <span className="block text-xs text-muted-foreground">I capi che hai salvato</span>
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            </Link>
          </li>
          {items.map(({ icon: Icon, label, sub }) => (
            <li key={label}>
              <button className="flex h-16 w-full items-center gap-3 text-left">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
                <span className="flex-1">
                  <span className="block text-sm font-medium">{label}</span>
                  <span className="block text-xs text-muted-foreground">{sub}</span>
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-8 border border-border p-4">
          <div className="text-sm font-medium">Newsletter</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Novità, promo e anteprime saldi. Un'email a settimana.
          </p>
          <form className="mt-3 flex border border-border-strong">
            <input
              type="email"
              placeholder="La tua email"
              aria-label="Email"
              className="h-11 flex-1 bg-background px-3 text-sm outline-none"
            />
            <button className="h-11 bg-foreground px-4 text-sm text-background">Iscriviti</button>
          </form>
        </div>
      </div>
    </SiteLayout>
  );
}
