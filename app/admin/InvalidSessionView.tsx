"use client";

import React, { useEffect, useState } from "react";
import AdminLoginForm from "./AdminLoginForm";

export default function InvalidSessionView() {
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    fetch("/api/admin/logout", { method: "POST" }).finally(() =>
      setCleared(true)
    );
  }, []);

  if (!cleared) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center text-gray-600">
        נא להמתין...
      </div>
    );
  }
  return <AdminLoginForm />;
}
