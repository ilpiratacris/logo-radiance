import { Link } from "@tanstack/react-router";
import type { Campaign } from "@/lib/catalog";

/** Etichetta promo rossa, usata sul banner e nella pagina della promozione. */
export function PromoLabel({ children }: { children: string }) {
  return (
    <span className="inline-flex h-6 items-center bg-sale px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-background">
      {children}
    </span>
  );
}

/** Banner promozionale su fascia rossa: tutta l'area è il link alla promo. */
export function PromoBanner({ campaign }: { campaign: Campaign }) {
  return (
    <section className="bg-brand-red py-8 md:py-12">
      <div className="container-mb">
        <Link
          to="/promo/$slug"
          params={{ slug: campaign.slug }}
          className="group relative block overflow-hidden focus-visible:outline-background focus-visible:shadow-[0_0_0_4px_var(--color-foreground)]"
        >
          <img
            src={campaign.image}
            alt={campaign.headline}
            width={1600}
            height={900}
            loading="lazy"
            className="aspect-[4/5] w-full bg-surface object-contain sm:aspect-[16/10] lg:aspect-[16/7]"
          />
          <div className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-foreground/75 to-transparent p-5 md:p-8">
            <PromoLabel>{campaign.label}</PromoLabel>
            <h2 className="mt-2 max-w-md text-2xl font-semibold leading-8 tracking-tight text-background md:text-4xl md:leading-10">
              {campaign.headline}
            </h2>
            <p className="mt-1 max-w-md text-sm text-background">{campaign.copy}</p>
            <span className="btn-inverse mt-4 group-hover:bg-surface group-focus-visible:bg-surface">
              {campaign.cta[0]?.label ?? "Scopri la promo"}
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
