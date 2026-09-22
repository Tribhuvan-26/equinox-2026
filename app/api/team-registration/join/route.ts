import { after } from "next/server";
import { ApiError, requireUuid, respond } from "@/lib/api";
import { readRegistrationForm } from "@/lib/registration/team-submit";
import { clientIp, overLimit } from "@/lib/security/rate-limit";
import { emailRegistrationLink } from "@/lib/teams/notify";
import { joinTeamWithRegistration } from "@/lib/teams/service";

export async function POST(request: Request) {
  return respond(async () => {
    if (await overLimit([{ key: `team-join:ip:${clientIp(request)}`, max: 20, windowSeconds: 3600 }])) {
      throw new ApiError(429, "Too many registrations from this network. Please try again later.");
    }

    const parsed = await readRegistrationForm(request);
    const teamId = requireUuid(String(parsed.form.get("teamId") ?? ""), "team id");
    const { registration, team } = await joinTeamWithRegistration(parsed, teamId);

    after(() =>
      emailRegistrationLink({
        to: parsed.participant.email.trim().toLowerCase(),
        name: parsed.participant.name.trim(),
        token: registration.accessToken,
        confirmationNumber: registration.confirmationNumber,
        role: "member",
        team,
      })
    );

    return {
      confirmationNumber: registration.confirmationNumber,
      accessToken: registration.accessToken,
      team: { name: team.name },
    };
  }, 201);
}
