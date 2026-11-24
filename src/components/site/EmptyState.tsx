import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** Stato vuoto: icona, una riga di testo e un'azione. */
export function EmptyState({
  icon: Icon,
  text,
  children,
}: {
  icon?: LucideIcon;
  text: string;
  children?: ReactNode;
}) {
  return (
    <div className="px-4 py-16 text-center">
      {Icon && (
        <Icon
          className="mx-auto mb-3 h-8 w-8 text-muted-foreground"
          strokeWidth={1.25}
          aria-hidden="true"
        />
      )}
      <p className="text-sm text-muted-foreground">{text}</p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
