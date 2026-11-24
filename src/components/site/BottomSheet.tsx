import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** fullscreen su mobile (per filtri/ricerca) */
  full?: boolean;
  side?: "bottom" | "right";
  footer?: ReactNode;
};

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  full,
  side = "bottom",
  footer,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const panel =
    side === "right"
      ? "fixed inset-y-0 right-0 w-full max-w-md animate-in slide-in-from-right duration-200"
      : full
        ? "fixed inset-x-0 bottom-0 top-0 sm:top-auto sm:max-h-[88vh] animate-in slide-in-from-bottom duration-200"
        : "fixed inset-x-0 bottom-0 max-h-[88vh] sm:left-1/2 sm:bottom-auto sm:top-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 animate-in slide-in-from-bottom duration-200";

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label={title}>
      <button
        aria-label="Chiudi"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-foreground/40 backdrop-blur-[1px]"
      />
      <div className={`${panel} flex flex-col bg-background shadow-sheet`}>
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
          <span className="text-sm font-semibold uppercase tracking-[0.12em]">{title}</span>
          <button type="button" onClick={onClose} aria-label="Chiudi" className="icon-btn -mr-2">
            <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer && (
          <div className="shrink-0 border-t border-border bg-background p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
