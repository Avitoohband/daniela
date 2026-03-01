import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import {
  verifySessionCookie,
  COOKIE_NAME,
} from "@/lib/admin-session";
import { redirect } from "next/navigation";
import AdminShell from "../AdminShell";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminPanel = process.env.ADMIN_PANEL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminPanel !== "true" || !adminPassword) {
    notFound();
  }

  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  const { valid, exp } = verifySessionCookie(cookie?.value, adminPassword);

  if (!valid || exp == null) {
    redirect("/admin");
  }

  const remainingSeconds = Math.max(
    0,
    Math.floor((exp - Date.now()) / 1000)
  );

  return (
    <AdminShell sessionSeconds={remainingSeconds}>
      {children}
    </AdminShell>
  );
}
