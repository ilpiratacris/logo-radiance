import { Truck, RotateCcw, CreditCard } from "lucide-react";

export function TrustBar() {
  const items = [
    { icon: Truck, title: "Spedizione gratuita", sub: "BRT FermoPoint" },
    { icon: RotateCcw, title: "Reso gratuito", sub: "Cambio o buono acquisto" },
    { icon: CreditCard, title: "Paga in 3 rate", sub: "Klarna · Scalapay" },
  ];
  return (
    <div className="border border-border bg-background rounded-sm">
      <ul className="divide-y divide-border md:divide-y-0 md:divide-x md:grid md:grid-cols-3">
        {items.map(({ icon: Icon, title, sub }) => (
          <li key={title} className="flex items-center gap-3 p-4">
            <Icon className="h-5 w-5 shrink-0" strokeWidth={1.5} />
            <div>
              <div className="text-xs font-semibold">{title}</div>
              <div className="text-[11px] text-muted-foreground">{sub}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
