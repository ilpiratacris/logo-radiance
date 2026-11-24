import { Minus, Plus } from "lucide-react";

const btn = "flex h-10 w-10 items-center justify-center transition-colors hover:bg-foreground/8";

export function QuantityStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (qty: number) => void;
}) {
  return (
    <div className="inline-flex items-center border border-border">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        aria-label="Riduci quantità"
        className={btn}
      >
        <Minus className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
      </button>
      <span className="w-8 text-center text-sm" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label="Aumenta quantità"
        className={btn}
      >
        <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}
