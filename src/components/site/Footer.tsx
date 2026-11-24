import { Link } from "@tanstack/react-router";
import { CreditCard, Facebook, Instagram, RotateCcw, Truck } from "lucide-react";
import type { ReactNode } from "react";
import { useStore } from "@/lib/store";

const trust = [
  { icon: Truck, title: "Spedizione gratuita", sub: "Consegna con BRT FermoPoint" },
  { icon: RotateCcw, title: "Reso gratuito", sub: "Cambio o buono acquisto" },
  { icon: CreditCard, title: "Paga in 3 rate", sub: "Klarna e Scalapay" },
];

const heading = "text-xs font-semibold uppercase tracking-[0.14em]";
const link = "text-xs text-muted-foreground transition-colors hover:text-foreground";

export function Footer() {
  const { department } = useStore();

  return (
    <footer className="border-t border-border bg-surface pb-[58px] lg:pb-0">
      <div className="border-b border-border">
        <div className="container-mb grid gap-6 py-10 md:grid-cols-3">
          {trust.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3">
              <Icon className="h-6 w-6 shrink-0" strokeWidth={1.25} aria-hidden="true" />
              <div>
                <div className="text-sm font-medium">{title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-mb grid grid-cols-2 gap-10 py-14 md:grid-cols-3 lg:grid-cols-5">
        <div className="col-span-2 md:col-span-1">
          <div className="text-sm font-semibold tracking-wide">MyBrand Italia</div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Una selezione curata delle migliori marche di tendenza per tutta la famiglia.
          </p>
          <div className="mt-4 flex gap-3">
            {[
              { icon: Instagram, label: "Instagram" },
              { icon: Facebook, label: "Facebook" },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="border border-border p-2 transition-colors hover:border-foreground hover:bg-background"
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <FooterCol title="Categorie">
          {(["donna", "uomo", "bambino"] as const).map((slug) => (
            <li key={slug}>
              <Link to="/reparto/$slug" params={{ slug }} className={`${link} capitalize`}>
                {slug}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/categoria/$slug"
              params={{ slug: department }}
              search={{ cat: "calzature" }}
              className={link}
            >
              Scarpe
            </Link>
          </li>
          <li>
            <Link
              to="/categoria/$slug"
              params={{ slug: department }}
              search={{ cat: "accessori" }}
              className={link}
            >
              Accessori
            </Link>
          </li>
        </FooterCol>

        <FooterCol title="Brand">
          {[
            { slug: "ea7", name: "EA7" },
            { slug: "tommy-hilfiger", name: "Tommy Hilfiger" },
            { slug: "calvin-klein", name: "Calvin Klein" },
            { slug: "guess", name: "Guess" },
          ].map((b) => (
            <li key={b.slug}>
              <Link to="/brand/$slug" params={{ slug: b.slug }} className={link}>
                {b.name}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/brand" className={link}>
              Tutti i brand
            </Link>
          </li>
        </FooterCol>

        <FooterCol title="Servizio clienti">
          {["Spedizioni", "Resi e cambi", "Metodi di pagamento", "Contattaci", "FAQ"].map((l) => (
            <li key={l}>
              <a href="#" className={link}>
                {l}
              </a>
            </li>
          ))}
        </FooterCol>

        <div>
          <div className={heading}>Chi siamo</div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Vieni a trovarci nel nostro store fisico:
            <br />
            <span className="text-foreground">C.C. I Portali</span>
            <br />
            San Giovanni La Punta (CT)
          </p>
          <div className={`${heading} mt-6`}>Newsletter</div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-3 flex overflow-hidden border border-border-strong transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring hover:border-foreground"
          >
            <input
              type="email"
              placeholder="La tua email"
              aria-label="Email"
              className="min-w-0 flex-1 bg-background px-3 py-2 text-xs outline-none"
            />
            <button
              type="submit"
              className="bg-primary px-3 text-xs text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Iscriviti
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-mb flex flex-col gap-2 py-6 text-xs text-muted-foreground md:flex-row md:justify-between">
          <div>© {new Date().getFullYear()} MyBrand Italia — Tutti i diritti riservati</div>
          <div className="flex gap-4">
            <a href="#" className="transition-colors hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Cookie
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Termini
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className={heading}>{title}</div>
      <ul className="mt-4 grid gap-2.5">{children}</ul>
    </div>
  );
}
