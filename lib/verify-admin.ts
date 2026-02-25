import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionCookie, COOKIE_NAME } from "./admin-session";

export function getAdminPassword(): string | null {
  const adminPanel = process.env.ADMIN_PANEL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminPanel !== "true" || !adminPassword) return null;
  return adminPassword;
}

export async function verifyAdminSession(): Promise<
  { valid: true } | { valid: false; response: NextResponse }
> {
  const adminPassword = getAdminPassword();
  if (!adminPassword) {
    return { valid: false, response: NextResponse.json({ error: "Not found" }, { status: 404 }) };
  }
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  const { valid } = verifySessionCookie(cookie?.value, adminPassword);
  if (!valid) {
    return { valid: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { valid: true };
}
