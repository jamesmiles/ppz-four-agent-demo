"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/data/products";

type Frequency = "Weekly" | "Fortnightly" | "Monthly";
const FREQUENCIES: Frequency[] = ["Weekly", "Fortnightly", "Monthly"];

// Per-fortnight base price; weekly = 2×, monthly = 0.5×.
const PLANS = [
  { name: "Solo", bags: 1, baseCents: 1600, popular: false },
  { name: "Duo", bags: 2, baseCents: 3000, popular: true },
  { name: "Office", bags: 4, baseCents: 5600, popular: false },
];

const MULTIPLIER: Record<Frequency, number> = {
  Weekly: 2,
  Fortnightly: 1,
  Monthly: 0.5,
};

export default function SubscriptionsPage() {
  const [frequency, setFrequency] = useState<Frequency>("Fortnightly");
  const [startedPlan, setStartedPlan] = useState<string | null>(null);

  return (
    <div data-testid="page-subscriptions">
      <section className="bg-roast text-cream">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h1 className="text-4xl font-semibold">
            Never run out of great coffee.
          </h1>
          <p className="mt-4 max-w-xl text-cream/80">
            Choose your beans, pick a frequency, and we roast and ship fresh on
            your schedule. Pause, skip or cancel any time.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        {/* How it works */}
        <ol className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            ["1. Choose beans", "Single-origin or our house blend."],
            ["2. Pick frequency", "Weekly, fortnightly or monthly."],
            ["3. We roast & ship", "Fresh to your door, carbon-neutral."],
          ].map(([t, b]) => (
            <li key={t} className="rounded-lg border border-oat bg-cream p-6">
              <h2 className="font-medium text-roast">{t}</h2>
              <p className="mt-2 text-sm text-muted">{b}</p>
            </li>
          ))}
        </ol>

        {/* Frequency toggle */}
        <div
          className="mt-12 inline-flex rounded-md border border-oat bg-cream p-1"
          role="group"
          aria-label="Delivery frequency"
          data-testid="subscription-frequency"
        >
          {FREQUENCIES.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFrequency(f)}
              className={`min-h-11 rounded px-4 text-sm ${
                frequency === f
                  ? "bg-roast text-cream"
                  : "text-roast hover:bg-oat"
              }`}
              aria-pressed={frequency === f}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Plans */}
        <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PLANS.map((plan) => {
            const price = Math.round(plan.baseCents * MULTIPLIER[frequency]);
            return (
              <li
                key={plan.name}
                className={`relative rounded-lg border bg-cream p-6 ${
                  plan.popular ? "border-amber" : "border-oat"
                }`}
                data-testid="subscription-plan"
                data-plan={plan.name.toLowerCase()}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-6 rounded-full bg-amber px-3 py-0.5 text-xs font-semibold text-espresso">
                    Most popular
                  </span>
                )}
                <h3 className="font-display text-xl font-semibold text-roast">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {plan.bags} bag{plan.bags > 1 ? "s" : ""} · {frequency}
                </p>
                <p className="mt-4 text-2xl font-semibold text-roast">
                  {formatPrice(price)}
                  <span className="text-sm font-normal text-muted">
                    {" "}
                    / delivery
                  </span>
                </p>
                <Button
                  variant="accent"
                  className="mt-6 w-full"
                  onClick={() => setStartedPlan(plan.name)}
                  data-testid="subscription-start"
                >
                  Start subscription
                </Button>
                {startedPlan === plan.name && (
                  <p
                    role="status"
                    className="mt-3 rounded-md border border-oat bg-oat/50 px-3 py-2 text-sm text-roast"
                    data-testid="subscription-coming-soon"
                  >
                    Subscriptions are coming soon — we&rsquo;ll email you when
                    the {plan.name} plan goes live.
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
