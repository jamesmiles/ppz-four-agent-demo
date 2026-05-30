"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/data/products";
import { Button, ButtonLink } from "@/components/ui/button";

const FREE_SHIPPING_CENTS = 4000;
const SHIPPING_CENTS = 500;

// v2 field ids. Required set = Option A (confirmed by David).
const FIELDS = [
  { id: "email", label: "Email", type: "email", required: true },
  { id: "name", label: "Full name", required: true },
  { id: "address1", label: "Address line 1", required: true },
  { id: "address2", label: "Address line 2 (optional)" },
  { id: "city", label: "City" },
  { id: "region", label: "State / Region" },
  { id: "postcode", label: "Postcode" },
  { id: "country", label: "Country" },
  { id: "phone", label: "Phone", type: "tel" },
  { id: "card-number", label: "Card number (demo — no real charge)", required: true, inputMode: "numeric" as const },
  { id: "card-expiry", label: "Expiry (MM/YY)", required: true, placeholder: "MM/YY" },
  { id: "card-cvc", label: "CVC", required: true, inputMode: "numeric" as const },
] as const;

type FieldId = (typeof FIELDS)[number]["id"];
type Values = Record<FieldId, string>;
type Errors = Partial<Record<FieldId, string>> & { form?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.email.trim()) e.email = "Enter your email address.";
  else if (!EMAIL_RE.test(v.email)) e.email = "Enter a valid email address.";
  if (!v.name.trim()) e.name = "Enter your full name.";
  if (!v.address1.trim()) e.address1 = "Enter your shipping address.";

  const card = v["card-number"].replace(/\s+/g, "");
  if (!card) e["card-number"] = "Enter your card number.";
  else if (!/^\d{12,19}$/.test(card)) e["card-number"] = "Enter a valid card number.";

  if (!v["card-expiry"].trim()) e["card-expiry"] = "Enter the card expiry date.";
  else {
    const m = v["card-expiry"].match(/^(\d{2})\s*\/\s*(\d{2})$/);
    if (!m) e["card-expiry"] = "Use MM/YY format.";
    else {
      const month = Number(m[1]);
      const year = 2000 + Number(m[2]);
      const now = new Date();
      const exp = new Date(year, month, 0, 23, 59, 59);
      if (month < 1 || month > 12) e["card-expiry"] = "Use MM/YY format.";
      else if (exp < now) e["card-expiry"] = "Card has expired.";
    }
  }

  if (!v["card-cvc"].trim()) e["card-cvc"] = "Enter the 3-digit security code.";
  else if (!/^\d{3,4}$/.test(v["card-cvc"].trim()))
    e["card-cvc"] = "Enter the 3-digit security code.";

  return e;
}

const EMPTY: Values = Object.fromEntries(
  FIELDS.map((f) => [f.id, ""]),
) as Values;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalCents, clear } = useCart();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [testMode, setTestMode] = useState(
    process.env.NEXT_PUBLIC_TEST_MODE === "1",
  );

  useEffect(() => {
    // Read ?test=1 on the client only (window is unavailable during SSR).
    if (new URLSearchParams(window.location.search).get("test") === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTestMode(true);
    }
  }, []);

  function set(id: FieldId, value: string) {
    setValues((v) => ({ ...v, [id]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(values);
    if (Object.keys(found).length > 0) {
      setErrors({ ...found, form: "Please fix the highlighted fields." });
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, testMode }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrors({
          form: data.error ?? "Something went wrong. Please try again.",
        });
        setSubmitting(false);
        return; // No navigation; entered values are retained.
      }
      clear();
      router.push(`/checkout/success?order=${encodeURIComponent(data.orderId)}`);
    } catch {
      setErrors({ form: "Network error. Please try again." });
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-semibold text-roast">
          Your cart is empty.
        </h1>
        <p className="mt-3 text-muted">Add a coffee before checking out.</p>
        <ButtonLink href="/shop" variant="accent" className="mt-8">
          Shop coffee
        </ButtonLink>
      </div>
    );
  }

  const shipping = subtotalCents >= FREE_SHIPPING_CENTS ? 0 : SHIPPING_CENTS;
  const total = subtotalCents + shipping;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12" data-testid="page-checkout">
      <h1 className="text-3xl font-semibold text-roast">Checkout</h1>
      <p className="mt-2 text-sm text-muted">
        Demo store — no real charge is made
        {testMode ? " (test-safe mode on)." : "."}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <form
          className="space-y-5 lg:col-span-2"
          onSubmit={onSubmit}
          noValidate
          data-testid="checkout-form"
        >
          {errors.form && (
            <div
              role="alert"
              className="rounded-md border border-error/40 bg-error/10 px-4 py-3 text-sm text-error"
              data-testid="checkout-form-error"
            >
              {errors.form}
            </div>
          )}

          {FIELDS.map((f) => {
            const errorId = `checkout-error-${f.id}`;
            const error = errors[f.id];
            return (
              <div key={f.id}>
                <label
                  htmlFor={`checkout-${f.id}`}
                  className="block text-sm font-medium text-ink"
                >
                  {f.label}
                  {"required" in f && f.required ? "" : ""}
                </label>
                <input
                  id={`checkout-${f.id}`}
                  type={"type" in f ? f.type : "text"}
                  inputMode={"inputMode" in f ? f.inputMode : undefined}
                  placeholder={"placeholder" in f ? f.placeholder : undefined}
                  value={values[f.id]}
                  onChange={(e) => set(f.id, e.target.value)}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? errorId : undefined}
                  className="mt-1 block min-h-11 w-full rounded-md border border-oat bg-cream px-3 aria-[invalid=true]:border-error"
                  data-testid={`checkout-${f.id}`}
                />
                {error && (
                  <p
                    id={errorId}
                    className="mt-1 text-sm text-error"
                    data-testid={errorId}
                  >
                    {error}
                  </p>
                )}
              </div>
            );
          })}

          <Button
            type="submit"
            variant="accent"
            disabled={submitting}
            data-testid="checkout-place-order"
          >
            {submitting ? "Placing order…" : "Place order"}
          </Button>
        </form>

        {/* Summary */}
        <aside className="h-fit rounded-lg border border-oat bg-cream p-6">
          <h2 className="font-display text-lg font-semibold text-roast">
            Summary
          </h2>
          <ul className="mt-4 space-y-1 text-sm text-muted">
            {items.map((i) => (
              <li key={`${i.slug}-${i.grind}`}>
                {i.qty} × {i.slug} ({i.grind})
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1 border-t border-oat pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{formatPrice(subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between font-semibold text-roast">
              <dt>Total</dt>
              <dd data-testid="checkout-summary-total">{formatPrice(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
