"use client";

import React from "react";
import { useService } from "@/context/ServiceContext";
import ServiceCard from "./ServiceCard";

export interface ServiceItem {
  title: string;
  description: string;
  price: string;
  duration: string;
}

const DEFAULT_SERVICES = {
  lectures: {
    title: "הרצאות",
    description:
      "הרצאות מעשירות ומרתקות לגיל השלישי. נושאים מגוונים המותאמים לקהל היעד עם דגש על העשרה, למידה והנאה.",
    price: "700",
    duration: "משך: שעה אחת",
    imageAlt: "תמונת הרצאה",
    imageSrc: "/images/both-about-section.jpg",
  },
  workshops: {
    title: "סדנאות",
    description:
      "סדנאות מעשיות ואינטראקטיביות לגיל השלישי. חוויה מעצימה עם פעילות יצירתית, למידה חווייתית ותחושת הישג.",
    price: "1,000",
    duration: "משך: שעה וחצי",
    imageAlt: "תמונת סדנה",
    imageSrc: "/images/workshop.jpg",
  },
};

export default function ServicesSection({
  lectures,
  workshops,
}: {
  lectures?: ServiceItem;
  workshops?: ServiceItem;
}) {
  const servicesData = {
    lectures: lectures
      ? { ...lectures, imageAlt: "תמונת הרצאה", imageSrc: "/images/both-about-section.jpg" }
      : DEFAULT_SERVICES.lectures,
    workshops: workshops
      ? { ...workshops, imageAlt: "תמונת סדנה", imageSrc: "/images/workshop.jpg" }
      : DEFAULT_SERVICES.workshops,
  };
  const { activeService, setActiveService } = useService();

  return (
    <section id="services" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Tab Headers */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setActiveService("lectures")}
            className={`tab-button ${
              activeService === "lectures" ? "active" : "inactive"
            }`}
          >
            הרצאות
          </button>
          <button
            onClick={() => setActiveService("workshops")}
            className={`tab-button ${
              activeService === "workshops" ? "active" : "inactive"
            }`}
          >
            סדנאות
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-b-2xl rounded-tl-2xl p-8 shadow-xl">
          {activeService === "lectures" && (
            <ServiceCard {...servicesData.lectures} />
          )}
          {activeService === "workshops" && (
            <ServiceCard {...servicesData.workshops} />
          )}
        </div>
      </div>
    </section>
  );
}
