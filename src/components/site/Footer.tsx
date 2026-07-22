import { Link } from "@tanstack/react-router";
import { Instagram, Facebook } from "lucide-react";
import { Truck, RotateCcw, CreditCard } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      {/* Trust rinforzo */}
      <div className="border-b border-border">
        <div className="container-mb grid grid-cols-1 gap-6 py-10 sm:grid-cols-3">
          {[
            { icon: Truck, title: "Spedizione gratuita", sub: "Consegna con BRT FermoPoint" },
            { icon: RotateCcw, title: "Reso gratuito", sub: "Cambio o buono acquisto" },
            { icon: CreditCard, title: "Paga in 3 rate", sub: "Klarna e Scalapay" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3">
              <Icon className="h-6 w-6 mt-0.5 text-foreground" strokeWidth={1.25} />
              <div>
                <div className="text-sm font-medium">{title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-mb grid grid-cols-2 gap-10 py-14 md:grid-cols-5">
        <div className="col-span-2 md:col-span-1">
          <div className="text-sm font-semibold tracking-wide">MyBrand Italia</div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Una selezione curata delle migliori marche di tendenza per tutta la famiglia.
          </p>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label="Instagram" className="p-2 border border-border rounded-sm hover:bg-background">
              <Instagram className="h-4 w-4" strokeWidth={1.5} />
            </a>
            <a href="#" aria-label="Facebook" className="p-2 border border-border rounded-sm hover:bg-background">
              <Facebook className="h-4 w-4" strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <FooterCol title="Categorie" links={["Donna", "Uomo", "Bambino", "Scarpe", "Accessori"]} />
        <FooterCol title="Brand" links={["EA7", "Tommy Hilfiger", "Calvin Klein", "Guess", "Tutti i brand"]} />
        <FooterCol
          title="Servizio clienti"
          links={["Spedizioni", "Resi e cambi", "Metodi di pagamento", "Contattaci", "FAQ"]}
        />
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">Chi siamo</div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Vieni a trovarci nel nostro store fisico:
            <br />
            <span className="text-foreground">C.C. I Portali</span>
            <br />
            San Giovanni La Punta (CT)
          </p>
          <div className="mt-6 text-xs font-semibold uppercase tracking-[0.14em]">Newsletter</div>
          <form className="mt-3 flex gap-0 border border-border-strong rounded-sm overflow-hidden">
            <input
              type="email"
              placeholder="La tua email"
              className="flex-1 bg-background px-3 py-2 text-xs outline-none"
            />
            <button className="bg-foreground text-background px-3 text-xs">Iscriviti</button>
          </form>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-mb flex flex-col gap-2 py-6 text-xs text-muted-foreground md:flex-row md:justify-between">
          <div>© {new Date().getFullYear()} MyBrand Italia — Tutti i diritti riservati</div>
          <div className="flex gap-4">
            <Link to="/">Privacy</Link>
            <Link to="/">Cookie</Link>
            <Link to="/">Termini</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">{title}</div>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
