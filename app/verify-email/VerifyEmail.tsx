"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { authButton, authCard } from "../login/AuthPageShell";

type State = { kind: "working" } | { kind: "ok" } | { kind: "error"; message: string };

// The token is spent by a POST from the browser, not by loading the page, so
// mail scanners that pre-fetch links can't use it up.
export function VerifyEmail({ token }: { token: string }) {
  const [state, setState] = useState<State>(token ? { kind: "working" } : { kind: "error", message: "This verification link is incomplete." });
  const started = useRef(false);

  useEffect(() => {
    if (!token || started.current) return;
    started.current = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const body = await res.json().catch(() => null);
        setState(res.ok ? { kind: "ok" } : { kind: "error", message: body?.error ?? "Could not verify your email." });
      } catch {
        setState({ kind: "error", message: "Network error. Check your connection and try again." });
      }
    })();
  }, [token]);

  return (
    <div className={authCard}>
      {state.kind === "working" && (
        <>
          <h1 className="heading text-2xl font-black sm:text-3xl">Verifying…</h1>
          <p className="mt-2 text-sm text-[#F7F2F6]/70">One moment while we confirm your email.</p>
        </>
      )}
      {state.kind === "ok" && (
        <>
          <h1 className="heading text-2xl font-black sm:text-3xl">Email verified</h1>
          <p role="status" className="mt-2 text-sm text-[#F7F2F6]/70">
            You can now create or join a team.
          </p>
          <Link href="/dashboard" className={`${authButton} block text-center`}>
            Go to dashboard
          </Link>
        </>
      )}
      {state.kind === "error" && (
        <>
          <h1 className="heading text-2xl font-black sm:text-3xl">Could not verify</h1>
          <p role="alert" className="mt-2 text-sm text-red-400">
            {state.message}
          </p>
          <Link href="/dashboard" className={`${authButton} block text-center`}>
            Go to dashboard
          </Link>
        </>
      )}
    </div>
  );
}
