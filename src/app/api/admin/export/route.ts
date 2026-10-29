import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { supabaseAdmin, type RegistrationRow } from "@/lib/supabase/admin";
import { PASS_OPTIONS, passTypeOf } from "@/lib/registration/constants";
import { formatTeamNumber } from "@/lib/registration/team-number";

export const dynamic = "force-dynamic";

// Supabase caps one request at 1000 rows, so read in pages until a short one.
const PAGE = 1000;

const HEADERS = [
  "Pass",
  "Team",
  "Team Code",
  "Role",
  "Reg No",
  "Confirmation",
  "Status",
  "Name",
  "Roll Number",
  "College",
  "Department",
  "Mobile",
  "Email",
  "UTR",
  "Amount",
  "Submitted",
  "Requested Team",
  "Admin Note",
];

/** Quote for CSV, and stop Excel from running a cell that starts like a formula. */
function cell(value: unknown): string {
  let s = value == null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = supabaseAdmin();

  const rows: RegistrationRow[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("pass_registrations")
      .select("*")
      .order("created_at", { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) {
      console.error("[admin] export", error);
      return NextResponse.json({ error: "Could not load registrations." }, { status: 500 });
    }
    rows.push(...((data ?? []) as RegistrationRow[]));
    if ((data ?? []).length < PAGE) break;
  }

  const { data: teams, error: teamError } = await supabase.from("registration_teams").select("id, name, code");
  if (teamError) {
    console.error("[admin] export teams", teamError);
    return NextResponse.json({ error: "Could not load teams." }, { status: 500 });
  }
  const teamById = new Map((teams ?? []).map((t) => [t.id, t]));
  const teamName = (id: string | null) => (id ? (teamById.get(id)?.name ?? "") : "");

  // Premium Pass rows, then Entertainment Pass rows. Within each: by team name
  // (people with no team last), then leader first, then who came first.
  const sorted = [...rows].sort((a, b) => {
    const pa = passTypeOf(a);
    const pb = passTypeOf(b);
    if (pa !== pb) return pa === "premium" ? -1 : 1;
    const ta = teamName(a.team_id);
    const tb = teamName(b.team_id);
    if (!ta !== !tb) return ta ? -1 : 1;
    const byTeam = ta.localeCompare(tb, "en", { sensitivity: "base" });
    if (byTeam !== 0) return byTeam;
    if (a.team_role !== b.team_role) return a.team_role === "leader" ? -1 : b.team_role === "leader" ? 1 : 0;
    return +new Date(a.created_at) - +new Date(b.created_at);
  });

  const lines = [HEADERS.map(cell).join(",")];
  for (const r of sorted) {
    const p = r.participants[0];
    lines.push(
      [
        PASS_OPTIONS[passTypeOf(r)].name,
        teamName(r.team_id),
        r.team_id ? teamById.get(r.team_id)?.code : "",
        r.team_role ?? "",
        formatTeamNumber(r.team_seq),
        r.confirmation_number,
        r.status,
        p?.name,
        p?.rollNumber,
        p?.college,
        p?.department,
        p?.mobile,
        p?.email,
        r.utr_number,
        r.total_amount,
        new Date(r.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        teamName(r.requested_team_id),
        r.admin_note,
      ]
        .map(cell)
        .join(",")
    );
  }

  const date = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  // The BOM makes Excel read the file as UTF-8, so names with accents survive.
  return new Response(`﻿${lines.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="equinox-registrations-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
