/**
 * Central site configuration.
 *
 * The client is a FICTIONAL placeholder ("Northwind Coffee Co.") agreed by the
 * team for the demo. Everything brand-specific lives here so it can be swapped
 * in one place if the brief changes — nothing is hard-baked across the app.
 */
export const site = {
  name: "Northwind Coffee Co.",
  shortName: "Northwind",
  tagline: "Small-batch coffee, roasted to order.",
  description:
    "Northwind Coffee Co. roasts specialty, single-origin and blended coffee in small batches and ships it fresh to your door.",
  url: "https://northwindcoffee.co",
  nav: [
    { label: "Shop", href: "/shop", testid: "nav-link-shop" },
    { label: "Subscriptions", href: "/subscriptions", testid: "nav-link-subscriptions" },
    { label: "Our Roastery", href: "/about", testid: "nav-link-about" },
  ],
} as const;

export type SiteConfig = typeof site;
