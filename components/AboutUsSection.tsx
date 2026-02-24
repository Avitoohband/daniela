"use client";

import React from "react";
import Image from "next/image";

const profiles = [
  {
    name: "אלה",
    imageSrc: "/images/ela.jpeg",
    imageAlt: "אלה",
    bio: "אלה מביאה ניסיון רב בהנחיית הרצאות וסדנאות לגיל השלישי. עם רקע בעבודה סוציאלית והתמחות בקהילות מבוגרים, היא יוצרת חוויות למידה חמות ומעשירות. מאמינה בכוחה של הקבוצה ובהעשרה אישית בכל גיל.",
  },
  {
    name: "דניאל",
    imageSrc: "/images/daniel.jpeg",
    imageAlt: "דניאל",
    bio: "דניאל מתמחה בפיתוח תכנים יצירתיים והפעלת סדנאות חווייתיות. מגיע מתחום החינוך וההדרכה, עם תשוקה אמיתית ליצירת קשר עם קהל מבוגר ולהענקת כלים מעשיים שמעשירים את היומיום.",
  },
];

export default function AboutUsSection() {
  return (
    <section id="about-us" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12">
          אודותינו
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {profiles.map((profile) => (
            <div
              key={profile.name}
              className="flex flex-col md:flex-row gap-6 items-center md:items-start text-right"
            >
              <div className="relative w-48 h-48 flex-shrink-0 rounded-xl overflow-hidden">
                <Image
                  src={profile.imageSrc}
                  alt={profile.imageAlt}
                  fill
                  className="object-cover"
                  sizes="192px"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {profile.name}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
