import { Truck, RotateCcw, CreditCard, Headphones } from "lucide-react";

const items = [
  { icon: Truck, title: "Spedizione tracciata", sub: "Consegna in tutta Italia" },
  { icon: RotateCcw, title: "Reso facile" },
  { icon: CreditCard, title: "Pagamenti sicuri" },
  { icon: Headphones, title: "Assistenza", sub: "Ti rispondiamo sempre" },
];

export function TrustBar({ compact }: { compact?: boolean }) {
  return (
    <section className={compact ? "" : "border-t border-border bg-surface py-8"}>
      <ul
        className={`grid gap-4 ${compact ? "grid-cols-1" : "container-mb grid-cols-2 lg:grid-cols-4"}`}
      >
        {items.map(({ icon: Icon, title, sub }) => (
          <li key={title} className="flex items-center gap-3">
            <Icon className="h-5 w-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
            <div>
              <div className="text-xs font-semibold leading-4">{title}</div>
              {sub && <div className="text-[11px] leading-4 text-muted-foreground">{sub}</div>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
