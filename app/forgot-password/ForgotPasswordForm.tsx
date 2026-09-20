"use client";

import Link from "next/link";
import { useState } from "react";
import { authButton, authCard, authInput, authLabel } from "../login/AuthPageShell";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = await res.json().catch(() => null);
      if (res.ok) setDone(body?.message ?? "Check your email for a reset link.");
      else setError(body?.error ?? "Something went wrong.");
    } catch {
      setError("Network error. Check your connection and try again.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={submit} noValidate className={authCard}>
      <h1 className="heading text-2xl font-black sm:text-3xl">Forgot password?</h1>
      <p className="mt-2 text-sm text-[#F7F2F6]/70">Enter your email and we&apos;ll send you a link to choose a new one.</p>

      {done ? (
        <p role="status" className="mt-6 rounded-xl border border-[#33FF67]/50 bg-[#33FF67]/10 p-4 text-sm text-[#F7F2F6]">
          {done}
        </p>
      ) : (
        <>
          <label htmlFor="forgot-email" className={`${authLabel} mt-6`}>
            Email
          </label>
          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className={authInput}
          />
          {error && (
            <p role="alert" className="mt-3 text-sm text-red-400">
              {error}
            </p>
          )}
          <button type="submit" disabled={loading || !email} className={authButton}>
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </>
      )}

      <p className="mt-5 text-center text-sm text-[#F7F2F6]/70">
        <Link href="/login" className="font-bold text-[#33FF67] hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
