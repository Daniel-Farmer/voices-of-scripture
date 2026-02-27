import Link from "next/link";

export default function CharacterNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <h1 className="font-[family-name:var(--font-cinzel-decorative)] text-3xl text-sacred-gold">
        Figure Not Found
      </h1>
      <p className="max-w-md text-muted-foreground">
        The figure you seek is not among those gathered here. Perhaps their
        story is told in another scroll, or their name has been lost to time.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-lg border border-sacred-gold-dim px-6 py-2.5 font-[family-name:var(--font-cinzel)] text-sm tracking-wide text-sacred-gold transition-all hover:bg-sacred-gold-dim/10"
      >
        Return
      </Link>
    </div>
  );
}
