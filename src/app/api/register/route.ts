import { after } from "next/server";
import { ApiError, respond } from "@/lib/api";
import { readRegistrationForm } from "@/lib/registration/team-submit";
import { clientIp, overLimit } from "@/lib/security/rate-limit";
import { emailRegistrationLink } from "@/lib/teams/notify";
import { registerPaid } from "@/lib/teams/service";

/** Step one: pay for yourself. The team comes afterwards, from /my-registration. */
export async function POST(request: Request) {
  return respond(async () => {
    if (await overLimit([{ key: `register:ip:${clientIp(request)}`, max: 20, windowSeconds: 3600 }])) {
      throw new ApiError(429, "Too many registrations from this network. Please try again later.");
    }

    const parsed = await readRegistrationForm(request);
    const registration = await registerPaid(parsed);

    after(() => {
      if (registration.members && registration.members.length > 0) {
        for (const m of registration.members) {
          emailRegistrationLink({
            to: m.email.trim().toLowerCase(),
            name: m.name.trim(),
            token: m.accessToken,
            confirmationNumber: m.confirmationNumber,
            role: m.role,
            team: registration.team ?? null,
          });
        }
      } else {
        for (const p of parsed.participants) {
          emailRegistrationLink({
            to: p.email.trim().toLowerCase(),
            name: p.name.trim(),
            token: registration.accessToken,
            confirmationNumber: registration.confirmationNumber,
            role: null,
            team: null,
          });
        }
      }
    });

    return {
      confirmationNumber: registration.confirmationNumber,
      accessToken: registration.accessToken,
      team: registration.team ?? null,
    };
  }, 201);
}
