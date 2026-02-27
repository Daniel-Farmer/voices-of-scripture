"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-1.5 font-[family-name:var(--font-inter)] text-xs text-muted-foreground transition-colors hover:text-foreground"
      title="Sign out"
    >
      <LogOut className="h-3.5 w-3.5" />
      <span>Sign out</span>
    </button>
  );
}
