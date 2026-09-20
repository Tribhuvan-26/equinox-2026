"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={signOut}
      disabled={busy}
      className="press inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-[#151515] px-4 py-2 font-mono text-xs font-black uppercase tracking-wider text-[#F7F2F6] transition-all hover:border-red-400 hover:text-red-300 disabled:opacity-50"
    >
      <LogOut className="h-4 w-4" />
      <span>{busy ? "Signing out…" : "Sign out"}</span>
    </button>
  );
}
