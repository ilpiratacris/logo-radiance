import { useState } from "react";
import { BottomSheet } from "@/components/site/BottomSheet";
import { ColorThumbs } from "@/components/site/ColorThumbs";
import { Price } from "@/components/site/Price";
import { SizeSelector } from "@/components/site/SizeSelector";
import type { Product } from "@/lib/catalog";
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
          type="button"
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
          className="btn-primary w-full"
        >
          {size ? "Aggiungi al carrello" : "Seleziona la taglia"}
        </button>
      }
    >
      <div className="p-4">
        <div className="flex gap-3">
          <img
            src={variant.image}
            alt=""
            width={84}
            height={112}
            className="h-28 w-[84px] shrink-0 bg-background object-contain"
          />
          <div className="min-w-0">
            <div className="brand-label">{product.brand}</div>
            <div className="text-sm text-muted-foreground">{product.name}</div>
            <Price price={product.price} oldPrice={product.oldPrice} className="mt-1" />
          </div>
        </div>

        {product.variants.length > 1 && (
          <div className="mt-5 grid gap-2">
            <div className="label-caps">
              Colore{" "}
              <span className="font-normal normal-case tracking-normal text-muted-foreground">
                {variant.label}
              </span>
            </div>
            <ColorThumbs
              variants={product.variants}
              value={vi}
              size="md"
              onChange={(i) => {
                setVi(i);
                setSize(null);
              }}
              className="no-scrollbar overflow-x-auto"
            />
          </div>
        )}

        <div className="mt-5 grid gap-2">
          <div className="label-caps">Taglia</div>
          <SizeSelector
            sizes={variant.sizes}
            selected={size ? [size] : []}
            onSelect={setSize}
            columns="grid-cols-4 sm:grid-cols-6"
            showStock
          />
        </div>
      </div>
    </BottomSheet>
  );
}
