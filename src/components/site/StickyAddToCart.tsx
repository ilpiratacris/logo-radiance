import { Price } from "@/components/site/Price";
import type { Product } from "@/lib/catalog";

/** Barra «Aggiungi» della scheda prodotto: solo mobile, compare dopo lo scorrimento. */
export function StickyAddToCart({
  product,
  image,
  size,
  visible,
  onAdd,
}: {
  product: Product;
  image: string;
  size: string | null;
  visible: boolean;
  onAdd: () => void;
}) {
  return (
    <div
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur transition-transform lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center gap-3 px-4 py-2.5">
        <img
          src={image}
          alt=""
          width={40}
          height={52}
          className="h-[52px] w-10 shrink-0 bg-background object-contain"
        />
        <div className="min-w-0 flex-1">
          <div className="brand-label truncate">{product.brand}</div>
          <Price price={product.price} oldPrice={product.oldPrice} />
        </div>
        <button
          type="button"
          onClick={onAdd}
          disabled={!size}
          className="btn-primary h-12 px-5 py-0"
        >
          {size ? "Aggiungi" : "Seleziona taglia"}
        </button>
      </div>
    </div>
  );
}
