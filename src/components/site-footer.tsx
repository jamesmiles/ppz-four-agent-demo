import Link from "next/link";
import { site } from "@/lib/site";

const columns = [
  {
    heading: "Shop",
    links: [
      ["Coffee", "/shop"],
      ["Subscriptions", "/subscriptions"],
    ],
  },
  {
    heading: "Company",
    links: [
      ["About", "/about"],
      ["Our Roastery", "/about"],
    ],
  },
  {
    heading: "Help",
    links: [
      ["Shipping", "/about"],
      ["FAQ", "/about"],
    ],
  },
  {
    heading: "Legal",
    links: [
      ["Privacy", "/about"],
      ["Terms", "/about"],
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer
      className="mt-auto bg-espresso text-crema/80"
      data-testid="footer"
    >
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.heading}>
              <h2 className="font-display text-sm font-semibold text-cream">
                {col.heading}
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="hover:text-amber-on-dark">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-10 border-t border-white/10 pt-6 text-xs text-crema/60">
          &copy; {site.name}. Fictional demo store — no real orders are placed.
        </p>
      </div>
    </footer>
  );
}
