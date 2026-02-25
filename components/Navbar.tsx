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
<<<<<<< HEAD
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 md:h-20 gap-1 md:gap-2">
          {/* Navigation Links - all screen sizes, smaller on mobile */}
          <div className="flex items-center gap-1 md:gap-2 flex-1 justify-center flex-wrap">
=======
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex flex-nowrap items-center gap-2 sm:gap-3 h-12 sm:h-16 md:h-20 py-2">
          {/* Navigation Links - Center */}
          <div className="flex flex-nowrap items-center gap-1 sm:gap-2 flex-1 justify-center min-w-0">
>>>>>>> bd3367cacd88f70da5a94687b142f3896ed43461
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
<<<<<<< HEAD
                className="nav-link text-sm md:text-lg px-2 py-1.5 md:px-4 md:py-2"
=======
                className="nav-link text-xs sm:text-base md:text-lg px-1.5 sm:px-4 py-1 sm:py-2 whitespace-nowrap flex-shrink-0"
>>>>>>> bd3367cacd88f70da5a94687b142f3896ed43461
              >
                {link.label}
              </a>
            ))}
          </div>

<<<<<<< HEAD
          {/* Logo - smaller on mobile */}
          <div className="flex-shrink-0 flex items-center gap-2 md:gap-3">
            <span className="text-sm md:text-xl font-bold text-gray-800">
              דניאלה - הרצאות וסדנאות
            </span>
            <div className="relative w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src="/images/small-logo.jpg"
                alt="לוגו דניאלה"
                fill
                className="object-cover"
                sizes="56px"
              />
=======
          {/* Logo - Left side */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden sm:inline text-base md:text-xl font-bold text-gray-800">
                דניאלה - הרצאות וסדנאות
              </span>
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src="/images/small-logo.jpg"
                  alt="לוגו דניאלה"
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
>>>>>>> bd3367cacd88f70da5a94687b142f3896ed43461
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
