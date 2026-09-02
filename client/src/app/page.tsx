"use client";

import { useState } from "react";
import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import EventCategories from "@/components/home/EventCategories";
import FeaturedEvents from "@/components/home/FeaturedEvents";
import SeatBookingPreview from "@/components/home/SeatBookingPreview";
import TrustStats from "@/components/home/TrustStats";
import NewsletterBanner from "@/components/home/NewsletterBanner";
import Footer from "@/components/home/Footer";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchFilter, setSearchFilter] = useState<string>("");

  const handleHeroSearch = (filters: {
    category?: string;
    location?: string;
    date?: string;
  }) => {
    if (filters.category) {
      setSelectedCategory(filters.category);
    }
    if (filters.location) {
      setSearchFilter(filters.location);
    }
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans antialiased selection:bg-violet-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero onSearchSubmit={handleHeroSearch} />

        {/* 2. Browse Event Categories */}
        <EventCategories onSelectCategory={handleSelectCategory} />

        {/* 3. Popular Events Near You (Main Events Catalog) */}
        <FeaturedEvents
          externalCategory={selectedCategory}
          externalSearch={searchFilter}
        />

        {/* 4. Interactive Seat Booking Showcase */}
        <SeatBookingPreview />

        {/* 5. Trust & Platform Stats */}
        <TrustStats />

        {/* 6. Newsletter Subscription CTA */}
        <NewsletterBanner />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
