import { Link } from "@tanstack/react-router";
import type { Campaign } from "@/lib/catalog";

/** Apertura della home: foto a tutta larghezza, titolo di stagione e accesso ai tre reparti. */
export function Hero({ campaign }: { campaign: Campaign }) {
  return (
    <section className="relative">
      <picture>
        {campaign.imageMobile && (
          <source media="(max-width: 767px)" srcSet={campaign.imageMobile} />
        )}
        <img
          src={campaign.image}
          alt={campaign.headline}
          width={1920}
          height={1080}
          fetchPriority="high"
          className="h-[560px] w-full object-cover object-top md:h-[620px]"
        />
      </picture>
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-foreground/75 via-foreground/20 to-transparent">
        <div className="container-mb pb-8 md:pb-12">
          <span className="eyebrow-wide text-background">{campaign.label}</span>
          <h1 className="mt-2 max-w-xl text-3xl font-semibold leading-[1.05] tracking-tight text-background md:text-5xl md:leading-[1.05]">
            {campaign.headline}
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-5 text-background md:text-base md:leading-6">
            {campaign.copy}
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2 md:flex md:flex-wrap">
            {campaign.cta.map((c) => (
              <Link
                key={c.to}
                to="/reparto/$slug"
                params={{ slug: c.to }}
                className="btn-inverse px-2 text-xs md:px-6 md:text-sm"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
