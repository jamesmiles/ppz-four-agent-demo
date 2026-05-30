"use client";

import Link from "next/link";
import { site } from "@/lib/site";
import { useCart } from "@/lib/cart";

export function SiteHeader() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-oat bg-crema/90 backdrop-blur">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4"
        aria-label="Main"
      >
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-roast"
          data-testid="nav-logo"
        >
          {site.name}
        </Link>

        <ul className="hidden items-center gap-6 sm:flex">
          {site.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm text-ink hover:text-amber-hover"
                data-testid={item.testid}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden min-h-11 items-center px-2 text-sm text-roast hover:text-amber-hover sm:inline-flex"
            data-testid="nav-search-button"
            aria-label="Search"
          >
            Search
          </button>
          <Link
            href="/cart"
            className="relative inline-flex min-h-11 items-center text-sm font-medium text-roast hover:text-amber-hover"
            data-testid="nav-cart-button"
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
          >
            Cart
            <span
              className="ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-amber px-1.5 text-xs font-semibold text-espresso"
              data-testid="nav-cart-count"
            >
              {count}
            </span>
          </Link>
          <button
            type="button"
            className="inline-flex min-h-11 items-center px-2 text-sm text-roast sm:hidden"
            data-testid="nav-mobile-toggle"
            aria-label="Open menu"
          >
            Menu
          </button>
        </div>
      </nav>
    </header>
  );
}
