import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, products } from "@/data/products";
import { BuyBox } from "@/components/buy-box";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return { title: product ? product.name : "Coffee" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12" data-testid="page-pdp">
      <nav className="text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/shop" className="hover:text-amber-hover">
          Shop
        </Link>
        <span className="px-2">/</span>
        <span className="text-roast">{product.name}</span>
      </nav>

      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Gallery placeholder */}
        <div className="flex aspect-square items-center justify-center rounded-lg bg-oat text-muted">
          <span className="font-display text-xl">{product.name}</span>
        </div>

        {/* Buy box */}
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">
            {product.origin}
          </p>
          <h1
            className="mt-1 text-3xl font-semibold text-roast"
            data-testid="pdp-title"
          >
            {product.name}
          </h1>
          <span
            className="mt-2 inline-block rounded-full bg-oat px-2 py-0.5 text-xs text-roast"
            data-testid="pdp-roast-badge"
          >
            {product.roast} roast
          </span>
          <p className="mt-4 text-muted">
            Tasting notes: {product.tasting.join(", ")}
          </p>

          <div className="mt-6">
            <BuyBox product={product} />
          </div>
        </div>
      </div>

      {/* Details */}
      <section className="mt-12 max-w-2xl">
        <h2 className="text-xl font-semibold text-roast">Description</h2>
        <p className="mt-3 text-ink/80">{product.description}</p>
      </section>
    </div>
  );
}
