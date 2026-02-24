"use client";

import React from "react";
import Image from "next/image";

interface ServiceCardProps {
  title: string;
  description: string;
  price: string;
  duration: string;
  imageAlt: string;
  imageSrc?: string;
}

export default function ServiceCard({
  title,
  description,
  price,
  duration,
  imageAlt,
  imageSrc,
}: ServiceCardProps) {
  return (
    <div className="space-y-6">
      {/* Details Card */}
      <div className="service-card">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Content - Center */}
          <div className="flex-1 text-right">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">{title}</h3>
            <p className="text-xl text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Image - Right */}
          <div className="relative w-full md:w-80 h-64 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 320px"
              />
            ) : (
              <div className="text-center text-gray-500">
                <svg
                  className="w-16 h-16 mx-auto mb-2"
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
                <span className="text-sm">{imageAlt}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Card */}
      <div className="service-card">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-right">
            <p className="text-xl font-bold text-gray-800">מחיר</p>
            <p className="text-xl text-gray-600">{duration}</p>
          </div>
          <div className="text-center md:text-left">
            <span className="text-xl font-bold text-gray-800">{price} ₪</span>
          </div>
        </div>
      </div>
    </div>
  );
}
