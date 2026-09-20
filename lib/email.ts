import "server-only";
import { Resend } from "resend";
import type { RegistrationRecord } from "./registration/types";

export async function sendApprovalEmails(registration: RegistrationRecord) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "Equinox 2026 <registrations@equinox2026.dev>";
  const emails = Array.from(new Set(registration.participants.map((p) => p.email)));

  const subject = `Equinox 2026 — Registration Confirmed (${registration.id})`;
  const html = renderApprovalEmail(registration);

  if (!apiKey) {
    console.warn(
      `[email] RESEND_API_KEY not set — skipping send. Would have emailed ${emails.join(", ")}:\n${subject}`
    );
    return { sent: false as const, recipients: emails };
  }

  const resend = new Resend(apiKey);
  await Promise.all(
    emails.map((to) => resend.emails.send({ from, to, subject, html }))
  );

  return { sent: true as const, recipients: emails };
}

function renderApprovalEmail(registration: RegistrationRecord): string {
  const rows = registration.participants
    .map(
      (p) =>
        `<tr><td style="padding:6px 10px;border:1px solid #ddd;">${escapeHtml(p.name)}</td><td style="padding:6px 10px;border:1px solid #ddd;">${escapeHtml(p.rollNumber)}</td><td style="padding:6px 10px;border:1px solid #ddd;">${escapeHtml(p.college)}</td><td style="padding:6px 10px;border:1px solid #ddd;">${escapeHtml(p.department)}</td></tr>`
    )
    .join("");

  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
      <h1 style="color:#2A2A2A;">Registration Confirmed 🎉</h1>
      <p>Your Equinox 2026 registration has been verified and approved.</p>
      <p><strong>Registration ID:</strong> ${escapeHtml(registration.id)}</p>
      <p><strong>Total participants:</strong> ${registration.participant_count}</p>
      <p><strong>Amount paid:</strong> ₹${registration.total_amount.toLocaleString("en-IN")}</p>
      <table style="border-collapse:collapse;width:100%;margin-top:12px;">
        <thead>
          <tr>
            <th style="padding:6px 10px;border:1px solid #ddd;text-align:left;">Name</th>
            <th style="padding:6px 10px;border:1px solid #ddd;text-align:left;">Roll No.</th>
            <th style="padding:6px 10px;border:1px solid #ddd;text-align:left;">College</th>
            <th style="padding:6px 10px;border:1px solid #ddd;text-align:left;">Department</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="margin-top:20px;">Keep your registration ID handy — you'll need it at check-in. See you at Equinox 2026!</p>
    </div>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ------------------------------------------------------------------ */
/* Team registration: the person's private link                        */
/* ------------------------------------------------------------------ */

export async function sendRegistrationLinkEmail(opts: {
  to: string;
  name: string;
  link: string;
  confirmationNumber: string;
  role: "leader" | "member" | null;
  team: { name: string; code: string } | null;
  /** True when the link was re-issued because the old one was lost. */
  reissued?: boolean;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "Equinox 2026 <registrations@equinox2026.dev>";
  const subject = opts.reissued
    ? "Equinox 2026 — your new registration link"
    : "Equinox 2026 — registration received";

  if (!apiKey) {
    // The link is a credential. Only print it when developing locally.
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[email] RESEND_API_KEY not set. ${subject} for ${opts.to}: ${opts.link}`);
    } else {
      console.error(`[email] RESEND_API_KEY not set, could not send "${subject}".`);
    }
    return false;
  }

  const href = escapeHtml(opts.link);
  const teamBlock = opts.team
    ? `<p><strong>Team:</strong> ${escapeHtml(opts.team.name)}<br>
       <strong>Team code:</strong> <span style="font-family:monospace;font-size:18px;letter-spacing:2px;">${escapeHtml(opts.team.code)}</span><br>
       <strong>Your role:</strong> ${opts.role === "leader" ? "Team leader" : "Member"}</p>
       ${opts.role === "leader" ? "<p>Share the team code with your teammates. They join with it and pay their own fee.</p>" : ""}`
    : "";

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#2A2A2A;">
      <h1 style="color:#2A2A2A;">${opts.reissued ? "Your new link" : "Registration received"}</h1>
      <p>Hi ${escapeHtml(opts.name)}, ${opts.reissued ? "here is your new private link. The old one no longer works." : "we got your registration and payment proof. The organisers will verify it and email you once it is approved."}</p>
      <p><strong>Confirmation number:</strong> ${escapeHtml(opts.confirmationNumber)}</p>
      ${teamBlock}
      <p style="margin:24px 0;">
        <a href="${href}" style="background:#33FF67;color:#2A2A2A;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">Open my registration</a>
      </p>
      <p style="font-size:13px;color:#555;">This link is private: anyone who has it can see and change your registration${opts.role === "leader" ? " and manage the team" : ""}. Don't forward it.<br>
      <span style="word-break:break-all;">${href}</span></p>
    </div>`;

  try {
    const { error } = await new Resend(apiKey).emails.send({ from, to: opts.to, subject, html });
    if (error) {
      console.error("[email] send failed", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] send threw", err);
    return false;
  }
}
