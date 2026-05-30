import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div
      className="mx-auto flex max-w-6xl flex-col items-center px-4 py-28 text-center"
      data-testid="not-found"
    >
      <p className="text-sm uppercase tracking-widest text-amber">404</p>
      <h1 className="mt-3 text-3xl font-semibold text-roast">
        This page has gone cold.
      </h1>
      <p className="mt-3 max-w-md text-muted">
        We couldn&rsquo;t find what you were looking for. Let&rsquo;s get you
        back to something fresh.
      </p>
      <ButtonLink href="/" variant="accent" className="mt-8">
        Back to home
      </ButtonLink>
    </div>
  );
}
