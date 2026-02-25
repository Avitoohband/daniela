import Image from "next/image";
import Navbar from "@/components/Navbar";
import AboutUsSection from "@/components/AboutUsSection";
import ServicesSection from "@/components/ServicesSection";
import GallerySection from "@/components/GallerySection";
import Carousel from "@/components/Carousel";
import ContactSection from "@/components/ContactSection";
import { ServiceProvider } from "@/context/ServiceContext";

function HeroSection() {
  return (
    <section
      id="about"
      className="py-20 px-4"
    >
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800">
          הרצאות וסדנאות לגיל השלישי
        </h1>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
        <p className="text-lg">
          © {new Date().getFullYear()} דניאלה - הרצאות וסדנאות. כל הזכויות
          שמורות.
        </p>
        <p className="footer-wood-carving" dir="ltr">
          @ 2026 Avi Tuchband. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <ServiceProvider>
      <main className="min-h-screen">
        <Navbar />
        <div className="relative w-full h-[65vh] min-h-[360px] sm:h-[55vh] sm:min-h-[300px] md:h-[50vh] md:min-h-[280px] bg-gray-100">
          <Image
            src="/images/primary.jpg"
            alt="דניאלה - הרצאות וסדנאות לגיל השלישי"
            fill
            className="object-contain"
            priority
            sizes="100vw"
          />
        </div>
        <HeroSection />
        <AboutUsSection />
        <ServicesSection />
        <GallerySection />
        <Carousel />
        <ContactSection />
        <Footer />
      </main>
    </ServiceProvider>
  );
}
