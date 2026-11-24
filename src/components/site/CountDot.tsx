import type { ReactNode } from "react";

/** Contatore tondo su icone (carrello, wishlist). */
export function CountDot({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold leading-none text-background ${className}`}
    >
      {children}
    </span>
  );
}
