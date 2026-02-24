"use client";

import React from "react";
import Image from "next/image";

const navLinks = [
  { href: "#about", label: "אודות" },
  { href: "#services", label: "הרצאות וסדנאות" },
  { href: "#gallery", label: "גלריה" },
  { href: "#testimonials", label: "המלצות" },
  { href: "#contact", label: "צור קשר" },
];

export default function Navbar() {
  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          {/* Navigation Links - Center */}
          <div className="hidden md:flex items-center gap-2 flex-1 justify-center">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="nav-link"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Logo - Left side */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-gray-800">
                דניאלה - הרצאות וסדנאות
              </span>
              <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src="/images/small-logo.jpg"
                  alt="לוגו דניאלה"
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex-1">
            <button className="p-2 rounded-md text-gray-800 hover:bg-gray-100">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
