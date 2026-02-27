"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
        <div className="w-full max-w-sm text-center">
          <h1 className="mb-4 font-[family-name:var(--font-cinzel-decorative)] text-2xl font-bold text-sacred-gold">
            Check your email
          </h1>
          <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
            We sent a confirmation link to <strong className="text-foreground">{email}</strong>.
            Click the link to activate your account.
          </p>
          <Link
            href="/login"
            className="rounded-lg border border-sacred-gold-dim px-6 py-2.5 font-[family-name:var(--font-cinzel)] text-sm tracking-wide text-sacred-gold transition-all hover:bg-sacred-gold-dim/10"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        {/* Title */}
        <h1 className="mb-2 text-center font-[family-name:var(--font-cinzel-decorative)] text-3xl font-bold tracking-wide text-sacred-gold">
          Voices of Scripture
        </h1>
        <p className="mb-10 text-center font-[family-name:var(--font-cinzel)] text-sm text-muted-foreground">
          Create your account
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
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-sacred-gold transition-colors hover:text-sacred-gold-dim"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
