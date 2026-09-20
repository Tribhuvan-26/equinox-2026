import "server-only";
import { sendRegistrationLinkEmail } from "@/lib/email";
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
