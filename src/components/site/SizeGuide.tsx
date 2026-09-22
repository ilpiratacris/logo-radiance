import { BottomSheet } from "@/components/site/BottomSheet";

/** PLACEHOLDER: tabella taglie da fornire dal backend / per singolo brand. */
export function SizeGuide({
  open,
  onClose,
  brand,
}: {
  open: boolean;
  onClose: () => void;
  brand: string;
}) {
  const rows = [
    ["XS", "44", "84-88", "70-74"],
    ["S", "46", "88-92", "74-78"],
    ["M", "48", "92-96", "78-82"],
    ["L", "50", "96-102", "82-88"],
    ["XL", "52", "102-108", "88-94"],
    ["XXL", "54", "108-114", "94-100"],
  ];

  return (
    <BottomSheet open={open} onClose={onClose} title="Guida alle taglie">
      <div className="p-4">
        <p className="text-sm text-muted-foreground">
          Tabella indicativa per {brand}. PLACEHOLDER: dati taglie da caricare dal backend per ogni brand.
        </p>
        <table className="mt-4 w-full border border-border text-sm">
          <thead className="bg-surface text-left">
            <tr>
              <th className="p-2 font-semibold">Taglia</th>
              <th className="p-2 font-semibold">IT</th>
              <th className="p-2 font-semibold">Torace (cm)</th>
              <th className="p-2 font-semibold">Vita (cm)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="border-t border-border">
                {r.map((c, i) => (
                  <td key={i} className="p-2">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BottomSheet>
  );
}
