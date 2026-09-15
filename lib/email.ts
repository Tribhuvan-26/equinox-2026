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
