import { after } from "next/server";
import { ApiError, readJson, respond, str } from "@/lib/api";
import { isValidEmail } from "@/lib/registration/validation";
import { clientIp, overLimit } from "@/lib/security/rate-limit";
import { emailRegistrationLink } from "@/lib/teams/notify";
import { rotateAccessToken } from "@/lib/teams/service";

// Same answer whether or not a registration matched, so this can't be used to
// find out who has registered.
const GENERIC = {
  message: "If those details match a registration, we've emailed a new private link to that address.",
};

export async function POST(request: Request) {
  return respond(async () => {
    const body = await readJson(request);
    const email = str(body.email).trim().toLowerCase();
    const confirmation = str(body.confirmationNumber).trim().toUpperCase();
    if (!isValidEmail(email)) throw new ApiError(400, "Enter the email you registered with.", "email");
    if (!/^CNF-[A-Z0-9]{6}$/.test(confirmation)) {
      throw new ApiError(400, "Enter your confirmation number, like CNF-1A2B3C.", "confirmationNumber");
    }

    if (
      await overLimit([
        { key: `access:ip:${clientIp(request)}`, max: 10, windowSeconds: 3600 },
        { key: `access:email:${email}`, max: 3, windowSeconds: 3600 },
      ])
    ) {
      throw new ApiError(429, "Too many requests. Please try again in an hour.");
    }

    // Lookup, token change and mail all happen after the response, so timing
    // doesn't reveal whether the registration exists.
    after(async () => {
      try {
        const access = await rotateAccessToken(email, confirmation);
        if (!access) return;
        await emailRegistrationLink({
          to: access.email,
          name: access.name,
          token: access.token,
          confirmationNumber: access.confirmationNumber,
          role: access.role,
          team: access.team,
          reissued: true,
        });
      } catch (err) {
        console.error("[registration-access] failed", err);
      }
    });

    return GENERIC;
  });
}
