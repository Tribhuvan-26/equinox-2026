import "server-only";
import { sendRegistrationLinkEmail, sendTeamNoticeEmail } from "@/lib/email";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { siteUrl } from "@/lib/security/site-url";

/** Email the person their private link. Never throws: it runs after the response. */
export async function emailRegistrationLink(opts: {
  to: string;
  name: string;
  token: string;
  confirmationNumber: string;
  role: "leader" | "member" | null;
  team: { name: string; code: string } | null;
  reissued?: boolean;
}): Promise<void> {
  try {
    const base = siteUrl();
    if (!base) {
      console.error("[teams] SITE_URL is not set, cannot email the registration link.");
      return;
    }
    // The token sits in the URL fragment: browsers never send it to servers,
    // proxies or Referer headers. The page reads it client-side.
    await sendRegistrationLinkEmail({
      to: opts.to,
      name: opts.name,
      link: `${base}/my-registration#token=${opts.token}`,
      confirmationNumber: opts.confirmationNumber,
      role: opts.role,
      team: opts.team,
      reissued: opts.reissued,
    });
  } catch (err) {
    console.error("[teams] emailRegistrationLink failed", err);
  }
}

/** Who leads this team, for notices addressed to them. */
async function teamLeader(teamId: string): Promise<{ to: string; name: string } | null> {
  const { data } = await supabaseAdmin()
    .from("pass_registrations")
    .select("participants, member_email")
    .eq("team_id", teamId)
    .eq("team_role", "leader")
    .maybeSingle();
  if (!data?.member_email) return null;
  return { to: data.member_email, name: data.participants[0]?.name ?? "there" };
}

/** Tell the leader somebody is waiting on them. Never throws. */
export async function emailJoinRequested(opts: {
  team: { id: string; name: string };
  applicant: { participants: { name: string }[] };
}): Promise<void> {
  try {
    const base = siteUrl();
    if (!base) return;
    const leader = await teamLeader(opts.team.id);
    if (!leader) return;
    const who = opts.applicant.participants[0]?.name ?? "Someone";

    await sendTeamNoticeEmail({
      to: leader.to,
      subject: `Equinox 2026 — ${who} wants to join ${opts.team.name}`,
      heading: "Someone wants to join your team",
      lines: [
        `Hi ${leader.name}, ${who} has paid their registration and asked to join ${opts.team.name}.`,
        "Open your registration to accept or decline. The seat is only taken once you accept.",
      ],
      link: `${base}/my-registration`,
      action: "Review the request",
    });
  } catch (err) {
    console.error("[teams] emailJoinRequested failed", err);
  }
}

/** Tell the applicant the answer, and anyone the team filled up under. */
export async function emailJoinDecision(decided: {
  team: { name: string };
  accepted: boolean;
  person: { name: string; email: string };
  crowdedOut: { name: string; email: string }[];
}): Promise<void> {
  const base = siteUrl();
  if (!base) return;
  const link = `${base}/my-registration`;

  try {
    if (decided.person.email) {
      await sendTeamNoticeEmail({
        to: decided.person.email,
        subject: decided.accepted
          ? `Equinox 2026 — you're in ${decided.team.name}`
          : `Equinox 2026 — ${decided.team.name} could not take you`,
        heading: decided.accepted ? `Welcome to ${decided.team.name}` : "That team didn't work out",
        lines: decided.accepted
          ? [`Hi ${decided.person.name}, the leader of ${decided.team.name} accepted your request. You're on the team.`]
          : [
              `Hi ${decided.person.name}, the leader of ${decided.team.name} declined your request.`,
              "Your registration and payment stay valid. You can ask another team, or start your own.",
            ],
        link,
        action: "Open my registration",
      });
    }
  } catch (err) {
    console.error("[teams] emailJoinDecision failed", err);
  }

  for (const person of decided.crowdedOut) {
    if (!person.email) continue;
    try {
      await sendTeamNoticeEmail({
        to: person.email,
        subject: `Equinox 2026 — ${decided.team.name} is now full`,
        heading: "That team just filled up",
        lines: [
          `Hi ${person.name}, ${decided.team.name} took its last member, so your request has been withdrawn.`,
          "Your registration and payment stay valid. You can ask another team, or start your own.",
        ],
        link,
        action: "Find another team",
      });
    } catch (err) {
      console.error("[teams] crowded-out email failed", err);
    }
  }
}
