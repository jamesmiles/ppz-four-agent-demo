import { site } from "@/lib/site";
import { products, formatPrice } from "@/data/products";
import { ButtonLink } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  const featured = products.slice(0, 3);
  return (
    <div data-testid="page-home">
      {/* Hero */}
      <section className="bg-roast text-cream">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <p className="text-sm uppercase tracking-widest text-amber-on-dark">
            Small-batch · Roasted to order
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
            Carefully roasted, plainly spoken.
          </h1>
          <p className="mt-5 max-w-xl text-cream/80">{site.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/shop" variant="accent" data-testid="cta-shop">
              Shop Coffee
            </ButtonLink>
            <ButtonLink
              href="/subscriptions"
              variant="ghost"
              className="text-cream hover:bg-espresso"
              data-testid="cta-subscriptions"
            >
              Explore Subscriptions
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold text-roast">Best sellers</h2>
          <Link
            href="/shop"
            className="text-sm text-amber-hover hover:underline"
          >
            View all &rarr;
          </Link>
        </div>
        <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {featured.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/shop/${p.slug}`}
                className="block rounded-lg border border-oat bg-cream p-6 transition-shadow hover:shadow-md"
                data-testid={`home-product-${p.slug}`}
              >
                <p className="text-xs uppercase tracking-wide text-muted">
                  {p.origin} · {p.roast}
                </p>
                <h3 className="mt-2 text-lg font-medium text-roast">
                  {p.name}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {p.tasting.join(" · ")}
                </p>
                <p className="mt-4 font-semibold text-roast">
                  {formatPrice(p.priceCents)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Trust row */}
      <section className="bg-oat/50">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-16 sm:grid-cols-3">
          {[
            ["Roasted to order", "We roast the day we ship — never sitting on a shelf."],
            ["Ethically sourced", "Direct-trade beans from growers we know and pay fairly."],
            ["Free shipping over $40", "Carbon-neutral delivery on every qualifying order."],
          ].map(([title, body]) => (
            <div key={title}>
              <h3 className="font-medium text-roast">{title}</h3>
              <p className="mt-2 text-sm text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
