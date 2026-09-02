"use client";

import { useState } from "react";
import {
  Search,
  Calendar,
  MapPin,
  Tag,
  ShieldCheck,
  BadgeCheck,
  Star,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Ticket as TicketIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface HeroProps {
  onSearchSubmit?: (filters: {
    category?: string;
    location?: string;
    date?: string;
  }) => void;
}

const Hero = ({ onSearchSubmit }: HeroProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedDate, setSelectedDate] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit({
        category: selectedCategory !== "All Categories" ? selectedCategory : undefined,
        location: selectedLocation !== "All Locations" ? selectedLocation : undefined,
        date: selectedDate || undefined,
      });
    }
    const eventsEl = document.getElementById("events");
    if (eventsEl) {
      eventsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-violet-50/50 via-white to-slate-50/50 pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Subtle Background Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-violet-400/10 blur-[120px]" />
        <div className="absolute -bottom-20 left-1/4 h-[400px] w-[400px] rounded-full bg-indigo-300/15 blur-[100px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Headline & Filters */}
          <div className="flex flex-col space-y-8 lg:col-span-7">
            {/* Pill Tag */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-200/70 bg-violet-50/80 px-4 py-1.5 text-xs font-bold tracking-wider text-violet-700 uppercase shadow-xs backdrop-blur-md sm:text-sm">
              <span className="text-base leading-none">🔥</span>
              <span>BOOK TICKETS TO AMAZING EVENTS</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:leading-[1.15]">
                Discover Amazing{" "}
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Events
                </span>{" "}
                Near You
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Find concerts, conferences, sports, festivals and experiences that create
                unforgettable memories.
              </p>
            </div>

            {/* Search Filter Bar Card */}
            <form
              onSubmit={handleSearch}
              className="rounded-2xl border border-slate-200/80 bg-white p-2.5 shadow-xl shadow-slate-200/60 transition-all hover:shadow-2xl hover:shadow-violet-500/10 sm:p-3"
            >
              <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-slate-100">
                {/* Category Selector */}
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <Tag className="h-4 w-4" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                      Category
                    </span>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="cursor-pointer bg-transparent text-xs font-semibold text-slate-800 outline-none sm:text-sm"
                    >
                      <option value="All Categories">All Categories</option>
                      <option value="Konser">Music & Concerts</option>
                      <option value="Seminar">Business & Conferences</option>
                      <option value="Olahraga">Sports & Outdoor</option>
                      <option value="Festival">Festivals & Parties</option>
                    </select>
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 sm:hidden" />
                </div>

                {/* Location Selector */}
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                      Location
                    </span>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="cursor-pointer bg-transparent text-xs font-semibold text-slate-800 outline-none sm:text-sm"
                    >
                      <option value="All Locations">All Locations</option>
                      <option value="Jakarta">Jakarta</option>
                      <option value="Bandung">Bandung</option>
                      <option value="Surabaya">Surabaya</option>
                      <option value="Bali">Bali</option>
                      <option value="Yogyakarta">Yogyakarta</option>
                    </select>
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 sm:hidden" />
                </div>

                {/* Date Selector */}
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                      Date
                    </span>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="cursor-pointer bg-transparent text-xs font-semibold text-slate-800 outline-none sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-2.5 sm:mt-2">
                <Button
                  type="submit"
                  className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 font-bold text-white shadow-md shadow-violet-500/25 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/35 hover:scale-[1.01]"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search Events
                </Button>
              </div>
            </form>

            {/* 3 Trust Feature Badges */}
            <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3 sm:gap-6">
              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white/70 p-3 shadow-xs backdrop-blur-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100/70 text-violet-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Easy Booking</h4>
                  <p className="text-xs text-slate-500">Fast & Secure</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white/70 p-3 shadow-xs backdrop-blur-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100/70 text-emerald-600">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Best Prices</h4>
                  <p className="text-xs text-slate-500">Guaranteed</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white/70 p-3 shadow-xs backdrop-blur-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100/70 text-amber-600">
                  <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Trusted by Thousands</h4>
                  <p className="text-xs text-slate-500">4.8 ★ Ratings</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="relative flex justify-center lg:col-span-5">
            <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-none">
              {/* Main Atmospheric Card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-violet-950 via-slate-950 to-indigo-950 p-4 shadow-2xl shadow-violet-900/30 ring-1 ring-white/10 sm:p-6">
                {/* Background Concert Visual with purple light */}
                <div className="relative h-80 w-full overflow-hidden rounded-2xl sm:h-96">
                  <Image
                    src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80"
                    alt="Concert stage with crowd"
                    fill
                    priority
                    className="object-cover opacity-75 mix-blend-screen transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-purple-900/40" />

                  {/* Stage Light Effects */}
                  <div className="absolute top-0 left-1/2 h-36 w-64 -translate-x-1/2 rounded-full bg-violet-500/40 blur-3xl" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    <span className="h-2 w-2 animate-ping rounded-full bg-rose-500" />
                    LIVE EXPERIENCE
                  </div>
                </div>

                {/* Floating 3D Ticket Badge */}
                <div className="absolute -top-4 -left-4 hidden rotate-[-12deg] items-center gap-2 rounded-2xl border border-white/20 bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-white shadow-xl shadow-violet-500/30 backdrop-blur-md sm:flex">
                  <TicketIcon className="h-5 w-5" />
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-violet-200 uppercase">
                      VIP PASS
                    </p>
                    <p className="text-xs font-extrabold">SPECIAL ACCESS</p>
                  </div>
                  <Sparkles className="h-4 w-4 text-amber-300" />
                </div>

                {/* Floating Calendar Badge */}
                <div className="absolute -top-3 -right-3 hidden rotate-[8deg] items-center gap-2 rounded-2xl border border-white/20 bg-white/90 px-3.5 py-2 text-slate-800 shadow-xl backdrop-blur-md sm:flex">
                  <Calendar className="h-5 w-5 text-violet-600" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">This Month</p>
                    <p className="text-xs font-bold text-violet-900">120+ Events</p>
                  </div>
                </div>

                {/* Floating Featured Event Card */}
                <div className="relative -mt-20 rounded-2xl border border-white/20 bg-white/95 p-4 shadow-2xl backdrop-blur-xl transition-transform duration-300 hover:scale-[1.02] sm:p-5">
                  <div className="flex items-center gap-3.5">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-violet-100">
                      <Image
                        src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80"
                        alt="Live in Concert The Weeknd"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs text-violet-600">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span className="font-bold">Featured Event</span>
                      </div>
                      <h3 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                        Live in Concert The Weeknd
                      </h3>
                      <p className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        Madison Square Garden, NY
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <div>
                      <span className="text-[11px] text-slate-400">Tickets from</span>
                      <p className="text-base font-extrabold text-violet-700">Rp 450.000</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        const eventsEl = document.getElementById("events");
                        if (eventsEl) {
                          eventsEl.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-5 font-bold text-white shadow-md shadow-violet-500/20 hover:from-violet-700 hover:to-purple-700"
                    >
                      Book Now
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
