"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        {/* Title */}
        <h1 className="mb-2 text-center font-[family-name:var(--font-cinzel-decorative)] text-3xl font-bold tracking-wide text-sacred-gold">
          Voices of Scripture
        </h1>
        <p className="mb-10 text-center font-[family-name:var(--font-cinzel)] text-sm text-muted-foreground">
          Sign in to continue
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-lg border border-border bg-stone-medium px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-sacred-gold-dim focus:outline-none focus:ring-1 focus:ring-sacred-gold-dim"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-lg border border-border bg-stone-medium px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-sacred-gold-dim focus:outline-none focus:ring-1 focus:ring-sacred-gold-dim"
          />

          {error && (
            <p className="text-center text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg border border-sacred-gold-dim bg-sacred-gold-dim/10 px-4 py-3 font-[family-name:var(--font-cinzel)] text-sm font-semibold tracking-wide text-sacred-gold transition-all hover:bg-sacred-gold-dim/20 disabled:opacity-40"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          No account?{" "}
          <Link
            href="/signup"
            className="text-sacred-gold transition-colors hover:text-sacred-gold-dim"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
