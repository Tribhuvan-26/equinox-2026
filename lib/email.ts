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
/* Account emails: verify address, reset password                      */
/* ------------------------------------------------------------------ */

async function sendAccountEmail(opts: {
  to: string;
  subject: string;
  html: string;
  link: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "Equinox 2026 <registrations@equinox2026.dev>";

  if (!apiKey) {
    // Links are credentials. Only ever print them when developing locally.
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[email] RESEND_API_KEY not set. ${opts.subject} for ${opts.to}: ${opts.link}`);
    } else {
      console.error(`[email] RESEND_API_KEY not set, could not send "${opts.subject}".`);
    }
    return false;
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
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

function accountEmailShell(heading: string, body: string, link: string, cta: string, footer: string): string {
  const href = escapeHtml(link);
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#2A2A2A;">
      <h1 style="color:#2A2A2A;">${escapeHtml(heading)}</h1>
      <p>${body}</p>
      <p style="margin:24px 0;">
        <a href="${href}" style="background:#33FF67;color:#2A2A2A;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">${escapeHtml(cta)}</a>
      </p>
      <p style="font-size:13px;color:#555;">Or paste this link into your browser:<br><span style="word-break:break-all;">${href}</span></p>
      <p style="font-size:13px;color:#555;">${footer}</p>
    </div>
  `;
}

export function sendVerificationEmail(to: string, name: string, link: string): Promise<boolean> {
  return sendAccountEmail({
    to,
    link,
    subject: "Equinox 2026 — verify your email",
    html: accountEmailShell(
      "Verify your email",
      `Hi ${escapeHtml(name)}, confirm this address to start creating or joining teams for Equinox 2026. The link works for 24 hours.`,
      link,
      "Verify email",
      "If you didn't create an account, you can ignore this email."
    ),
  });
}

export function sendPasswordResetEmail(to: string, name: string, link: string): Promise<boolean> {
  return sendAccountEmail({
    to,
    link,
    subject: "Equinox 2026 — reset your password",
    html: accountEmailShell(
      "Reset your password",
      `Hi ${escapeHtml(name)}, we got a request to reset your Equinox 2026 password. The link works for 1 hour and can be used once.`,
      link,
      "Choose a new password",
      "If you didn't ask for this, ignore this email. Your password stays the same."
    ),
  });
}
