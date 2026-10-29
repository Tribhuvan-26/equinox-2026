import "server-only";
import type { RegistrationRecord } from "./registration/types";

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

export function mailConfigured(): boolean {
  return Boolean(process.env.BREVO_API_KEY && process.env.BREVO_FROM_EMAIL);
}

/** Replies to a send-only sender land here, so a confused registrant reaches a human. */
function replyTo(): { email: string } {
  return { email: process.env.BREVO_REPLY_TO ?? "cie@mlrinstitutions.ac.in" };
}

/**
 * One transactional send via Brevo's REST API. Never throws; false on failure.
 * Always pass `text`: an HTML-only body is a well-known spam signal.
 */
async function sendMail(to: string, subject: string, html: string, text: string): Promise<boolean> {
  try {
    const res = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY as string,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: {
          email: process.env.BREVO_FROM_EMAIL,
          name: process.env.BREVO_FROM_NAME ?? "Equinox 2.0",
        },
        replyTo: replyTo(),
        to: [{ email: to }],
        subject,
        htmlContent: html,
        textContent: text,
      }),
    });
    if (!res.ok) {
      console.error(`[email] Brevo ${res.status} for ${to}: ${await res.text().catch(() => "")}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] Brevo request threw", err);
    return false;
  }
}

/** The short CNF-XXXXXX people already got by email; older rows may lack one. */
function checkInRef(registration: RegistrationRecord): string {
  return registration.confirmation_number || registration.id;
}

/** `link` is the person's private /my-registration link, when one could be issued. */
export async function sendApprovalEmails(registration: RegistrationRecord, link?: string) {
  const emails = Array.from(new Set(registration.participants.map((p) => p.email)));

  const subject = `Equinox 2026 — Registration Confirmed (${checkInRef(registration)})`;
  const html = renderApprovalEmail(registration, link);
  const text = renderApprovalText(registration, link);

  if (!mailConfigured()) {
    console.warn(
      `[email] BREVO_API_KEY / BREVO_FROM_EMAIL not set — skipping send. Would have emailed ${emails.join(", ")}:\n${subject}`
    );
    return { sent: false as const, recipients: emails };
  }

  const results = await Promise.all(emails.map((to) => sendMail(to, subject, html, text)));
  const failed = emails.filter((_, i) => !results[i]);
  if (failed.length) console.error(`[email] approval send failed for ${failed.join(", ")}`);

  return { sent: failed.length === 0, recipients: emails };
}

function renderApprovalText(registration: RegistrationRecord, link?: string): string {
  const people = registration.participants
    .map((p) => `  - ${p.name} (${p.rollNumber}), ${p.college}, ${p.department}`)
    .join("\n");

  return [
    "Registration Confirmed",
    "",
    "Your Equinox 2.0 registration has been verified and approved.",
    "",
    `Confirmation number: ${checkInRef(registration)}`,
    ...(registration.admin_note
      ? [`Pass: ${registration.admin_note.replace(/^\[(.*)\]$/, "$1")}`]
      : []),
    `Total participants: ${registration.participant_count}`,
    `Amount paid: Rs ${registration.total_amount.toLocaleString("en-IN")}`,
    "",
    "Participants:",
    people,
    ...(link
      ? ["", "Open your registration:", link, "This link is private and replaces any earlier one. Do not forward it."]
      : []),
    "",
    "Keep your confirmation number handy - you will need it at check-in.",
    "See you at Equinox 2.0!",
  ].join("\n");
}

function renderApprovalEmail(registration: RegistrationRecord, link?: string): string {
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
      <p><strong>Confirmation number:</strong> ${escapeHtml(checkInRef(registration))}</p>
      ${
        registration.admin_note
          ? `<p><strong>Pass:</strong> ${escapeHtml(registration.admin_note.replace(/^\[(.*)\]$/, "$1"))}</p>`
          : ""
      }
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
      ${
        link
          ? `<p style="margin:24px 0;">
        <a href="${escapeHtml(link)}" style="background:#33FF67;color:#2A2A2A;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">Open my registration</a>
      </p>
      <p style="font-size:13px;color:#555;">This link is private and replaces any earlier one. Don't forward it.<br>
      <span style="word-break:break-all;">${escapeHtml(link)}</span></p>`
          : ""
      }
      <p style="margin-top:20px;">Keep your confirmation number handy — you'll need it at check-in. See you at Equinox 2026!</p>
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
  const subject = opts.reissued
    ? "Equinox 2026 — your new registration link"
    : "Equinox 2026 — registration received";

  if (!mailConfigured()) {
    // The link is a credential. Only print it when developing locally.
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[email] Brevo not configured. ${subject} for ${opts.to}: ${opts.link}`);
    } else {
      console.error(`[email] Brevo not configured, could not send "${subject}".`);
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

  const text = [
    opts.reissued ? "Your new link" : "Registration received",
    "",
    opts.reissued
      ? `Hi ${opts.name}, here is your new private link. The old one no longer works.`
      : `Hi ${opts.name}, we got your registration and payment proof. The organisers will verify it and email you once it is approved.`,
    "",
    `Confirmation number: ${opts.confirmationNumber}`,
    ...(opts.team
      ? [
          `Team: ${opts.team.name}`,
          `Team code: ${opts.team.code}`,
          `Your role: ${opts.role === "leader" ? "Team leader" : "Member"}`,
          ...(opts.role === "leader"
            ? ["", "Share the team code with your teammates. They join with it and pay their own fee."]
            : []),
        ]
      : []),
    "",
    "Open your registration:",
    opts.link,
    "",
    `This link is private: anyone who has it can see and change your registration${opts.role === "leader" ? " and manage the team" : ""}. Do not forward it.`,
  ].join("\n");

  return sendMail(opts.to, subject, html, text);
}

/* ------------------------------------------------------------------ */
/* Team join requests                                                  */
/* ------------------------------------------------------------------ */

/**
 * One template for every join-request notice. They differ only in wording, so
 * they share a shape rather than four near-identical copies.
 */
export async function sendTeamNoticeEmail(opts: {
  to: string;
  subject: string;
  heading: string;
  lines: string[];
  link: string;
  action: string;
}): Promise<boolean> {
  if (!mailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[email] Brevo not configured. "${opts.subject}" for ${opts.to}`);
    } else {
      console.error(`[email] Brevo not configured, could not send "${opts.subject}".`);
    }
    return false;
  }

  const href = escapeHtml(opts.link);
  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#2A2A2A;">
      <h1 style="color:#2A2A2A;">${escapeHtml(opts.heading)}</h1>
      ${opts.lines.map((l) => `<p>${escapeHtml(l)}</p>`).join("\n      ")}
      <p style="margin:24px 0;">
        <a href="${href}" style="background:#33FF67;color:#2A2A2A;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">${escapeHtml(opts.action)}</a>
      </p>
      <p style="font-size:13px;color:#555;">This link is private. Don't forward it.<br>
      <span style="word-break:break-all;">${href}</span></p>
    </div>`;

  const text = [opts.heading, "", ...opts.lines, "", `${opts.action}:`, opts.link, "", "This link is private. Do not forward it."].join(
    "\n"
  );

  return sendMail(opts.to, opts.subject, html, text);
}
