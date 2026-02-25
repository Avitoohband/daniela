"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSuccessView({
  sessionSeconds,
}: {
  sessionSeconds: number;
}) {
  const router = useRouter();
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
    <div
      className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-6 text-center"
      dir="rtl"
    >
      <h1 className="text-2xl font-bold text-gray-800">
        התחברת בהצלחה
      </h1>
      <p className="text-gray-600">
        You logged in successfully.
      </p>
      {sessionSeconds > 0 && remaining > 0 && (
        <p className="text-sm text-gray-500">
          הפג תוקף בעוד {remaining} שניות
        </p>
      )}
      <button
        type="button"
        onClick={handleLogout}
        className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-700"
      >
        התנתק
      </button>
    </div>
  );
}
