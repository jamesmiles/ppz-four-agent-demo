"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice, type Product } from "@/data/products";
import { Button } from "@/components/ui/button";

export function BuyBox({ product }: { product: Product }) {
  const { add } = useCart();
  const [grind, setGrind] = useState(product.grinds[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add(product.slug, grind, qty);
    setAdded(true);
  }

  return (
    <div className="space-y-5">
      <p className="text-2xl font-semibold text-roast" data-testid="pdp-price">
        {formatPrice(product.priceCents)}
      </p>

      <label className="block text-sm">
        <span className="text-muted">Grind</span>
        <select
          className="mt-1 block min-h-11 w-full rounded-md border border-oat bg-cream px-3"
          value={grind}
          onChange={(e) => {
            setGrind(e.target.value as typeof grind);
            setAdded(false);
          }}
          data-testid="pdp-grind-select"
        >
          {product.grinds.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </label>

      <div className="text-sm">
        <span className="text-muted">Quantity</span>
        <div
          className="mt-1 inline-flex items-center gap-2"
          data-testid="pdp-qty-stepper"
        >
          <Button
            variant="outline"
            className="min-h-11 w-11 px-0"
            aria-label="Decrease quantity"
            onClick={() => {
              setQty((q) => Math.max(1, q - 1));
              setAdded(false);
            }}
          >
            −
          </Button>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => {
              setQty(Math.max(1, Number(e.target.value) || 1));
              setAdded(false);
            }}
            className="min-h-11 w-16 rounded-md border border-oat bg-cream px-3 text-center"
            data-testid="pdp-qty-input"
            aria-label="Quantity"
          />
          <Button
            variant="outline"
            className="min-h-11 w-11 px-0"
            aria-label="Increase quantity"
            onClick={() => {
              setQty((q) => q + 1);
              setAdded(false);
            }}
          >
            +
          </Button>
        </div>
      </div>

      <Button variant="accent" onClick={handleAdd} data-testid="pdp-add-to-cart">
        Add to cart
      </Button>

      {added && (
        <p
          role="status"
          className="rounded-md border border-success/30 bg-success/10 px-4 py-2 text-sm text-success"
          data-testid="pdp-add-toast"
        >
          Added to your cart.
        </p>
      )}
    </div>
  );
}
