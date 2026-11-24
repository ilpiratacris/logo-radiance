import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/site/Hero";
import { DepartmentGrid } from "@/components/site/DepartmentGrid";
import { ProductCarousel } from "@/components/site/ProductCarousel";
import { BrandCarousel } from "@/components/site/BrandCarousel";
import { PromoBanner } from "@/components/site/PromoBanner";
import { EditorialBlock } from "@/components/site/EditorialBlock";
import { TrustBar } from "@/components/site/TrustBar";
import {
  bestSellers,
  campaigns,
  editorialImage,
  newArrivals,
  promoProducts,
  type Product,
} from "@/lib/catalog";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => {
    const title = "MyBrand Italia — moda multibrand donna, uomo e bambino";
    const description =
      "Novità, promozioni e i migliori brand fashion: Peuterey, EA7, The North Face, K-Way, Liu Jo e molti altri. Spedizione tracciata in tutta Italia.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: Home,
});

function Home() {
  const hero = campaigns[0]!;
  const promo = campaigns[1]!;
  const { department } = useStore();

  /** Selezione generale, con priorità commerciale Uomo senza reparto preselezionato. */
  const prioritize = (list: Product[]) => {
    const ordered = [
      ...list.filter((p) => p.department === "uomo"),
      ...list.filter((p) => p.department !== "uomo"),
    ];
    return Array.from(new Map(ordered.map((p) => [p.slug, p])).values()).slice(0, 10);
  };

  const listing = { to: "/categoria/$slug", toParams: { slug: department } };

  return (
    <SiteLayout>
      <Hero campaign={hero} />
      <DepartmentGrid />

      <ProductCarousel
        eyebrow="Appena arrivati"
        title="Novità"
        products={prioritize(newArrivals())}
        {...listing}
        toSearch={{ novita: "1" }}
      />

      <div className="border-y-8 border-brand-red">
        <BrandCarousel />
      </div>

      <ProductCarousel
        eyebrow="I più amati"
        title="Best seller"
        products={prioritize(bestSellers())}
        {...listing}
        toSearch={{ sort: "venduti" }}
      />

      <PromoBanner campaign={promo} />

      <div className="bg-surface">
        <ProductCarousel
          eyebrow="Occasioni"
          title="Prezzi ridotti"
          products={prioritize(promoProducts())}
          {...listing}
          toSearch={{ sconto: "1" }}
        />
      </div>

      <EditorialBlock
        image={editorialImage}
        imageAlt="Ispirazione stagionale"
        eyebrow="Ispirazione"
        title="Il layering dell’autunno"
        copy="Giubbotti tecnici, maglieria e denim: come combinare i capi dei brand del momento."
        cta={{
          label: "Scopri gli outfit",
          to: "/categoria/$slug",
          params: { slug: department },
          search: { cat: "giubbotti" },
        }}
      />

      <TrustBar />
    </SiteLayout>
  );
}
