import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import departmentUomoPortrait from "@/assets/department-uomo-portrait.jpg";
import departmentDonnaLandscape from "@/assets/department-donna-landscape.jpg";
import departmentBambinoLandscape from "@/assets/department-bambino-landscape.jpg";

const tile =
  "group relative block border-[6px] border-foreground bg-background transition-transform duration-300 md:hover:-translate-y-2 focus-visible:outline-background focus-visible:shadow-[0_0_0_4px_var(--color-foreground)]";

const side = [
  { slug: "donna", label: "Donna", image: departmentDonnaLandscape, red: false },
  { slug: "bambino", label: "Bambino", image: departmentBambinoLandscape, red: true },
] as const;

/** Fascia rossa «Scegli il tuo mondo»: Uomo in evidenza, Donna e Bambino a lato. */
export function DepartmentGrid() {
  return (
    <section className="overflow-hidden bg-brand-red py-9 md:py-16">
      <div className="container-mb">
        <div className="mb-8 flex flex-col gap-4 text-brand-red-foreground md:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow-wide font-bold">Inizia da qui</p>
            <h2 className="mt-2 max-w-3xl text-4xl font-extrabold uppercase leading-[0.92] md:text-7xl md:leading-[0.92]">
              Scegli il <span className="text-foreground">tuo</span> mondo
            </h2>
          </div>
          <p className="max-w-sm border-l-4 border-foreground pl-4 text-sm font-medium leading-relaxed">
            Tre selezioni diverse, un solo catalogo multibrand.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-[7fr_5fr] md:gap-7">
          <Link to="/reparto/$slug" params={{ slug: "uomo" }} className={tile}>
            <img
              src={departmentUomoPortrait}
              alt="Uomo"
              width={1024}
              height={1280}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
            <div className="absolute -bottom-3 left-3 bg-foreground px-5 py-4 text-background md:-bottom-6 md:-left-6 md:py-6 md:pl-8 md:pr-16">
              <span className="block text-[10px] font-bold uppercase tracking-[0.22em]">
                Collezione
              </span>
              <h3 className="mt-1 text-3xl font-extrabold uppercase leading-[1.1] md:text-5xl md:leading-none">
                Uomo
              </h3>
            </div>
            <span className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full border-2 border-foreground bg-background text-foreground transition-colors group-hover:bg-surface group-focus-visible:bg-surface md:bottom-8 md:right-8 md:h-14 md:w-14">
              <ArrowRight className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
            </span>
          </Link>

          <div className="grid gap-5 md:grid-rows-2 md:gap-7">
            {side.map((d) => (
              <Link
                key={d.slug}
                to="/reparto/$slug"
                params={{ slug: d.slug }}
                className={`${tile} min-h-[250px] overflow-hidden`}
              >
                <img
                  src={d.image}
                  alt={d.label}
                  width={1280}
                  height={720}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/65 to-transparent to-60%" />
                <div className="absolute inset-x-0 bottom-0 z-[1] flex items-end justify-between gap-3 p-5 text-background md:p-7">
                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.2em]">
                      Esplora
                    </span>
                    <h3 className="mt-1 text-3xl font-extrabold uppercase leading-[1.1] lg:text-4xl lg:leading-[1.1]">
                      {d.label}
                    </h3>
                  </div>
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${
                      d.red
                        ? "bg-brand-red text-brand-red-foreground group-hover:bg-brand-red-hover group-focus-visible:bg-brand-red-hover"
                        : "bg-background text-foreground group-hover:bg-surface group-focus-visible:bg-surface"
                    }`}
                  >
                    <ArrowRight className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
