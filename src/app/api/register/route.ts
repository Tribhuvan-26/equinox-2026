import { after } from "next/server";
import { ApiError, respond } from "@/lib/api";
import { readRegistrationForm } from "@/lib/registration/team-submit";
import { clientIp, overLimit } from "@/lib/security/rate-limit";
import { emailRegistrationLink } from "@/lib/teams/notify";
import { registerPaid } from "@/lib/teams/service";

/** Pay for yourself (team picked later from /my-registration) or for a whole team at once. */
export async function POST(request: Request) {
  return respond(async () => {
    if (await overLimit([{ key: `register:ip:${clientIp(request)}`, max: 20, windowSeconds: 3600 }])) {
      throw new ApiError(429, "Too many registrations from this network. Please try again later.");
    }

    const parsed = await readRegistrationForm(request);
    const registration = await registerPaid(parsed);

    // Return the promise so the function stays alive until every email is sent.
    const recipients = registration.members ?? [
      {
        email: parsed.participants[0].email.trim().toLowerCase(),
        name: parsed.participants[0].name.trim(),
        accessToken: registration.accessToken,
        confirmationNumber: registration.confirmationNumber,
        role: null,
      },
    ];
    after(() =>
      Promise.all(
        recipients.map((m) =>
          emailRegistrationLink({
            to: m.email,
            name: m.name,
            token: m.accessToken,
            confirmationNumber: m.confirmationNumber,
            role: m.role,
            team: registration.team ?? null,
          })
        )
      )
    );

    return {
      confirmationNumber: registration.confirmationNumber,
      accessToken: registration.accessToken,
      team: registration.team ?? null,
    };
  }, 201);
}
