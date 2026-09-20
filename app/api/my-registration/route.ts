import { bearerToken, respond } from "@/lib/api";
import { authenticate, getMyRegistration } from "@/lib/teams/service";

export async function GET(request: Request) {
  return respond(async () => getMyRegistration(await authenticate(bearerToken(request))));
}
