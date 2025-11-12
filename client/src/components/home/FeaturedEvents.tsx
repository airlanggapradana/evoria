"use client";
import EventCard from "./EventCard";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Filter } from "lucide-react";
import { useState } from "react";

const events = [
  {
    id: "1",
    title: "Summer Music Festival 2025",
    date: "July 15-17, 2025",
    location: "Central Park, New York",
    price: "From $89",
    image:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop",
    category: "Festival",
  },
  {
    id: "2",
    title: "Rock Legends Live",
    date: "August 5, 2025",
    location: "Madison Square Garden, NY",
    price: "From $125",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
    category: "Concert",
  },
  {
    id: "3",
    title: "Comedy Night Spectacular",
    date: "June 22, 2025",
    location: "The Comedy Store, LA",
    price: "From $45",
    image:
      "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&h=600&fit=crop",
    category: "Comedy",
  },
  {
    id: "4",
    title: "Jazz & Wine Evening",
    date: "September 10, 2025",
    location: "Blue Note, Chicago",
    price: "From $75",
    image:
      "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=600&fit=crop",
    category: "Music",
  },
  {
    id: "5",
    title: "Tech Conference 2025",
    date: "October 5-7, 2025",
    location: "Convention Center, SF",
    price: "From $299",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
    category: "Conference",
  },
  {
    id: "6",
    title: "Food & Culture Festival",
    date: "August 20-21, 2025",
    location: "Downtown Miami",
    price: "From $35",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop",
    category: "Festival",
  },
];

const categories = [
  "All",
  "Festival",
  "Concert",
  "Comedy",
  "Music",
  "Conference",
];

const FeaturedEvents = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredEvents =
    selectedCategory === "All"
      ? events
      : events.filter((event) => event.category === selectedCategory);

  return (
    <section
      id="events"
      className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-24"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 h-96 w-96 animate-pulse rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute bottom-20 left-10 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-2 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-teal-400" />
            <span className="text-sm font-medium text-teal-300">
              Trending Saat Ini
            </span>
          </div>

          <h2 className="mb-4 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text py-4 text-4xl font-extrabold text-transparent md:text-5xl lg:text-6xl">
            Acara Pilihan Minggu Ini
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Temukan acara terbaik yang sedang tren dan jangan lewatkan momen
            seru di sekitar Anda.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant="ghost"
              className={`h-10 rounded-full px-6 font-medium transition-all ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-teal-500 to-sky-500 text-white hover:from-teal-600 hover:to-sky-600"
                  : "border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {category}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-6">
            <Button
              size="lg"
              className="group h-14 bg-gradient-to-r from-teal-500 to-sky-500 px-8 font-semibold transition-all hover:scale-105 hover:from-teal-600 hover:to-sky-600"
            >
              Lihat Semua Acara
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="text-sm text-gray-400">
              Lebih dari{" "}
              <span className="font-semibold text-teal-400">10,000+</span> acara
              menanti Anda.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] bg-center opacity-5" />
    </section>
  );
};

export default FeaturedEvents;
