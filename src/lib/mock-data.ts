import tshirt from "@/assets/p-tshirt.jpg";
import jeans from "@/assets/p-jeans.jpg";
import sneakers from "@/assets/p-sneakers.jpg";
import bag from "@/assets/p-bag.jpg";
import sweater from "@/assets/p-sweater.jpg";
import jacket from "@/assets/p-jacket.jpg";
import dress from "@/assets/p-dress.jpg";
import boots from "@/assets/p-boots.jpg";

export type Product = {
  slug: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  image: string;
  altImage?: string;
  colors: string[];
  badge?: "Nuovo" | "Ultimi pezzi";
  category: string;
};

export const products: Product[] = [
  { slug: "t-shirt-basic-cotone", name: "T-shirt in cotone", brand: "Calvin Klein", price: 29.9, image: tshirt, altImage: sweater, colors: ["#ffffff", "#111111", "#c9a98b"], badge: "Nuovo", category: "donna" },
  { slug: "jeans-slim-fit", name: "Jeans slim fit lavaggio medio", brand: "Tommy Hilfiger", price: 79.9, oldPrice: 109.9, image: jeans, altImage: tshirt, colors: ["#3b5b7a", "#111111"], category: "donna" },
  { slug: "sneakers-basse-pelle", name: "Sneakers basse in pelle", brand: "Vans", price: 89.0, image: sneakers, altImage: boots, colors: ["#ffffff", "#111111"], category: "scarpe" },
  { slug: "borsa-tracolla-nera", name: "Borsa a tracolla piccola", brand: "Guess", price: 119.0, oldPrice: 149.0, image: bag, altImage: boots, colors: ["#111111", "#7a5a44"], badge: "Ultimi pezzi", category: "accessori" },
  { slug: "maglione-costa-inglese", name: "Maglione a costa inglese", brand: "EA7", price: 99.0, image: sweater, altImage: tshirt, colors: ["#e8d7c1", "#111111", "#3b5b7a"], category: "donna" },
  { slug: "giubbotto-bomber-nero", name: "Bomber nylon", brand: "The North Face", price: 149.0, image: jacket, altImage: sweater, colors: ["#111111", "#3b3b3b"], badge: "Nuovo", category: "uomo" },
  { slug: "abito-midi-fiori", name: "Abito midi stampa floreale", brand: "Guess", price: 89.0, oldPrice: 119.0, image: dress, altImage: sweater, colors: ["#e8d7c1", "#c94a3a"], category: "donna" },
  { slug: "stivaletti-cuoio-tacco", name: "Stivaletti in pelle con tacco", brand: "Dr. Martens", price: 179.0, image: boots, altImage: sneakers, colors: ["#7a3a20", "#111111"], category: "scarpe" },
];

export const brands = [
  "EA7", "Tommy Hilfiger", "Calvin Klein", "Guess", "The North Face",
  "Vans", "Dr. Martens", "Birkenstock", "Napapijri", "Levi's",
];

export const mainNav = [
  { label: "Donna", href: "/categoria/donna" },
  { label: "Uomo", href: "/categoria/uomo" },
  { label: "Bambino", href: "/categoria/bambino" },
  { label: "Moda Mare", href: "/categoria/moda-mare" },
  { label: "Accessori", href: "/categoria/accessori" },
  { label: "Brand", href: "/categoria/brand" },
  { label: "Offerte", href: "/categoria/offerte" },
  { label: "Outfit", href: "/categoria/outfit" },
  { label: "Gift Card", href: "/categoria/gift-card" },
];

export function findProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
