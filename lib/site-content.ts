import { getDb } from "./db";

const COLLECTION = "site_content";

export interface AboutUsProfile {
  name: string;
  bio: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  price: string;
  duration: string;
}

export interface CarouselSlide {
  id: string;
  review: string;
  author: string;
}

export interface ContactSocials {
  facebook: string;
  instagram: string;
  whatsapp: string;
  linkedin: string;
}

export interface ContactPerson {
  name: string;
  phone: string;
}

export interface SiteContentMap {
  about_us: { profiles: AboutUsProfile[] };
  services: { lectures: ServiceItem; workshops: ServiceItem };
  how_it_started: { title: string; body: string };
  carousel: { slides: CarouselSlide[] };
  contact: {
    contact1: ContactPerson;
    contact2: ContactPerson;
    email: string;
    address: string;
    socials: ContactSocials;
  };
}

export type SiteContentSection = keyof SiteContentMap;

const DEFAULT_ABOUT_US: SiteContentMap["about_us"] = {
  profiles: [
    {
      name: "אלה",
      bio: "אלה מביאה ניסיון רב בהנחיית הרצאות וסדנאות לגיל השלישי. עם רקע בעבודה סוציאלית והתמחות בקהילות מבוגרים, היא יוצרת חוויות למידה חמות ומעשירות. מאמינה בכוחה של הקבוצה ובהעשרה אישית בכל גיל.",
    },
    {
      name: "דניאל",
      bio: "דניאל מתמחה בפיתוח תכנים יצירתיים והפעלת סדנאות חווייתיות. מגיע מתחום החינוך וההדרכה, עם תשוקה אמיתית ליצירת קשר עם קהל מבוגר ולהענקת כלים מעשיים שמעשירים את היומיום.",
    },
  ],
};

const DEFAULT_SERVICES: SiteContentMap["services"] = {
  lectures: {
    title: "הרצאות",
    description:
      "הרצאות מעשירות ומרתקות לגיל השלישי. נושאים מגוונים המותאמים לקהל היעד עם דגש על העשרה, למידה והנאה.",
    price: "700",
    duration: "משך: שעה אחת",
  },
  workshops: {
    title: "סדנאות",
    description:
      "סדנאות מעשיות ואינטראקטיביות לגיל השלישי. חוויה מעצימה עם פעילות יצירתית, למידה חווייתית ותחושת הישג.",
    price: "1,000",
    duration: "משך: שעה וחצי",
  },
};

const DEFAULT_HOW_IT_STARTED: SiteContentMap["how_it_started"] = {
  title: "איך זה התחיל",
  body: "הכל התחיל בבית הצנוע שלנו. רצינו להביא הרצאות וסדנאות מעשירות לקהל היעד היקר שלנו – גיל הזהב. מהסלון הקטן צמחו הרעיונות הראשונים, ומשם יצאנו לדרך. עד היום אנחנו זוכרים את ההתחלה הפשוטה והחמה וממשיכים באותה רוח.",
};

const DEFAULT_CAROUSEL: SiteContentMap["carousel"] = {
  slides: [
    {
      id: "1",
      review:
        '"חוויה מרגשת ומעשירה. ההרצאה התאימה בדיוק לקהל שלנו והמשתתפים ביקשו עוד."',
      author: "שרה כהן, תל אביב",
    },
    {
      id: "2",
      review:
        '"הסדנה הייתה מדהימה – אווירה חמה ונעימה, וכולם יצאו עם חיוך. ממליצה בחום!"',
      author: "יעקב לוי, חיפה",
    },
    {
      id: "3",
      review:
        '"דניאלה מרצה מקסימה עם ידע רב. ההרצאות שלה תמיד מעניינות ומותאמות בדיוק לגיל השלישי."',
      author: "רחל אברהם, ירושלים",
    },
    {
      id: "4",
      review:
        '"הסדנאות יצירתיות ומהנות. יצאתי עם תחושת הישג אמיתית וממליץ לכל בית אבות."',
      author: "משה דוד, באר שבע",
    },
  ],
};

const DEFAULT_CONTACT: SiteContentMap["contact"] = {
  contact1: { name: "דניאלה ישראלי", phone: "050-123-4567" },
  contact2: { name: "", phone: "" },
  email: "daniela@example.com",
  address: "רחוב הרצל 123, תל אביב",
  socials: {
    facebook: "#",
    instagram: "#",
    whatsapp: "#",
    linkedin: "#",
  },
};

const DEFAULTS: SiteContentMap = {
  about_us: DEFAULT_ABOUT_US,
  services: DEFAULT_SERVICES,
  how_it_started: DEFAULT_HOW_IT_STARTED,
  carousel: DEFAULT_CAROUSEL,
  contact: DEFAULT_CONTACT,
};

const VALID_SECTIONS: SiteContentSection[] = [
  "about_us",
  "services",
  "how_it_started",
  "carousel",
  "contact",
];

export function isValidSection(s: string): s is SiteContentSection {
  return VALID_SECTIONS.includes(s as SiteContentSection);
}

export async function getSiteContent(
  section?: SiteContentSection
): Promise<Partial<SiteContentMap> | SiteContentMap[SiteContentSection]> {
  const db = await getDb();
  const col = db.collection(COLLECTION);

  if (section) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = await col.findOne({ _id: section } as any);
    const defaultData = DEFAULTS[section];
    if (!doc || !doc.data) return defaultData;
    let merged = { ...defaultData, ...doc.data } as SiteContentMap[SiteContentSection];
    if (section === "contact") {
      const c = merged as SiteContentMap["contact"];
      c.socials = { ...DEFAULT_CONTACT.socials, ...c.socials };
      if (!c.contact1 || !c.contact2) {
        const legacy = merged as { contacts?: ContactPerson[]; name?: string; phone?: string; additionalContacts?: ContactPerson[] };
        const arr = legacy.contacts?.length
          ? legacy.contacts
          : legacy.name || legacy.phone
            ? [{ name: legacy.name ?? "", phone: legacy.phone ?? "" }, ...(legacy.additionalContacts ?? [])]
            : [DEFAULT_CONTACT.contact1, DEFAULT_CONTACT.contact2];
        c.contact1 = arr[0] ?? DEFAULT_CONTACT.contact1;
        c.contact2 = arr[1] ?? DEFAULT_CONTACT.contact2;
      }
    }
    return merged;
  }

  const result: Partial<SiteContentMap> = {};
  for (const s of VALID_SECTIONS) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = await col.findOne({ _id: s } as any);
    const defaultData = DEFAULTS[s];
    let merged = !doc || !doc.data
      ? defaultData
      : { ...defaultData, ...doc.data };
    if (s === "contact" && merged && typeof merged === "object" && "socials" in merged) {
      const c = merged as SiteContentMap["contact"];
      c.socials = { ...DEFAULT_CONTACT.socials, ...c.socials };
      if (!c.contact1 || !c.contact2) {
        const legacy = merged as { contacts?: ContactPerson[]; name?: string; phone?: string; additionalContacts?: ContactPerson[] };
        const arr = legacy.contacts?.length
          ? legacy.contacts
          : legacy.name || legacy.phone
            ? [{ name: legacy.name ?? "", phone: legacy.phone ?? "" }, ...(legacy.additionalContacts ?? [])]
            : [DEFAULT_CONTACT.contact1, DEFAULT_CONTACT.contact2];
        c.contact1 = arr[0] ?? DEFAULT_CONTACT.contact1;
        c.contact2 = arr[1] ?? DEFAULT_CONTACT.contact2;
      }
    }
    (result as Record<string, unknown>)[s] = merged;
  }
  return result;
}

export async function updateSiteContent<T extends SiteContentSection>(
  section: T,
  data: SiteContentMap[T]
): Promise<void> {
  if (!isValidSection(section)) {
    throw new Error(`Invalid section: ${section}`);
  }
  const db = await getDb();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await db.collection(COLLECTION).updateOne(
    { _id: section } as any,
    { $set: { data, updatedAt: new Date() } },
    { upsert: true }
  );
}
