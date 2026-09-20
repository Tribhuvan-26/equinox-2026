import { respond } from "@/lib/api";
import { destroyUserSession } from "@/lib/auth/session";

export async function POST() {
  return respond(async () => {
    await destroyUserSession();
    return { ok: true };
  });
}
