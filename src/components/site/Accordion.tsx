import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";

export type AccordionItem = { id: string; label: string; body: ReactNode };

/** Fisarmonica a voce singola: aprirne una chiude l'altra. */
export function Accordion({
  items,
  defaultOpen,
}: {
  items: AccordionItem[];
  defaultOpen?: string;
}) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);

  return (
    <div className="border-t border-border">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id} className="border-b border-border">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              aria-controls={`acc-${item.id}`}
              className="flex h-14 w-full items-center justify-between text-left text-sm font-medium"
            >
              {item.label}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </button>
            {isOpen && (
              <div
                id={`acc-${item.id}`}
                className="pb-4 text-sm leading-relaxed text-muted-foreground"
              >
                {item.body}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
