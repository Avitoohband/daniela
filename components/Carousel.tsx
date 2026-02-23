"use client";

import React, { useState, useEffect, useCallback } from "react";

const slides = [
  {
    id: 1,
    review: '"הרצאה מרתקת ומעשירה! למדתי המון דברים חדשים ונהניתי מכל רגע."',
    author: "שרה כהן, תל אביב",
  },
  {
    id: 2,
    review: '"הסדנה הייתה חוויה מדהימה. אווירה נעימה וחמה, ממליצה בחום!"',
    author: "יעקב לוי, חיפה",
  },
  {
    id: 3,
    review: '"מרצה מקסימה עם ידע רב. ההרצאות שלה תמיד מעניינות ומותאמות לקהל."',
    author: "רחל אברהם, ירושלים",
  },
  {
    id: 4,
    review: '"הסדנאות שלה יצירתיות ומהנות. יצאתי עם תחושת הישג אמיתית."',
    author: "משה דוד, באר שבע",
  },
];

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section id="gallery" className="py-20">
      {/* Green accent line above */}
      <div className="w-full h-2 bg-accent mb-8"></div>

      <div className="relative w-full h-[500px] overflow-hidden">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Placeholder Image Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white/30">
                  <svg
                    className="w-32 h-32 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-2xl">תמונה {slide.id}</span>
                </div>
              </div>
            </div>

            {/* Review Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white max-w-3xl px-8">
                <p className="text-3xl md:text-4xl font-medium leading-relaxed mb-6">
                  {slide.review}
                </p>
                <p className="text-xl text-white/80">— {slide.author}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={nextSlide}
          className="carousel-arrow right-4"
          aria-label="הבא"
        >
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <button
          onClick={prevSlide}
          className="carousel-arrow left-4"
          aria-label="הקודם"
        >
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`עבור לשקופית ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Green accent line below */}
      <div className="w-full h-2 bg-accent mt-8"></div>
    </section>
  );
}
