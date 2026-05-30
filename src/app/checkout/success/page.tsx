import { ButtonLink } from "@/components/ui/button";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  // Direct visit without an order ref → friendly fallback.
  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-3xl font-semibold text-roast">No recent order</h1>
        <p className="mt-3 text-muted">
          Looks like you reached this page directly. Browse our coffees to start
          an order.
        </p>
        <ButtonLink href="/shop" variant="accent" className="mt-8">
          Shop coffee
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <div
        className="rounded-lg border border-success/30 bg-success/10 px-6 py-8"
        data-testid="confirm-banner"
      >
        <p className="text-4xl">✓</p>
        <h1 className="mt-3 text-3xl font-semibold text-roast">
          Thank you — your order is confirmed.
        </h1>
        <p className="mt-3 text-muted">
          Order{" "}
          <span className="font-semibold text-ink" data-testid="confirm-order-number">
            {order}
          </span>
        </p>
        <p className="mt-2 text-sm text-muted">We&rsquo;ve emailed your receipt.</p>
      </div>

      <div className="mt-8">
        <p className="text-sm text-muted">
          What happens next: we roast your beans fresh and ship within 2 business
          days.
        </p>
        <ButtonLink
          href="/shop"
          variant="accent"
          className="mt-6"
          data-testid="confirm-continue"
        >
          Continue shopping
        </ButtonLink>
      </div>
    </div>
  );
}
