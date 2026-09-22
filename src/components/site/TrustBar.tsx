import { Truck, RotateCcw, CreditCard, Headphones } from "lucide-react";

const items = [
  { icon: Truck, title: "Spedizione tracciata", sub: "Consegna in tutta Italia" },
  { icon: RotateCcw, title: "Reso facile", sub: "Condizioni da backend" },
  { icon: CreditCard, title: "Pagamenti sicuri", sub: "Metodi da backend" },
  { icon: Headphones, title: "Assistenza", sub: "Ti rispondiamo sempre" },
];

export function TrustBar({ compact }: { compact?: boolean }) {
  return (
    <section className={compact ? "" : "border-t border-border bg-surface py-8"}>
      <ul
        className={`container-mb grid gap-4 ${
          compact ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {items.map(({ icon: Icon, title, sub }) => (
          <li key={title} className="flex items-center gap-3">
            <Icon className="h-5 w-5 shrink-0" strokeWidth={1.5} />
            <div>
              <div className="text-xs font-semibold">{title}</div>
              <div className="text-[11px] text-muted-foreground">{sub}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
