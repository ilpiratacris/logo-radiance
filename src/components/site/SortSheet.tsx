import { Check } from "lucide-react";
import { BottomSheet } from "@/components/site/BottomSheet";
import { SORTS, type SortKey } from "@/lib/filters";

export function SortSheet({
  open,
  onClose,
  value,
  onChange,
}: {
  open: boolean;
  onClose: () => void;
  value?: SortKey;
  onChange: (k: SortKey) => void;
}) {
  return (
    <BottomSheet open={open} onClose={onClose} title="Ordina per">
      <ul className="divide-y divide-border">
        {SORTS.map((s) => {
          const active = (value ?? "rilevanza") === s.key;
          return (
            <li key={s.key}>
              <button
                onClick={() => {
                  onChange(s.key);
                  onClose();
                }}
                className="flex h-14 w-full items-center justify-between px-4 text-sm"
              >
                <span className={active ? "font-semibold" : ""}>{s.label}</span>
                {active && <Check className="h-4 w-4" strokeWidth={2} />}
              </button>
            </li>
          );
        })}
      </ul>
    </BottomSheet>
  );
}
