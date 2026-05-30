"use client";

import { useCart } from "@/lib/cart";
import { getProduct, formatPrice } from "@/data/products";
import { ButtonLink, Button } from "@/components/ui/button";

const FREE_SHIPPING_CENTS = 4000;
const SHIPPING_CENTS = 500;

export default function CartPage() {
  const { items, setQty, remove, subtotalCents } = useCart();

  if (items.length === 0) {
    return (
      <div
        className="mx-auto max-w-3xl px-4 py-20 text-center"
        data-testid="cart-empty"
      >
        <h1 className="text-3xl font-semibold text-roast">
          Your cart is empty.
        </h1>
        <p className="mt-3 text-muted">
          Find your next favourite roast in the shop.
        </p>
        <ButtonLink href="/shop" variant="accent" className="mt-8">
          Shop coffee
        </ButtonLink>
      </div>
    );
  }

  const shipping = subtotalCents >= FREE_SHIPPING_CENTS ? 0 : SHIPPING_CENTS;
  const total = subtotalCents + shipping;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12" data-testid="page-cart">
      <h1 className="text-3xl font-semibold text-roast">Your cart</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <ul className="space-y-4 lg:col-span-2">
          {items.map((item) => {
            const product = getProduct(item.slug);
            if (!product) return null;
            return (
              <li
                key={`${item.slug}-${item.grind}`}
                className="flex items-center gap-4 rounded-lg border border-oat bg-cream p-4"
                data-testid="cart-line"
                data-slug={item.slug}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded bg-oat text-xs text-muted">
                  {product.roast}
                </div>
                <div className="flex-1">
                  <p
                    className="font-medium text-roast"
                    data-testid="cart-line-name"
                  >
                    {product.name}
                  </p>
                  <p className="text-sm text-muted">{item.grind}</p>
                </div>
                <input
                  type="number"
                  min={0}
                  value={item.qty}
                  onChange={(e) =>
                    setQty(item.slug, item.grind, Number(e.target.value))
                  }
                  className="min-h-11 w-20 rounded-md border border-oat bg-white px-3"
                  data-testid="cart-line-qty"
                  aria-label={`Quantity for ${product.name}`}
                />
                <p className="w-20 text-right font-medium text-roast">
                  {formatPrice(product.priceCents * item.qty)}
                </p>
                <Button
                  variant="ghost"
                  onClick={() => remove(item.slug, item.grind)}
                  data-testid="cart-line-remove"
                  aria-label={`Remove ${product.name}`}
                  className="text-error hover:bg-error/10"
                >
                  Remove
                </Button>
              </li>
            );
          })}
        </ul>

        {/* Summary */}
        <aside className="h-fit rounded-lg border border-oat bg-cream p-6">
          <h2 className="font-display text-lg font-semibold text-roast">
            Order summary
          </h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd data-testid="cart-subtotal">{formatPrice(subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd data-testid="cart-shipping">
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-oat pt-2 font-semibold text-roast">
              <dt>Total</dt>
              <dd data-testid="cart-total">{formatPrice(total)}</dd>
            </div>
          </dl>
          <ButtonLink
            href="/checkout"
            variant="accent"
            className="mt-6 w-full"
            data-testid="cart-checkout-button"
          >
            Proceed to checkout
          </ButtonLink>
        </aside>
      </div>
    </div>
  );
}
