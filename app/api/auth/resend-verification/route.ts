import { after } from "next/server";
import { ApiError, requireUser, respond } from "@/lib/api";
import { clientIp, overLimit } from "@/lib/auth/rate-limit";
import { sendVerificationLink } from "@/lib/auth/verification";

export async function POST(request: Request) {
  return respond(async () => {
    const user = await requireUser();
    if (user.emailVerified) return { alreadyVerified: true };

    if (
      await overLimit([
        { key: `resend:user:${user.id}`, max: 3, windowSeconds: 3600 },
        { key: `resend:ip:${clientIp(request)}`, max: 10, windowSeconds: 3600 },
      ])
    ) {
      throw new ApiError(429, "Too many emails requested. Please try again in a while.");
    }

    after(() => sendVerificationLink(user));
    return { sent: true };
  });
}
