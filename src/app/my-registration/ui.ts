/** Shared styling and the authenticated fetch used across the registration pages. */

export type Result<T> = { ok: true; data: T } | { ok: false; error: string; status: number };

export async function api<T>(token: string, url: string, init?: RequestInit): Promise<Result<T>> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: { Authorization: `Bearer ${token}`, ...(init?.body ? { "Content-Type": "application/json" } : {}) },
    });
    const body = await res.json().catch(() => null);
    if (res.ok) return { ok: true, data: body as T };
    return { ok: false, error: body?.error ?? "Something went wrong.", status: res.status };
  } catch {
    return { ok: false, error: "Network error. Check your connection and try again.", status: 0 };
  }
}

export const card = "rounded-2xl border-2 border-white/20 bg-[#151515]/90 p-5 shadow-[6px_6px_0px_#7484FE] sm:p-8";
export const inputClass =
  "mt-2 w-full rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-[#F7F2F6] outline-none transition focus:border-[#7484FE]";
export const labelClass = "block text-xs font-bold uppercase tracking-wider text-[#F7F2F6]/70";
export const primaryBtn =
  "press inline-flex items-center justify-center gap-2 rounded-xl bg-[#33FF67] px-5 py-3 text-sm font-black text-[#2A2A2A] transition-all hover:bg-[#5aff87] disabled:cursor-not-allowed disabled:opacity-50";
export const secondaryBtn =
  "press inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-[#151515] px-5 py-3 text-sm font-black text-[#F7F2F6] transition-all hover:border-[#33FF67] hover:text-[#33FF67] disabled:cursor-not-allowed disabled:opacity-50";
export const dangerBtn =
  "press inline-flex items-center justify-center gap-2 rounded-xl border-2 border-red-400/60 bg-transparent px-5 py-3 text-sm font-black text-red-300 transition-all hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50";

export const STATUS_STYLE: Record<string, string> = {
  pending: "bg-[#7484FE] text-[#2A2A2A]",
  approved: "bg-[#33FF67] text-[#2A2A2A]",
  rejected: "bg-red-400 text-[#2A2A2A]",
};

/** What a participant is told their status means. The stored value stays `rejected`. */
export const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Not Approved",
};
