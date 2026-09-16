"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "Login failed.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#2A2A2A] px-4 text-[#F7F2F6]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#2A2A2A]/90 p-8 shadow-xl"
      >
        <h1 className="heading text-2xl font-black">Admin Access</h1>
        <p className="mt-2 text-sm text-[#F7F2F6]/70">
          Sign in to review Equinox 2026 registrations.
        </p>

        <label className="mt-6 block text-xs font-bold uppercase tracking-wider text-[#F7F2F6]/70">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          required
          className="mt-2 w-full rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-[#F7F2F6] outline-none focus:border-[#7484FE]"
        />

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading || !password}
          className="mt-6 w-full rounded-xl bg-[#33FF67] px-5 py-3 font-black text-[#2A2A2A] transition-all hover:bg-[#5aff87] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
