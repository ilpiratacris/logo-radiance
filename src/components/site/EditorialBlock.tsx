import { Link } from "@tanstack/react-router";

/** Blocco editoriale scuro tra due filetti rossi: foto, testo e invito. */
export function EditorialBlock({
  image,
  imageAlt = "",
  eyebrow = "Ispirazione",
  title,
  copy,
  cta,
}: {
  image: string;
  imageAlt?: string;
  eyebrow?: string;
  title: string;
  copy?: string;
  cta: {
    label: string;
    to: string;
    params?: Record<string, string>;
    search?: Record<string, string>;
  };
}) {
  return (
    <section className="border-y-8 border-brand-red bg-foreground py-10 text-background md:py-14">
      <div className="container-mb grid items-center gap-6 md:grid-cols-2">
        <img
          src={image}
          alt={imageAlt}
          width={1600}
          height={1200}
          loading="lazy"
          className="aspect-[4/3] w-full bg-surface object-contain"
        />
        <div>
          <div className="eyebrow-wide">{eyebrow}</div>
          <h2 className="mt-2 text-2xl font-semibold leading-8 tracking-tight md:text-3xl md:leading-9">
            {title}
          </h2>
          {copy && <p className="mt-2 max-w-md text-sm leading-5">{copy}</p>}
          <Link
            to={cta.to}
            params={cta.params as never}
            search={cta.search as never}
            className="btn-inverse mt-5"
          >
            {cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
