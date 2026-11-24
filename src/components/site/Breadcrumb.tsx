import { Link } from "@tanstack/react-router";
import { Fragment } from "react";

export type Crumb = {
  label: string;
  to?: string;
  params?: Record<string, string>;
  search?: Record<string, string>;
};

export function Breadcrumb({ items, className = "" }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-xs leading-4 text-muted-foreground ${className}`}>
      {items.map((item, i) => (
        <Fragment key={`${item.label}-${i}`}>
          {i > 0 && (
            <span aria-hidden="true" className="px-1.5">
              /
            </span>
          )}
          {item.to ? (
            <Link
              to={item.to}
              params={item.params as never}
              search={item.search as never}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
