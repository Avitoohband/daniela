"use client";

import React from "react";
import Image from "next/image";

const DEFAULT_TITLE = "איך זה התחיל";
const DEFAULT_BODY =
  "הכל התחיל בבית הצנוע שלנו. רצינו להביא הרצאות וסדנאות מעשירות לקהל היעד היקר שלנו – גיל הזהב. מהסלון הקטן צמחו הרעיונות הראשונים, ומשם יצאנו לדרך. עד היום אנחנו זוכרים את ההתחלה הפשוטה והחמה וממשיכים באותה רוח.";

export default function GallerySection(props?: {
  title?: string;
  body?: string;
}) {
  const { title, body } = props ?? {};
  const displayTitle = title ?? DEFAULT_TITLE;
  const displayBody = body ?? DEFAULT_BODY;

  return (
    <section id="gallery" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
              <Image
                src="/images/how-it-started.jpg"
                alt={`${displayTitle} - מהבית הצנוע שלנו`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="text-right">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {displayTitle}
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                {displayBody}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
