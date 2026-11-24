import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export type SectionLink = {
  label: string;
  to: string;
  params?: Record<string, string>;
  search?: Record<string, string>;
};

/** Testata di sezione: occhiello, titolo e link «Vedi tutti» opzionale. */
export function SectionHeader({
  eyebrow,
  title,
  link,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  link?: SectionLink;
  className?: string;
}) {
  return (
    <div className={`flex items-end justify-between gap-4 ${className}`}>
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2 className="mt-1 text-xl font-semibold leading-7 tracking-tight md:text-2xl md:leading-8">
          {title}
        </h2>
      </div>
      {link && (
        <Link
          to={link.to}
          params={link.params as never}
          search={link.search as never}
          className="flex h-11 shrink-0 items-center gap-1 text-xs font-medium underline-offset-4 hover:underline"
        >
          {link.label} <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
