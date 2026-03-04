"use client";

import React, { useEffect, useState } from "react";

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
  eventDate: string;
  eventType: string;
  createdAt: string;
  addressedAt: string | null;
}

function TextModal({
  title,
  text,
  onClose,
}: {
  title: string;
  text: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg max-h-[80vh] flex flex-col"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="flex-1 overflow-y-auto min-h-0">
          <p className="text-gray-700 whitespace-pre-wrap">{text || "—"}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          סגור
        </button>
      </div>
    </div>
  );
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

const ADD_NEW_VALUE = "__add_new__";
const MINUTES_OPTIONS = [0, 15, 30, 45] as const;
const HOURS_OPTIONS = Array.from({ length: 24 }, (_, i) => i);

function parseDuration(value: string): { hours: number; minutes: number } {
  const match = value.match(/^(\d+):(\d{2})$/);
  if (match) {
    const hours = Math.min(23, Math.max(0, parseInt(match[1], 10)));
    const mins = MINUTES_OPTIONS.includes(parseInt(match[2], 10) as 0 | 15 | 30 | 45)
      ? parseInt(match[2], 10)
      : 0;
    return { hours, minutes: mins };
  }
  const nums = value.match(/\d+/g);
  if (nums && nums.length >= 1) {
    const h = Math.min(23, Math.max(0, parseInt(nums[0], 10)));
    const m = nums.length >= 2 ? Math.min(45, Math.max(0, parseInt(nums[1], 10))) : 0;
    const rounded = MINUTES_OPTIONS.reduce((a, b) => (Math.abs(b - m) < Math.abs(a - m) ? b : a));
    return { hours: h, minutes: rounded };
  }
  return { hours: 0, minutes: 0 };
}

function formatDuration(value: string): string {
  const { hours, minutes } = parseDuration(value);
  if (hours === 0 && minutes === 0) return "—";
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  return parts.length ? parts.join(" ") : "—";
}

function durationToStorage(hours: number, minutes: number): string {
  return `${hours}:${minutes.toString().padStart(2, "0")}`;
}

function EditModal({
  request,
  addressedByOptions,
  onOptionsRefresh,
  onClose,
  onSave,
}: {
  request: ServiceRequestRow;
  addressedByOptions: string[];
  onOptionsRefresh: () => Promise<string[]>;
  onClose: () => void;
  onSave: (data: Partial<ServiceRequestRow>) => Promise<void>;
}) {
  const [status, setStatus] = useState<ServiceRequestStatus>(request.status);
  const [eventDate, setEventDate] = useState(request.eventDate ?? "");
  const [eventType, setEventType] = useState(request.eventType ?? "");
  const [addressedBy, setAddressedBy] = useState(request.addressedBy);
  const [agreedPrice, setAgreedPrice] = useState(request.agreedPrice);
  const { hours: initHours, minutes: initMins } = parseDuration(request.agreedTime);
  const [durationHours, setDurationHours] = useState(initHours);
  const [durationMinutes, setDurationMinutes] = useState(initMins);
  const [notes, setNotes] = useState(request.notes);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showAddNew, setShowAddNew] = useState(false);
  const [newName, setNewName] = useState("");

  const effectiveOptions = [
    ...addressedByOptions,
    ...(addressedBy && !addressedByOptions.includes(addressedBy) ? [addressedBy] : []),
  ];

  async function handleAddNew() {
    const name = newName.trim();
    if (!name) return;
    try {
      const res = await fetch("/api/admin/addressed-by", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const data = await res.json();
        const names = data.names ?? [];
        await onOptionsRefresh();
        setAddressedBy(name);
        setShowAddNew(false);
        setNewName("");
      }
    } catch {
      /* ignore */
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      const agreedTime = durationToStorage(durationHours, durationMinutes);
      await onSave({ status, eventDate, eventType, addressedBy, agreedPrice, agreedTime, notes });
      onClose();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "שגיאה בשמירה");
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">תאריך אירוע</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">סוג אירוע</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">—</option>
              <option value="הרצאה">הרצאה</option>
              <option value="סדנה">סדנה</option>
            </select>
          </div>
          {status === "addressed" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">טופל על ידי</label>
                {showAddNew ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddNew())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="שם חדש"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleAddNew}
                      className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                    >
                      הוסף
                    </button>
                    <button
                      type="button"
                      onClick={() => (setShowAddNew(false), setNewName(""))}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      ביטול
                    </button>
                  </div>
                ) : (
                  <select
                    value={addressedBy || (effectiveOptions[0] ?? "")}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === ADD_NEW_VALUE) setShowAddNew(true);
                      else setAddressedBy(v);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {effectiveOptions.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                    <option value={ADD_NEW_VALUE}>הוסף חדש...</option>
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  מחיר מוסכם (₪)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={agreedPrice}
                    onChange={(e) => setAgreedPrice(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="סכום"
                  />
                  <span className="text-gray-600">₪</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">משך (שעות ודקות)</label>
                <div className="flex gap-2">
                  <select
                    value={durationHours}
                    onChange={(e) => setDurationHours(parseInt(e.target.value, 10))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {HOURS_OPTIONS.map((h) => (
                      <option key={h} value={h}>
                        {h} שעות
                      </option>
                    ))}
                  </select>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {MINUTES_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m} דקות
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
          {saveError && (
            <p className="text-red-600 text-sm">{saveError}</p>
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

function formatDateShort(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function AdminPanel() {
  const [requests, setRequests] = useState<ServiceRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ServiceRequestRow | null>(null);
  const [textModal, setTextModal] = useState<{ type: "message" | "notes"; text: string } | null>(null);
  const [addressedByOptions, setAddressedByOptions] = useState<string[]>([]);

  const fetchAddressedByOptions = async () => {
    const res = await fetch("/api/admin/addressed-by");
    const data = await res.json();
    if (Array.isArray(data.names)) setAddressedByOptions(data.names);
    return data.names ?? [];
  };

  useEffect(() => {
    fetch("/api/admin/requests")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRequests(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [editing]);

  useEffect(() => {
    if (editing) fetchAddressedByOptions();
  }, [editing]);

  async function handleSave(id: string, data: Partial<ServiceRequestRow>) {
    const res = await fetch(`/api/admin/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `שגיאה ${res.status}`);
    }
    const updated = await fetch("/api/admin/requests").then((r) => r.json());
    if (Array.isArray(updated)) setRequests(updated);
    setEditing(null);
  }

  return (
    <div className="py-6 px-2 sm:py-8 sm:px-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
          פניות שירות
        </h1>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">טוען...</div>
          ) : requests.length === 0 ? (
            <div className="p-12 text-center text-gray-500">אין פניות</div>
          ) : (
            <>
              {/* Mobile column layout: header | content per row */}
              <div className="block md:hidden divide-y divide-gray-200">
                {requests.map((request) => (
                  <div
                    key={request._id}
                    className="p-4 space-y-2 hover:bg-gray-50/50"
                  >
                    <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2 items-center text-sm">
                      <span className="font-medium text-gray-600">סטטוס</span>
                      <div><StatusIcon status={request.status} /></div>

                      <span className="font-medium text-gray-600">תאריך אירוע</span>
                      <span className="text-gray-600">{formatDateShort(request.eventDate || null)}</span>

                      <span className="font-medium text-gray-600">סוג אירוע</span>
                      <span className="text-gray-600">{request.eventType || "—"}</span>

                      <span className="font-medium text-gray-600">שם</span>
                      <span className="text-gray-800">{request.name}</span>

                      <span className="font-medium text-gray-600">אימייל</span>
                      <span className="text-gray-800 break-all">{request.email}</span>

                      <span className="font-medium text-gray-600">טלפון</span>
                      <span className="text-gray-800" dir="ltr">{request.phone}</span>

                      <span className="font-medium text-gray-600">הודעה</span>
                      <span
                        className={`text-gray-600 truncate block ${request.message ? "cursor-pointer" : ""}`}
                        onClick={() => request.message && setTextModal({ type: "message", text: request.message })}
                      >
                        {request.message || "—"}
                      </span>

                      <span className="font-medium text-gray-600">טופל על ידי</span>
                      <span className="text-gray-600">{request.addressedBy || "—"}</span>

                      <span className="font-medium text-gray-600">מחיר מוסכם</span>
                      <span className="text-gray-600">
                        {request.agreedPrice ? `${request.agreedPrice} ₪` : "—"}
                      </span>

                      <span className="font-medium text-gray-600">זמן מוסכם</span>
                      <span className="text-gray-600">{formatDuration(request.agreedTime)}</span>

                      <span className="font-medium text-gray-600">הערות</span>
                      <span
                        className={`text-gray-600 truncate block ${request.notes ? "cursor-pointer" : ""}`}
                        onClick={() => request.notes && setTextModal({ type: "notes", text: request.notes })}
                      >
                        {request.notes || "—"}
                      </span>

                      <span className="font-medium text-gray-600">תאריך פנייה</span>
                      <span className="text-gray-600">{formatDate(request.createdAt)}</span>

                      <span className="font-medium text-gray-600">תאריך טיפול</span>
                      <span className="text-gray-600">{formatDate(request.addressedAt)}</span>

                      <span className="font-medium text-gray-600">פעולות</span>
                      <button
                        type="button"
                        onClick={() => setEditing(request)}
                        className="text-sm font-medium text-gray-700 hover:text-gray-900 underline text-right"
                      >
                        ערוך
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop table layout */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-right py-3 px-4 font-medium text-gray-700">סטטוס</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">תאריך אירוע</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">סוג אירוע</th>
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
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {formatDateShort(request.eventDate || null)}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{request.eventType || "—"}</td>
                      <td className="py-3 px-4 text-gray-800">{request.name}</td>
                      <td className="py-3 px-4 text-gray-800">{request.email}</td>
                      <td className="py-3 px-4 text-gray-800" dir="ltr">
                        {request.phone}
                      </td>
                      <td
                        className={`py-3 px-4 text-gray-600 max-w-[200px] truncate ${request.message ? "cursor-pointer hover:bg-gray-100/80" : ""}`}
                        onClick={() => request.message && setTextModal({ type: "message", text: request.message })}
                      >
                        {request.message || "—"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{request.addressedBy || "—"}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {request.agreedPrice ? `${request.agreedPrice} ₪` : "—"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {formatDuration(request.agreedTime)}
                      </td>
                      <td
                        className={`py-3 px-4 text-gray-600 max-w-[150px] truncate ${request.notes ? "cursor-pointer hover:bg-gray-100/80" : ""}`}
                        onClick={() => request.notes && setTextModal({ type: "notes", text: request.notes })}
                      >
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
            </>
          )}
        </div>
      </div>

      {editing && (
        <EditModal
          request={editing}
          addressedByOptions={addressedByOptions}
          onOptionsRefresh={fetchAddressedByOptions}
          onClose={() => setEditing(null)}
          onSave={(data) => handleSave(editing._id, data)}
        />
      )}

      {textModal && (
        <TextModal
          title={textModal.type === "message" ? "הודעה" : "הערות"}
          text={textModal.text}
          onClose={() => setTextModal(null)}
        />
      )}
    </div>
  );
}
