"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ServiceRequestStatus = "pending" | "addressed" | "not_relevant";

interface ServiceRequestRow {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: ServiceRequestStatus;
  addressedBy: string;
  agreedPrice: string;
  agreedTime: string;
  notes: string;
  createdAt: string;
  addressedAt: string | null;
}

function StatusIcon({ status }: { status: ServiceRequestStatus }) {
  if (status === "pending") {
    return (
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "#fbbf24" }}
        title="ממתין"
      >
        <svg className="w-4 h-4 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    );
  }
  if (status === "addressed") {
    return (
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "#22c55e" }}
        title="טופל"
      >
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: "#ef4444" }}
      title="לא רלוונטי"
    >
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  );
}

function EditModal({
  request,
  onClose,
  onSave,
}: {
  request: ServiceRequestRow;
  onClose: () => void;
  onSave: (data: Partial<ServiceRequestRow>) => Promise<void>;
}) {
  const [status, setStatus] = useState<ServiceRequestStatus>(request.status);
  const [addressedBy, setAddressedBy] = useState(request.addressedBy);
  const [agreedPrice, setAgreedPrice] = useState(request.agreedPrice);
  const [agreedTime, setAgreedTime] = useState(request.agreedTime);
  const [notes, setNotes] = useState(request.notes);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ status, addressedBy, agreedPrice, agreedTime, notes });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">עריכת פנייה</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">סטטוס</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ServiceRequestStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="pending">ממתין</option>
              <option value="addressed">טופל</option>
              <option value="not_relevant">לא רלוונטי</option>
            </select>
          </div>
          {status === "addressed" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">טופל על ידי</label>
                <input
                  type="text"
                  value={addressedBy}
                  onChange={(e) => setAddressedBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="שם"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">מחיר מוסכם</label>
                <input
                  type="text"
                  value={agreedPrice}
                  onChange={(e) => setAgreedPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="₪"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">זמן מוסכם</label>
                <input
                  type="text"
                  value={agreedTime}
                  onChange={(e) => setAgreedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="תאריך ושעה"
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">הערות</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
            >
              {saving ? "שומר..." : "שמור"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminSuccessView({
  sessionSeconds,
}: {
  sessionSeconds: number;
}) {
  const router = useRouter();
  const [remaining, setRemaining] = useState(sessionSeconds);
  const [requests, setRequests] = useState<ServiceRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ServiceRequestRow | null>(null);

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

  useEffect(() => {
    fetch("/api/admin/requests")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRequests(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [editing]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
    router.push("/admin");
  }

  async function handleSave(id: string, data: Partial<ServiceRequestRow>) {
    await fetch(`/api/admin/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated = await fetch("/api/admin/requests").then((r) => r.json());
    if (Array.isArray(updated)) setRequests(updated);
    setEditing(null);
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">פניות שירות</h1>
          <div className="flex items-center gap-4">
            {sessionSeconds > 0 && remaining > 0 && (
              <span className="text-sm text-gray-500">
                הפג תוקף בעוד {remaining} שניות
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              התנתק
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">טוען...</div>
          ) : requests.length === 0 ? (
            <div className="p-12 text-center text-gray-500">אין פניות</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-right py-3 px-4 font-medium text-gray-700">סטטוס</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">שם</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">אימייל</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">טלפון</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">הודעה</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">טופל על ידי</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">מחיר מוסכם</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">זמן מוסכם</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">הערות</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">תאריך פנייה</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">תאריך טיפול</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr
                      key={request._id}
                      className="border-b border-gray-100 hover:bg-gray-50/50"
                    >
                      <td className="py-3 px-4">
                        <StatusIcon status={request.status} />
                      </td>
                      <td className="py-3 px-4 text-gray-800">{request.name}</td>
                      <td className="py-3 px-4 text-gray-800">{request.email}</td>
                      <td className="py-3 px-4 text-gray-800" dir="ltr">
                        {request.phone}
                      </td>
                      <td className="py-3 px-4 text-gray-600 max-w-[200px] truncate">
                        {request.message}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{request.addressedBy || "—"}</td>
                      <td className="py-3 px-4 text-gray-600">{request.agreedPrice || "—"}</td>
                      <td className="py-3 px-4 text-gray-600">{request.agreedTime || "—"}</td>
                      <td className="py-3 px-4 text-gray-600 max-w-[150px] truncate">
                        {request.notes || "—"}
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {formatDate(request.addressedAt)}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => setEditing(request)}
                          className="text-sm font-medium text-gray-700 hover:text-gray-900 underline"
                        >
                          ערוך
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {editing && (
        <EditModal
          request={editing}
          onClose={() => setEditing(null)}
          onSave={(data) => handleSave(editing._id, data)}
        />
      )}
    </div>
  );
}
