"use client";

import Link from "next/link";
import { useState } from "react";
import { PASSWORD_MIN } from "@/lib/auth/validation";
import { authButton, authCard, authInput, authLabel } from "../login/AuthPageShell";

export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const mismatch = confirm.length > 0 && password !== confirm;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const body = await res.json().catch(() => null);
      if (res.ok) setDone(true);
      else setError(body?.error ?? "Something went wrong.");
    } catch {
      setError("Network error. Check your connection and try again.");
    }
    setLoading(false);
  }

  if (!token) {
    return (
      <div className={authCard}>
        <h1 className="heading text-2xl font-black sm:text-3xl">Link not valid</h1>
        <p className="mt-2 text-sm text-[#F7F2F6]/70">This reset link is incomplete. Request a new one.</p>
        <Link href="/forgot-password" className={`${authButton} block text-center`}>
          Request a new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className={authCard}>
        <h1 className="heading text-2xl font-black sm:text-3xl">Password updated</h1>
        <p role="status" className="mt-2 text-sm text-[#F7F2F6]/70">
          Your password was changed and other devices were signed out. Sign in with the new password.
        </p>
        <Link href="/login" className={`${authButton} block text-center`}>
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className={authCard}>
      <h1 className="heading text-2xl font-black sm:text-3xl">Choose a new password</h1>

      <label htmlFor="reset-password" className={`${authLabel} mt-6`}>
        New password
      </label>
      <input
        id="reset-password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        minLength={PASSWORD_MIN}
        required
        className={authInput}
      />
      <p className="mt-1 text-xs text-[#F7F2F6]/50">At least {PASSWORD_MIN} characters.</p>

      <label htmlFor="reset-confirm" className={`${authLabel} mt-5`}>
        Confirm password
      </label>
      <input
        id="reset-confirm"
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        autoComplete="new-password"
        required
        className={authInput}
      />
      {mismatch && <p className="mt-1 text-sm text-red-400">Passwords do not match.</p>}

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-400">
          {error}{" "}
          <Link href="/forgot-password" className="font-bold underline">
            Request a new link
          </Link>
        </p>
      )}

      <button type="submit" disabled={loading || password.length < PASSWORD_MIN || password !== confirm} className={authButton}>
        {loading ? "Saving…" : "Update password"}
      </button>
    </form>
  );
}
