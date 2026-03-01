"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const MENU_ITEMS = [
  { href: "/admin/requests", label: "פניות שירות" },
  { href: "/admin/content", label: "ניהול תוכן אתר" },
] as const;

export default function AdminShell({
  children,
  sessionSeconds,
}: {
  children: React.ReactNode;
  sessionSeconds: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [remaining, setRemaining] = useState(sessionSeconds);

  useEffect(() => {
    if (sessionSeconds <= 0) return;
    const end = Date.now() + remaining * 1000;
    const t = setInterval(() => {
      const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) {
        clearInterval(t);
        fetch("/api/admin/logout", { method: "POST" }).finally(() => {
          router.refresh();
          router.push("/admin");
        });
      }
    }, 1000);
    return () => clearInterval(t);
  }, [sessionSeconds, router]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
    router.push("/admin");
  }

  return (
    <div className="min-h-screen bg-gray-100 w-full" dir="rtl">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <nav className="flex items-center gap-1 sm:gap-2">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            {sessionSeconds > 0 && remaining > 0 && (
              <span className="text-xs sm:text-sm text-gray-500">
                הפג תוקף בעוד {remaining} שניות
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 sm:px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm sm:text-base"
            >
              התנתק
            </button>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
