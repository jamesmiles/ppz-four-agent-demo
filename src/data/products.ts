/** Mock product catalogue for Northwind Coffee Co. (fictional demo data). */
export type Roast = "Light" | "Medium" | "Dark";
export type Grind = "Whole bean" | "Filter" | "Espresso";

export type Product = {
  slug: string;
  name: string;
  origin: string;
  roast: Roast;
  grinds: Grind[];
  priceCents: number;
  weightGrams: number;
  tasting: string[];
  description: string;
};

export const products: Product[] = [
  {
    slug: "ethiopia-yirgacheffe",
    name: "Yirgacheffe",
    origin: "Ethiopia",
    roast: "Light",
    grinds: ["Whole bean", "Filter", "Espresso"],
    priceCents: 1800,
    weightGrams: 250,
    tasting: ["Jasmine", "Bergamot", "Stone fruit"],
    description:
      "A bright, floral washed Yirgacheffe with delicate tea-like body. Roasted light to let the origin sing.",
  },
  {
    slug: "colombia-huila",
    name: "Huila Supremo",
    origin: "Colombia",
    roast: "Medium",
    grinds: ["Whole bean", "Filter", "Espresso"],
    priceCents: 1600,
    weightGrams: 250,
    tasting: ["Caramel", "Red apple", "Cocoa"],
    description:
      "An everyday crowd-pleaser. Balanced sweetness and a clean, juicy finish that works in any brewer.",
  },
  {
    slug: "guatemala-antigua",
    name: "Antigua",
    origin: "Guatemala",
    roast: "Medium",
    grinds: ["Whole bean", "Filter", "Espresso"],
    priceCents: 1700,
    weightGrams: 250,
    tasting: ["Milk chocolate", "Almond", "Orange"],
    description:
      "Grown in volcanic soil at altitude. Rich chocolate body with a gentle citrus lift.",
  },
  {
    slug: "sumatra-mandheling",
    name: "Mandheling",
    origin: "Sumatra",
    roast: "Dark",
    grinds: ["Whole bean", "Filter", "Espresso"],
    priceCents: 1700,
    weightGrams: 250,
    tasting: ["Dark chocolate", "Cedar", "Molasses"],
    description:
      "Bold, syrupy and low-acid. A dark roast for those who like their cup deep and earthy.",
  },
  {
    slug: "northwind-house-blend",
    name: "Northwind House Blend",
    origin: "Blend",
    roast: "Medium",
    grinds: ["Whole bean", "Filter", "Espresso"],
    priceCents: 1500,
    weightGrams: 250,
    tasting: ["Brown sugar", "Hazelnut", "Cherry"],
    description:
      "Our signature blend — comforting, versatile and consistent batch after batch.",
  },
  {
    slug: "brazil-cerrado-decaf",
    name: "Cerrado Decaf",
    origin: "Brazil",
    roast: "Medium",
    grinds: ["Whole bean", "Filter", "Espresso"],
    priceCents: 1600,
    weightGrams: 250,
    tasting: ["Peanut", "Caramel", "Smooth"],
    description:
      "Sugarcane-process decaf with all the flavour and none of the buzz. Great any time of day.",
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
