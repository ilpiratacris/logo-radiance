import { CreditCard, RotateCcw, Truck } from "lucide-react";

const items = [
  { icon: Truck, label: "Spedizione tracciata" },
  { icon: RotateCcw, label: "Reso facile" },
  { icon: CreditCard, label: "Pagamenti sicuri" },
];

/** Tre rassicurazioni sotto le azioni d'acquisto. */
export function Reassure({ className = "mt-4" }: { className?: string }) {
  return (
    <ul
      className={`grid gap-2 border-t border-border pt-4 text-xs text-muted-foreground ${className}`}
    >
      {items.map(({ icon: Icon, label }) => (
        <li key={label} className="flex items-center gap-2">
          <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>
  );
}
