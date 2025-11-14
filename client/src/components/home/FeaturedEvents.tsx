"use client";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowRight,
  Filter,
  Users,
  Clock,
  MapPin,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useGetAllEvents } from "@/utils/query";
import Image from "next/image";
import { getCookie } from "@/utils/cookies";
import { useRouter } from "next/navigation";

const FeaturedEvents = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { data: events, isLoading } = useGetAllEvents();

  // Extract unique categories with memoization
  const categories = useMemo(() => {
    if (!events || events.length === 0) return [];
    const uniqueCategories = Array.from(
      new Set(events.map((evt) => evt.category)),
    );
    return ["All", ...uniqueCategories];
  }, [events]);

  // Filter events based on selected category with memoization
  const filteredEvents = useMemo(() => {
    if (!events) return [];
    if (selectedCategory === "All") return events;
    return events.filter((event) => event.category === selectedCategory);
  }, [events, selectedCategory]);

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      fullDate: date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };
  };

  const formatTime = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const categoryGradients: Record<string, string> = {
    Entertainment: "from-pink-500 to-rose-500",
    Business: "from-cyan-500 to-blue-500",
    Technology: "from-emerald-500 to-teal-500",
  };

  const getLowestPrice = (tickets: Array<{ price: number }>) => {
    if (!tickets || tickets.length === 0) return 0;
    return Math.min(...tickets.map((t) => t.price));
  };

  if (isLoading) return <div>Loading...</div>;

  if (!events || events.length === 0) {
    return <div>No events available</div>;
  }

  return (
    <section
      id="events"
      className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 sm:py-16 md:py-20 lg:py-24"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 hidden sm:block">
        <div className="absolute top-20 right-10 h-96 w-96 animate-pulse rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute bottom-20 left-10 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 text-center sm:mb-12 md:mb-16">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 backdrop-blur-sm sm:mb-4 sm:px-4 sm:py-2">
            <Sparkles className="h-3 w-3 text-teal-400 sm:h-4 sm:w-4" />
            <span className="text-xs font-medium text-teal-300 sm:text-sm">
              Trending Saat Ini
            </span>
          </div>

          <h2 className="mb-3 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text py-2 text-3xl leading-tight font-extrabold text-transparent sm:mb-4 sm:py-4 sm:text-4xl md:text-5xl lg:text-6xl">
            Acara Pilihan Minggu Ini
          </h2>
          <p className="mx-auto max-w-2xl px-4 text-base text-gray-400 sm:text-lg">
            Temukan acara terbaik yang sedang tren dan jangan lewatkan momen
            seru di sekitar Anda.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:mb-10 sm:gap-3 md:mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant="ghost"
              className={`h-8 rounded-full px-4 text-xs font-medium transition-all sm:h-10 sm:px-6 sm:text-sm ${
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
            className="h-8 w-8 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white sm:h-10 sm:w-10"
          >
            <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => {
              const startDate = formatDate(event.startTime);
              const lowestPrice = getLowestPrice(event.tickets);

              return (
                <div
                  key={event.id}
                  className="group relative overflow-hidden rounded-3xl border border-gray-800/50 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/10"
                >
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-teal-500/20 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />
                  </div>

                  <div className="relative flex flex-col md:flex-row">
                    <div className="relative overflow-hidden md:w-1/3">
                      <Image
                        src={`https://picsum.photos/seed/${event.id}/200/300`}
                        alt={event.title}
                        width={400}
                        height={300}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${categoryGradients[event.category] ?? "from-gray-500 to-gray-500"} opacity-60 transition-opacity duration-300 group-hover:opacity-70`}
                      ></div>
                      <div className="relative flex h-64 flex-col items-center justify-center p-8 md:h-full">
                        <div className="rounded-2xl bg-white/10 px-8 py-6 text-center ring-1 ring-white/20 backdrop-blur-md transition-all duration-300 group-hover:bg-white/15 group-hover:ring-white/30">
                          <div className="mb-2 text-6xl font-bold text-white drop-shadow-lg">
                            {startDate.day}
                          </div>
                          <div className="text-xl font-semibold tracking-wider text-white/90">
                            {startDate.month}
                          </div>
                        </div>
                        <div className="absolute top-4 right-4">
                          {!event.isPaid && (
                            <span className="rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:bg-emerald-400">
                              FREE
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="relative p-8 md:w-2/3">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-3 flex items-center gap-3">
                            <span className="rounded-full bg-gradient-to-r from-gray-800 to-gray-700 px-3 py-1 text-xs font-semibold text-gray-200 ring-1 ring-white/10 transition-all duration-300 group-hover:from-teal-600/20 group-hover:to-purple-600/20 group-hover:ring-teal-400/30">
                              {event.category}
                            </span>
                            <div className="flex items-center gap-1 text-sm text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                              <Users className="mr-1 h-4 w-4 text-teal-400" />
                              <span className="font-medium">
                                {event.stats.confirmedCount}
                              </span>
                              <span>RSVP&apos;d</span>
                            </div>
                          </div>
                          <h2 className="mb-2 text-3xl font-bold text-gray-100 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-teal-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent">
                            {event.title}
                          </h2>
                          <p className="mb-6 line-clamp-2 text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                            {event.description}
                          </p>
                        </div>
                      </div>

                      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex items-center gap-3 text-gray-300">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800/80 ring-1 ring-white/10 transition-all duration-300 group-hover:bg-teal-500/10 group-hover:ring-teal-400/30">
                            <Clock className="h-5 w-5 text-teal-400 transition-transform duration-300 group-hover:scale-110" />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
                              Time
                            </div>
                            <div className="text-sm font-semibold text-gray-300 transition-colors duration-300 group-hover:text-gray-100">
                              {formatTime(event.startTime)} -{" "}
                              {formatTime(event.endTime)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-300">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800/80 ring-1 ring-white/10 transition-all duration-300 group-hover:bg-purple-500/10 group-hover:ring-purple-400/30">
                            <MapPin className="h-5 w-5 text-purple-400 transition-transform duration-300 group-hover:scale-110" />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
                              Location
                            </div>
                            <div className="text-sm font-semibold text-gray-300 transition-colors duration-300 group-hover:text-gray-100">
                              {event.location}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-800/50 pt-6 transition-colors duration-300 group-hover:border-gray-700/50">
                        <div className="flex items-center gap-6">
                          <div>
                            <div className="mb-1 text-xs font-medium text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
                              Starting from
                            </div>
                            <div className="text-2xl font-bold text-gray-300 transition-colors duration-300 group-hover:text-teal-400">
                              {lowestPrice === 0
                                ? "Free"
                                : formatPrice(lowestPrice)}
                            </div>
                          </div>
                          <div className="h-12 w-px bg-gray-800/50 transition-colors duration-300 group-hover:bg-gray-700/50"></div>
                          <div>
                            <div className="mb-1 text-xs font-medium text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
                              Tickets left
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-emerald-400 transition-transform duration-300 group-hover:scale-110" />
                              <span className="text-lg font-bold text-gray-300 transition-colors duration-300 group-hover:text-emerald-400">
                                {event.stats.remainingTickets}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:scale-105 hover:from-indigo-500 hover:to-purple-500 hover:shadow-xl hover:shadow-indigo-500/50 active:scale-95"
                          onClick={async () => {
                            const session = await getCookie("access_token");
                            if (!session) {
                              router.push("/auth/sign-in");
                            } else {
                              router.push(`/events/${event.id}`);
                            }
                          }}
                        >
                          Get Tickets
                          <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full rounded-2xl border border-gray-800/50 bg-gray-900/50 p-12 text-center backdrop-blur-sm">
              <p className="text-lg text-gray-400">
                No events found for this category
              </p>
            </div>
          )}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center sm:mt-14 md:mt-16">
          <div className="inline-flex flex-col items-center gap-4 sm:gap-6">
            <Button
              size="lg"
              className="group h-12 w-full bg-gradient-to-r from-teal-500 to-sky-500 px-6 text-sm font-semibold transition-all hover:scale-105 hover:from-teal-600 hover:to-sky-600 sm:h-14 sm:w-auto sm:px-8 sm:text-base"
            >
              Lihat Semua Acara
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
            </Button>
            <p className="text-xs text-gray-400 sm:text-sm">
              Lebih dari{" "}
              <span className="font-semibold text-teal-400">
                {events.length}+
              </span>{" "}
              acara menanti Anda.
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
