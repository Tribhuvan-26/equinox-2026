import { after } from "next/server";
import { ApiError, respond } from "@/lib/api";
import { readRegistrationForm } from "@/lib/registration/team-submit";
import { clientIp, overLimit } from "@/lib/security/rate-limit";
import { emailRegistrationLink } from "@/lib/teams/notify";
import { createTeamWithLeader } from "@/lib/teams/service";

export async function POST(request: Request) {
  return respond(async () => {
    // No accounts, so cap submissions per network to keep spam and junk uploads down.
    if (await overLimit([{ key: `team-create:ip:${clientIp(request)}`, max: 10, windowSeconds: 3600 }])) {
      throw new ApiError(429, "Too many registrations from this network. Please try again later.");
    }

    const parsed = await readRegistrationForm(request);
    const { registration, team } = await createTeamWithLeader(parsed, String(parsed.form.get("teamName") ?? ""));

    after(() =>
      emailRegistrationLink({
        to: parsed.participant.email.trim().toLowerCase(),
        name: parsed.participant.name.trim(),
        token: registration.accessToken,
        confirmationNumber: registration.confirmationNumber,
        role: "leader",
        team,
      })
    );

    return {
      confirmationNumber: registration.confirmationNumber,
      teamNumber: registration.teamNumber,
      accessToken: registration.accessToken,
      team: { name: team.name, code: team.code },
    };
  }, 201);
}
