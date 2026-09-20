"use client";

import { useState } from "react";
import { MailWarning } from "lucide-react";

export function VerifyEmailBanner({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function resend() {
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/auth/resend-verification", { method: "POST" });
      const body = await res.json().catch(() => null);
      if (res.ok) {
        setState("sent");
        return;
      }
      setError(body?.error ?? "Could not send the email.");
    } catch {
      setError("Network error. Check your connection and try again.");
    }
    setState("idle");
  }

  return (
    <div role="status" className="mb-6 rounded-2xl border-2 border-[#7484FE]/60 bg-[#7484FE]/10 p-4 sm:p-5">
      <p className="flex items-start gap-2 text-sm font-bold">
        <MailWarning className="mt-0.5 h-4 w-4 shrink-0 text-[#7484FE]" />
        <span>
          Verify your email to create or join a team. We sent a link to{" "}
          <span className="break-all text-[#33FF67]">{email}</span>.
        </span>
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          onClick={resend}
          disabled={state !== "idle"}
          className="press rounded-xl border-2 border-white/30 bg-[#151515] px-4 py-2 text-sm font-black text-[#F7F2F6] transition-all hover:border-[#33FF67] hover:text-[#33FF67] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : state === "sent" ? "Email sent" : "Resend email"}
        </button>
        {state === "sent" && <span className="text-sm text-[#F7F2F6]/70">Check your inbox (and spam).</span>}
        {error && (
          <span role="alert" className="text-sm text-red-400">
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
