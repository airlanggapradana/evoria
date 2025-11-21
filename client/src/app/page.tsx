import Hero from "@/components/home/Hero";
import FeaturedEvents from "@/components/home/FeaturedEvents";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import LandingPageFeatures from "@/components/home/Features";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <LandingPageFeatures />
        <FeaturedEvents />
      </main>
      <Footer />
    </div>
  );
}
