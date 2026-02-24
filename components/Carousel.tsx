"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const carouselImages = [
  "/images/carousel1.jpg",
  "/images/carousel2.jpg",
  "/images/carousel3.jpg",
  "/images/carousel4.jpg",
];

const slides = [
  {
    id: 1,
    review: '"חוויה מרגשת ומעשירה. ההרצאה התאימה בדיוק לקהל שלנו והמשתתפים ביקשו עוד."',
    author: "שרה כהן, תל אביב",
  },
  {
    id: 2,
    review: '"הסדנה הייתה מדהימה – אווירה חמה ונעימה, וכולם יצאו עם חיוך. ממליצה בחום!"',
    author: "יעקב לוי, חיפה",
  },
  {
    id: 3,
    review: '"דניאלה מרצה מקסימה עם ידע רב. ההרצאות שלה תמיד מעניינות ומותאמות בדיוק לגיל השלישי."',
    author: "רחל אברהם, ירושלים",
  },
  {
    id: 4,
    review: '"הסדנאות יצירתיות ומהנות. יצאתי עם תחושת הישג אמיתית וממליץ לכל בית אבות."',
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
    <section id="testimonials" className="py-20">
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
            {/* Image Background */}
            <div className="absolute inset-0">
              <Image
                src={carouselImages[index]}
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
              />
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
