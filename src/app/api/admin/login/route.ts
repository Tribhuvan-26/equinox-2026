import { NextResponse } from "next/server";
import { checkAdminPassword, createAdminSession } from "@/lib/admin/session";
import { clientIp, overLimit } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  // One shared password and no account lockout, so cap guesses per network.
  if (await overLimit([{ key: `admin-login:ip:${clientIp(request)}`, max: 10, windowSeconds: 900 }])) {
    return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!password || !checkAdminPassword(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
