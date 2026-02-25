import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSessionCookie, COOKIE_NAME } from "@/lib/admin-session";

export async function POST(request: Request) {
  const adminPanel = process.env.ADMIN_PANEL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSeconds = process.env.ADMIN_SESSION_SECONDS;

  if (adminPanel !== "true" || !adminPassword) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const sec = sessionSeconds ? parseInt(sessionSeconds, 10) : 3600;
  const maxAge = Number.isFinite(sec) && sec > 0 ? sec : 3600;

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }

  const password =
    typeof body.password === "string" ? body.password : "";
  if (password !== adminPassword) {
    return NextResponse.json(
      { error: "Invalid password" },
      { status: 401 }
    );
  }

  const expiresAtMs = Date.now() + maxAge * 1000;
  const value = createSessionCookie(expiresAtMs, adminPassword);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, value, {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return NextResponse.json({ success: true });
}
