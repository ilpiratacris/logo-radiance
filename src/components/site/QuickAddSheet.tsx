import { useState } from "react";
import { BottomSheet } from "@/components/site/BottomSheet";
import { formatPrice, type Product } from "@/lib/catalog";
import { useStore } from "@/lib/store";

export function QuickAddSheet({
  product,
  initialVariant = 0,
  open,
  onClose,
}: {
  product: Product;
  initialVariant?: number;
  open: boolean;
  onClose: () => void;
}) {
  const [vi, setVi] = useState(initialVariant);
  const [size, setSize] = useState<string | null>(null);
  const { addToCart } = useStore();
  const variant = product.variants[vi] ?? product.variants[0];

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Aggiungi rapido"
      footer={
        <button
          disabled={!size}
          onClick={() => {
            if (!size) return;
            addToCart({
              slug: product.slug,
              name: product.name,
              brand: product.brand,
              image: variant.image,
              color: variant.label,
              size,
              price: product.price,
              oldPrice: product.oldPrice,
              qty: 1,
            });
            onClose();
          }}
          className="btn-primary w-full disabled:opacity-40"
        >
          {size ? "Aggiungi al carrello" : "Seleziona la taglia"}
        </button>
      }
    >
      <div className="p-4">
        <div className="flex gap-3">
          <img src={variant.image} alt="" width={120} height={160} className="h-28 w-21 object-cover" />
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em]">{product.brand}</div>
            <div className="text-sm text-muted-foreground">{product.name}</div>
            <div className="mt-1 text-sm font-semibold">{formatPrice(product.price)}</div>
          </div>
        </div>

        {product.variants.length > 1 && (
          <div className="mt-5">
            <div className="text-xs font-semibold uppercase tracking-[0.12em]">
              Colore: <span className="font-normal normal-case text-muted-foreground">{variant.label}</span>
            </div>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
              {product.variants.map((v, i) => (
                <button
                  key={v.key}
                  onClick={() => {
                    setVi(i);
                    setSize(null);
                  }}
                  aria-label={v.label}
                  aria-pressed={i === vi}
                  className={`h-16 w-14 shrink-0 overflow-hidden border ${i === vi ? "border-foreground" : "border-border"}`}
                >
                  <img src={v.image} alt="" width={56} height={64} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5">
          <div className="text-xs font-semibold uppercase tracking-[0.12em]">Taglia</div>
          <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6">
            {variant.sizes.map((s) => {
              const out = s.stock === 0;
              return (
                <button
                  key={s.size}
                  disabled={out}
                  onClick={() => setSize(s.size)}
                  className={`h-11 border text-sm ${
                    size === s.size
                      ? "border-foreground bg-foreground text-background"
                      : out
                        ? "border-border text-muted-foreground line-through"
                        : "border-border hover:border-foreground"
                  }`}
                >
                  {s.size}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
