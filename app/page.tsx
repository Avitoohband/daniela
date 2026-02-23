import Navbar from "@/components/Navbar";
import ServicesSection from "@/components/ServicesSection";
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
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
          הרצאות וסדנאות לגיל השלישי
        </h1>
        <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          חוויות מעשירות ומעצימות המותאמות במיוחד עבורכם. הרצאות מרתקות וסדנאות
          יצירתיות שמביאות שמחה, ידע וחוויה משותפת.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
          <a
            href="#services"
            className="btn-primary inline-flex items-center gap-2"
          >
            גלו את השירותים שלנו
            <svg
              className="w-5 h-5 rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
          <a
            href="#contact"
            className="text-gray-800 font-bold text-xl hover:underline underline-offset-4"
          >
            צרו קשר
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-800">150+</div>
            <div className="text-xl text-gray-600 mt-2">הרצאות</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-800">80+</div>
            <div className="text-xl text-gray-600 mt-2">סדנאות</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-800">5000+</div>
            <div className="text-xl text-gray-600 mt-2">משתתפים מרוצים</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-lg">
          © {new Date().getFullYear()} דניאלה - הרצאות וסדנאות. כל הזכויות
          שמורות.
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
        <HeroSection />
        <ServicesSection />
        <Carousel />
        <ContactSection />
        <Footer />
      </main>
    </ServiceProvider>
  );
}
