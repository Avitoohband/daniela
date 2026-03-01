"use client";

import React, { useEffect, useState } from "react";
import type {
  SiteContentMap,
  AboutUsProfile,
  ServiceItem,
  CarouselSlide,
  ContactSocials,
  ContactPerson,
} from "@/lib/site-content";

const SECTIONS = [
  {
    id: "about_us" as const,
    title: "אודותינו",
    desc: "עריכת תוכן אלה ודניאל",
  },
  {
    id: "services" as const,
    title: "הרצאות וסדנאות",
    desc: "עריכת מידע, משך ומחיר להרצאות וסדנאות",
  },
  {
    id: "how_it_started" as const,
    title: "איך זה התחיל",
    desc: "עריכת כותרת וטקסט הסעיף",
  },
  {
    id: "carousel" as const,
    title: "מחוות לקוחות (קרוסלה)",
    desc: "הוספה, עריכה ומחיקה של ביקורות",
  },
  {
    id: "contact" as const,
    title: "צור קשר",
    desc: "עריכת פרטי התקשרות וקישורי רשתות חברתיות",
  },
];

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default function ContentEditor() {
  const [content, setContent] = useState<Partial<SiteContentMap> | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<keyof SiteContentMap | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchContent = async () => {
    try {
      const res = await fetch("/api/admin/content");
      if (res.ok) {
        const data = await res.json();
        setContent(data);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSave = async (section: keyof SiteContentMap, data: unknown) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data }),
      });
      if (res.ok) {
        setContent((prev) => (prev ? { ...prev, [section]: data } : { [section]: data }));
        setEditing(null);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-6 px-2 sm:py-8 sm:px-4" dir="rtl">
        <div className="max-w-7xl mx-auto">
          <div className="p-12 text-center text-gray-500">טוען...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-2 sm:py-8 sm:px-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
          ניהול תוכן אתר
        </h1>
        <div className="space-y-4">
          {SECTIONS.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl shadow-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-800">{s.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{s.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditing(s.id)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm font-medium self-start sm:self-center"
              >
                צפה וערוך
              </button>
            </div>
          ))}
        </div>

        {/* About Us Modal */}
        {editing === "about_us" && content?.about_us && (
          <AboutUsModal
            profiles={content.about_us.profiles}
            onSave={(data) => handleSave("about_us", data)}
            onClose={() => setEditing(null)}
            saving={saving}
          />
        )}

        {/* Services Modal */}
        {editing === "services" && content?.services && (
          <ServicesModal
            data={content.services}
            onSave={(data) => handleSave("services", data)}
            onClose={() => setEditing(null)}
            saving={saving}
          />
        )}

        {/* How It Started Modal */}
        {editing === "how_it_started" && content?.how_it_started && (
          <HowItStartedModal
            data={content.how_it_started}
            onSave={(data) => handleSave("how_it_started", data)}
            onClose={() => setEditing(null)}
            saving={saving}
          />
        )}

        {/* Carousel Modal */}
        {editing === "carousel" && content?.carousel && (
          <CarouselModal
            slides={content.carousel.slides}
            onSave={(data) => handleSave("carousel", data)}
            onClose={() => setEditing(null)}
            saving={saving}
          />
        )}

        {/* Contact Modal */}
        {editing === "contact" && content?.contact && (
          <ContactModal
            data={content.contact}
            onSave={(data) => handleSave("contact", data)}
            onClose={() => setEditing(null)}
            saving={saving}
          />
        )}
      </div>
    </div>
  );
}

function AboutUsModal({
  profiles,
  onSave,
  onClose,
  saving,
}: {
  profiles: AboutUsProfile[];
  onSave: (data: SiteContentMap["about_us"]) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [state, setState] = useState(profiles);

  return (
    <Modal title="אודותינו" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave({ profiles: state });
        }}
        className="space-y-6"
      >
        {state.map((p, i) => (
          <div key={i} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              שם ({i === 0 ? "אלה" : "דניאל"})
            </label>
            <input
              type="text"
              value={p.name}
              onChange={(e) => {
                const next = [...state];
                next[i] = { ...next[i], name: e.target.value };
                setState(next);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <label className="block text-sm font-medium text-gray-700">תיאור</label>
            <textarea
              value={p.bio}
              onChange={(e) => {
                const next = [...state];
                next[i] = { ...next[i], bio: e.target.value };
                setState(next);
              }}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        ))}
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
    </Modal>
  );
}

function ServicesModal({
  data,
  onSave,
  onClose,
  saving,
}: {
  data: SiteContentMap["services"];
  onSave: (data: SiteContentMap["services"]) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [tab, setTab] = useState<"lectures" | "workshops">("lectures");
  const [state, setState] = useState(data);

  const current = state[tab];
  const setCurrent = (v: ServiceItem) =>
    setState((s) => ({ ...s, [tab]: v }));

  return (
    <Modal title="הרצאות וסדנאות" onClose={onClose}>
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setTab("lectures")}
          className={`flex-1 py-2 rounded-lg ${tab === "lectures" ? "bg-gray-200" : "bg-gray-100"}`}
        >
          הרצאות
        </button>
        <button
          type="button"
          onClick={() => setTab("workshops")}
          className={`flex-1 py-2 rounded-lg ${tab === "workshops" ? "bg-gray-200" : "bg-gray-100"}`}
        >
          סדנאות
        </button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(state);
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">כותרת</label>
          <input
            type="text"
            value={current.title}
            onChange={(e) => setCurrent({ ...current, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
          <textarea
            value={current.description}
            onChange={(e) => setCurrent({ ...current, description: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">מחיר (₪)</label>
          <input
            type="text"
            value={current.price}
            onChange={(e) => setCurrent({ ...current, price: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">משך</label>
          <input
            type="text"
            value={current.duration}
            onChange={(e) => setCurrent({ ...current, duration: e.target.value })}
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
    </Modal>
  );
}

function HowItStartedModal({
  data,
  onSave,
  onClose,
  saving,
}: {
  data: SiteContentMap["how_it_started"];
  onSave: (data: SiteContentMap["how_it_started"]) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [title, setTitle] = useState(data.title);
  const [body, setBody] = useState(data.body);

  return (
    <Modal title="איך זה התחיל" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave({ title, body });
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">כותרת</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">טקסט</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
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
    </Modal>
  );
}

function CarouselModal({
  slides,
  onSave,
  onClose,
  saving,
}: {
  slides: CarouselSlide[];
  onSave: (data: SiteContentMap["carousel"]) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [state, setState] = useState(slides);

  const addSlide = () => {
    setState((s) => [
      ...s,
      { id: crypto.randomUUID(), review: "", author: "" },
    ]);
  };

  const removeSlide = (index: number) => {
    setState((s) => s.filter((_, i) => i !== index));
  };

  const updateSlide = (index: number, field: "review" | "author", value: string) => {
    setState((s) => {
      const next = [...s];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  return (
    <Modal title="מחוות לקוחות" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave({ slides: state });
        }}
        className="space-y-4"
      >
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {state.map((slide, i) => (
            <div
              key={slide.id}
              className="p-3 border border-gray-200 rounded-lg space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">ביקורת {i + 1}</span>
                <button
                  type="button"
                  onClick={() => removeSlide(i)}
                  className="text-red-600 text-sm hover:underline"
                >
                  מחק
                </button>
              </div>
              <input
                type="text"
                placeholder="ביקורת"
                value={slide.review}
                onChange={(e) => updateSlide(i, "review", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="מחבר"
                value={slide.author}
                onChange={(e) => updateSlide(i, "author", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addSlide}
          className="w-full py-2 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
        >
          הוסף ביקורת
        </button>
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
    </Modal>
  );
}

const SOCIAL_LABELS: { key: keyof ContactSocials; label: string }[] = [
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "linkedin", label: "LinkedIn" },
];

const DEFAULT_CONTACT: ContactPerson = { name: "", phone: "" };

function ContactModal({
  data,
  onSave,
  onClose,
  saving,
}: {
  data: SiteContentMap["contact"];
  onSave: (data: SiteContentMap["contact"]) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const legacy = data as { contacts?: ContactPerson[] };
  const arr = legacy.contacts?.length ? legacy.contacts : [];
  const contact1 = data.contact1 ?? arr[0] ?? DEFAULT_CONTACT;
  const contact2 = data.contact2 ?? arr[1] ?? DEFAULT_CONTACT;
  const [state, setState] = useState({
    contact1,
    contact2,
    email: data.email ?? "",
    address: data.address ?? "",
    socials: { ...{ facebook: "", instagram: "", whatsapp: "", linkedin: "" }, ...data.socials },
  });

  const setSocial = (key: keyof ContactSocials, value: string) => {
    setState((s) => ({
      ...s,
      socials: { ...s.socials, [key]: value },
    }));
  };

  const updateContact = (which: "contact1" | "contact2", field: "name" | "phone", value: string) => {
    setState((s) => ({
      ...s,
      [which]: { ...s[which], [field]: value },
    }));
  };

  return (
    <Modal title="צור קשר" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            contact1: state.contact1,
            contact2: state.contact2,
            email: state.email,
            address: state.address,
            socials: state.socials,
          });
        }}
        className="space-y-4"
      >
        <div className="pt-2 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">אנשי קשר</p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">קשר 1</label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="שם"
                  value={state.contact1.name}
                  onChange={(e) => updateContact("contact1", "name", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="טלפון"
                  value={state.contact1.phone}
                  onChange={(e) => updateContact("contact1", "phone", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  dir="ltr"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">קשר 2</label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="שם"
                  value={state.contact2.name}
                  onChange={(e) => updateContact("contact2", "name", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="טלפון"
                  value={state.contact2.phone}
                  onChange={(e) => updateContact("contact2", "phone", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
          <input
            type="email"
            value={state.email}
            onChange={(e) => setState({ ...state, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">כתובת</label>
          <input
            type="text"
            value={state.address}
            onChange={(e) => setState({ ...state, address: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="pt-2 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">קישורי רשתות חברתיות (אופציונלי)</p>
          <div className="space-y-2">
            {SOCIAL_LABELS.map(({ key, label }) => (
              <div key={key} className="flex gap-2 items-center">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-0.5">{label}</label>
                  <input
                    type="url"
                    value={state.socials[key] ?? ""}
                    onChange={(e) => setSocial(key, e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSocial(key, "")}
                  title="נקה"
                  className="mt-5 px-2 py-1 text-red-600 text-sm hover:bg-red-50 rounded"
                >
                  מחק
                </button>
              </div>
            ))}
          </div>
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
    </Modal>
  );
}
