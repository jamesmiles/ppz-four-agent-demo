import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Our Roastery" };

export default function AboutPage() {
  return (
    <div data-testid="page-about">
      <section className="bg-roast text-cream">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h1 className="text-4xl font-semibold">Our Roastery</h1>
          <p className="mt-4 max-w-xl text-cream/80">
            {site.name} began with a simple idea: great coffee, honestly sourced
            and roasted with care.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-2xl font-semibold text-roast">Our story</h2>
        <p className="mt-4 text-ink/80">
          We started roasting in a small unit on the north wind side of town,
          chasing the perfect balance of sweetness and clarity. Today we work
          directly with growers, pay fairly, and roast in small batches so every
          bag ships fresh.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            ["Source", "Direct-trade relationships with growers we visit and trust."],
            ["Roast", "Small batches, dialled in on sample roasts before every run."],
            ["Cup", "We taste every batch before it ships — no exceptions."],
          ].map(([t, b]) => (
            <div key={t} className="rounded-lg border border-oat bg-cream p-6">
              <h3 className="font-medium text-roast">{t}</h3>
              <p className="mt-2 text-sm text-muted">{b}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <ButtonLink href="/shop" variant="accent">
            Shop our coffee
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
