import Hero from "@/components/home/Hero";
import FeaturedEvents from "@/components/home/FeaturedEvents";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedEvents />
      </main>
      <Footer />
    </div>
  );
}
