import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import {
  verifySessionCookie,
  COOKIE_NAME,
} from "@/lib/admin-session";
import InvalidSessionView from "./InvalidSessionView";
import AdminSuccessView from "./AdminSuccessView";

export default async function AdminPage() {
  const adminPanel = process.env.ADMIN_PANEL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminPanel !== "true" || !adminPassword) {
    notFound();
  }

  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  const { valid, exp } = verifySessionCookie(cookie?.value, adminPassword);

  if (valid && exp != null) {
    const remainingSeconds = Math.max(
      0,
      Math.floor((exp - Date.now()) / 1000)
    );
    return <AdminSuccessView sessionSeconds={remainingSeconds} />;
  }

  return <InvalidSessionView />;
}
