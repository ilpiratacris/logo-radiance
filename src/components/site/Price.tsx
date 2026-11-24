import { formatPrice } from "@/lib/catalog";

/** Prezzo: in offerta il prezzo ridotto è rosso, il pieno barrato, la percentuale opzionale. */
export function Price({
  price,
  oldPrice,
  size = "md",
  showDiscount,
  className = "",
}: {
  price: number;
  oldPrice?: number;
  size?: "md" | "lg";
  showDiscount?: boolean;
  className?: string;
}) {
  const sale = oldPrice !== undefined && oldPrice > price;
  const discount = sale ? Math.round((1 - price / oldPrice) * 100) : 0;
  const lg = size === "lg";

  return (
    <div className={`flex flex-wrap items-baseline gap-x-2 ${className}`}>
      <span
        className={`font-semibold ${lg ? "text-2xl leading-8" : "text-sm leading-5"} ${sale ? "text-sale" : ""}`}
      >
        {formatPrice(price)}
      </span>
      {sale && (
        <span
          className={`text-muted-foreground line-through ${lg ? "text-sm leading-5" : "text-xs leading-4"}`}
        >
          {formatPrice(oldPrice)}
        </span>
      )}
      {sale && showDiscount && (
        <span className="text-sm font-semibold text-sale">−{discount}%</span>
      )}
    </div>
  );
}
