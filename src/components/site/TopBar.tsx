import { Truck, RotateCcw, CreditCard } from "lucide-react";

export function TopBar() {
  const items = [
    { icon: Truck, label: "Spedizione gratuita" },
    { icon: RotateCcw, label: "Reso gratuito" },
    { icon: CreditCard, label: "Paga in 3 rate" },
  ];
  return (
    <div className="border-b border-border bg-foreground text-background">
      <div className="container-mb flex h-9 items-center justify-center gap-8 text-[11px] uppercase tracking-[0.14em] sm:gap-12">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label.split(" ")[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
