"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PASSWORD_MIN } from "@/lib/auth/validation";

type Mode = "login" | "signup";

const COPY = {
  login: {
    title: "Welcome back",
    blurb: "Sign in to create or join your Equinox team.",
    submit: "Sign in",
    busy: "Signing in…",
    switchText: "New here?",
    switchLink: "Create an account",
    switchHref: "/signup",
  },
  signup: {
    title: "Create your account",
    blurb: "One account for your team across all Equinox events.",
    submit: "Create account",
    busy: "Creating account…",
    switchText: "Already have an account?",
    switchLink: "Sign in",
    switchHref: "/login",
  },
} as const;

const inputClass =
  "mt-2 w-full rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-[#F7F2F6] outline-none transition focus:border-[#7484FE]";
const labelClass = "block text-xs font-bold uppercase tracking-wider text-[#F7F2F6]/70";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const copy = COPY[mode];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<{ message: string; field?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "signup" ? { name, email, password } : { email, password }),
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
        return;
      }
      const body = await res.json().catch(() => null);
      setError({ message: body?.error ?? "Something went wrong.", field: body?.field });
    } catch {
      setError({ message: "Network error. Check your connection and try again." });
    }
    setLoading(false);
  }

  const fieldError = (field: string) => (error?.field === field ? error.message : null);

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full max-w-md rounded-2xl border-2 border-white/20 bg-[#151515]/90 p-6 text-left shadow-[6px_6px_0px_#7484FE] sm:p-8"
    >
      <h1 className="heading text-2xl font-black sm:text-3xl">{copy.title}</h1>
      <p className="mt-2 text-sm text-[#F7F2F6]/70">{copy.blurb}</p>

      {mode === "signup" && (
        <div className="mt-6">
          <label htmlFor="auth-name" className={labelClass}>
            Full name
          </label>
          <input
            id="auth-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            maxLength={80}
            required
            className={inputClass}
          />
          {fieldError("name") && <p className="mt-1 text-sm text-red-400">{fieldError("name")}</p>}
        </div>
      )}

      <div className="mt-5">
        <label htmlFor="auth-email" className={labelClass}>
          Email
        </label>
        <input
          id="auth-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          className={inputClass}
        />
        {fieldError("email") && <p className="mt-1 text-sm text-red-400">{fieldError("email")}</p>}
      </div>

      <div className="mt-5">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor="auth-password" className={labelClass}>
            Password
          </label>
          {mode === "login" && (
            <Link href="/forgot-password" className="text-xs font-bold text-[#33FF67] hover:underline">
              Forgot password?
            </Link>
          )}
        </div>
        <input
          id="auth-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          minLength={mode === "signup" ? PASSWORD_MIN : undefined}
          required
          className={inputClass}
        />
        {mode === "signup" && (
          <p className="mt-1 text-xs text-[#F7F2F6]/50">At least {PASSWORD_MIN} characters.</p>
        )}
        {fieldError("password") && <p className="mt-1 text-sm text-red-400">{fieldError("password")}</p>}
      </div>

      {error && !error.field && (
        <p role="alert" className="mt-4 text-sm text-red-400">
          {error.message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !email || !password || (mode === "signup" && !name)}
        className="press mt-6 w-full rounded-xl bg-[#33FF67] px-5 py-3 font-black text-[#2A2A2A] transition-all hover:bg-[#5aff87] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? copy.busy : copy.submit}
      </button>

      <p className="mt-5 text-center text-sm text-[#F7F2F6]/70">
        {copy.switchText}{" "}
        <Link href={copy.switchHref} className="font-bold text-[#33FF67] hover:underline">
          {copy.switchLink}
        </Link>
      </p>
    </form>
  );
}
