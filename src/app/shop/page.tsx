"use client";

import { useState } from "react";
import Link from "next/link";
import {
  products,
  formatPrice,
  type Roast,
  type Grind,
} from "@/data/products";

const ROASTS: Roast[] = ["Light", "Medium", "Dark"];
const ORIGINS = Array.from(new Set(products.map((p) => p.origin)));
const GRINDS: Grind[] = ["Whole bean", "Filter", "Espresso"];

export default function ShopPage() {
  const [roast, setRoast] = useState<Roast | "All">("All");
  const [origin, setOrigin] = useState<string>("All");
  const [grind, setGrind] = useState<Grind | "All">("All");

  const filtered = products.filter(
    (p) =>
      (roast === "All" || p.roast === roast) &&
      (origin === "All" || p.origin === origin) &&
      (grind === "All" || p.grinds.includes(grind)),
  );

  // Reflect filters in the URL query (?roast=dark) without a navigation.
  function syncQuery(next: { roast?: string; origin?: string; grind?: string }) {
    const params = new URLSearchParams();
    const r = (next.roast ?? roast).toLowerCase();
    const o = next.origin ?? origin;
    const g = next.grind ?? grind;
    if (r !== "all") params.set("roast", r);
    if (o !== "All") params.set("origin", o);
    if (g !== "All") params.set("grind", g);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `/shop?${qs}` : "/shop");
  }

  function clearFilters() {
    setRoast("All");
    setOrigin("All");
    setGrind("All");
    window.history.replaceState(null, "", "/shop");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12" data-testid="page-shop">
      <h1 className="text-3xl font-semibold text-roast">Shop Coffee</h1>
      <p className="mt-2 text-muted" data-testid="shop-result-count">
        {filtered.length} of {products.length} roasts
      </p>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-end gap-6" data-testid="shop-filters">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted">Roast</span>
          <select
            className="min-h-11 rounded-md border border-oat bg-cream px-3"
            value={roast}
            onChange={(e) => {
              const v = e.target.value as Roast | "All";
              setRoast(v);
              syncQuery({ roast: v });
            }}
            data-testid="shop-filter-roast"
          >
            <option value="All">All</option>
            {ROASTS.map((r) => (
              <option key={r} value={r} data-value={r.toLowerCase()}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted">Origin</span>
          <select
            className="min-h-11 rounded-md border border-oat bg-cream px-3"
            value={origin}
            onChange={(e) => {
              setOrigin(e.target.value);
              syncQuery({ origin: e.target.value });
            }}
            data-testid="shop-filter-origin"
          >
            <option value="All">All</option>
            {ORIGINS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted">Grind</span>
          <select
            className="min-h-11 rounded-md border border-oat bg-cream px-3"
            value={grind}
            onChange={(e) => {
              const v = e.target.value as Grind | "All";
              setGrind(v);
              syncQuery({ grind: v });
            }}
            data-testid="shop-filter-grind"
          >
            <option value="All">All</option>
            {GRINDS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={clearFilters}
          className="min-h-11 text-sm text-amber-hover hover:underline"
          data-testid="shop-filter-clear"
        >
          Clear filters
        </button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="mt-12 text-muted" data-testid="shop-empty">
          No coffees match your filters.
        </p>
      ) : (
        <ul
          className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          data-testid="shop-grid"
        >
          {filtered.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/shop/${p.slug}`}
                className="block h-full rounded-lg border border-oat bg-cream p-6 transition-shadow hover:shadow-md"
                data-testid="product-card"
                data-slug={p.slug}
              >
                <p className="text-xs uppercase tracking-wide text-muted">
                  {p.origin}
                </p>
                <span className="mt-2 inline-block rounded-full bg-oat px-2 py-0.5 text-xs text-roast">
                  {p.roast} roast
                </span>
                <h2
                  className="mt-2 text-lg font-medium text-roast"
                  data-testid="product-card-name"
                >
                  {p.name}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {p.tasting.join(" · ")}
                </p>
                <p
                  className="mt-4 font-semibold text-roast"
                  data-testid="product-card-price"
                >
                  {formatPrice(p.priceCents)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
