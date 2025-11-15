"use client";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Filter,
  Users,
  Clock,
  MapPin,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useState, useMemo, Fragment } from "react";
import { useGetAllEvents } from "@/utils/query";
import Image from "next/image";
import { getCookie } from "@/utils/cookies";
import { useRouter } from "next/navigation";

const FeaturedEvents = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useGetAllEvents(currentPage);

  const events = data?.data;
  const pagination = data?.pagination;

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

  const getLowestPrice = (tickets: Array<{ price: number }>) => {
    if (!tickets || tickets.length === 0) return 0;
    return Math.min(...tickets.map((t) => t.price));
  };

  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (!pagination) return pages;

    if (pagination.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= pagination.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(pagination.totalPages);
      } else if (currentPage >= pagination.totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = pagination.totalPages - 3; i <= pagination.totalPages; i++)
          pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(pagination.totalPages);
      }
    }

    return pages;
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
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 lg:grid-cols-2">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => {
              const startDate = formatDate(event.startTime);
              const lowestPrice = getLowestPrice(event.tickets);

              return (
                <div
                  key={event.id}
                  className="group relative overflow-hidden rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/10 sm:rounded-3xl"
                >
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-teal-500/20 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />
                  </div>

                  <div className="relative flex flex-col md:flex-row">
                    <div className="relative h-48 overflow-hidden sm:h-56 md:h-auto md:w-1/3">
                      <Image
                        src={`https://picsum.photos/seed/${event.id}/200/300`}
                        alt={event.title}
                        width={400}
                        height={300}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-40 transition-opacity duration-300 group-hover:opacity-70`}
                      ></div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
                        <div className="rounded-xl bg-white/10 px-5 py-4 text-center ring-1 ring-white/20 backdrop-blur-md transition-all duration-300 group-hover:bg-white/15 group-hover:ring-white/30 sm:rounded-2xl sm:px-6 sm:py-5 md:px-8 md:py-6">
                          <div className="mb-1 text-4xl font-bold text-white drop-shadow-lg sm:text-5xl md:mb-2 md:text-6xl">
                            {startDate.day}
                          </div>
                          <div className="text-base font-semibold tracking-wider text-white/90 sm:text-lg md:text-xl">
                            {startDate.month}
                          </div>
                        </div>
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                          {!event.isPaid && (
                            <span className="rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-xs font-bold text-white shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:bg-emerald-400 sm:px-3 sm:py-1">
                              FREE
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="relative p-4 sm:p-6 md:w-2/3 md:p-8">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
                            <span className="rounded-full bg-gradient-to-r from-gray-800 to-gray-700 px-2.5 py-1 text-xs font-semibold text-gray-200 ring-1 ring-white/10 transition-all duration-300 group-hover:from-teal-600/20 group-hover:to-purple-600/20 group-hover:ring-teal-400/30 sm:px-3">
                              {event.category}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-gray-400 transition-colors duration-300 group-hover:text-gray-300 sm:text-sm">
                              <Users className="mr-1 h-3.5 w-3.5 text-teal-400 sm:h-4 sm:w-4" />
                              <span className="font-medium">
                                {event.stats.confirmedCount}
                              </span>
                              <span>RSVP&apos;d</span>
                            </div>
                          </div>
                          <h2 className="mb-2 text-xl font-bold text-gray-100 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-teal-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent sm:text-2xl md:text-3xl">
                            {event.title}
                          </h2>
                          <p className="mb-4 line-clamp-2 text-sm text-gray-400 transition-colors duration-300 group-hover:text-gray-300 sm:mb-6 sm:text-base">
                            {event.description}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4 grid grid-cols-1 gap-3 sm:mb-6 sm:gap-4 md:grid-cols-2">
                        <div className="flex items-center gap-2.5 text-gray-300 sm:gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800/80 ring-1 ring-white/10 transition-all duration-300 group-hover:bg-teal-500/10 group-hover:ring-teal-400/30 sm:h-10 sm:w-10">
                            <Clock className="h-4 w-4 text-teal-400 transition-transform duration-300 group-hover:scale-110 sm:h-5 sm:w-5" />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
                              Time
                            </div>
                            <div className="text-xs font-semibold text-gray-300 transition-colors duration-300 group-hover:text-gray-100 sm:text-sm">
                              {formatTime(event.startTime)} -{" "}
                              {formatTime(event.endTime)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 text-gray-300 sm:gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800/80 ring-1 ring-white/10 transition-all duration-300 group-hover:bg-purple-500/10 group-hover:ring-purple-400/30 sm:h-10 sm:w-10">
                            <MapPin className="h-4 w-4 text-purple-400 transition-transform duration-300 group-hover:scale-110 sm:h-5 sm:w-5" />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
                              Location
                            </div>
                            <div className="text-xs font-semibold text-gray-300 transition-colors duration-300 group-hover:text-gray-100 sm:text-sm">
                              {event.location}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 border-t border-gray-800/50 pt-4 transition-colors duration-300 group-hover:border-gray-700/50 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
                        <div className="flex items-center gap-4 sm:gap-6">
                          <div>
                            <div className="mb-0.5 text-xs font-medium text-gray-500 transition-colors duration-300 group-hover:text-gray-400 sm:mb-1">
                              Starting from
                            </div>
                            <div className="text-xl font-bold text-gray-300 transition-colors duration-300 group-hover:text-teal-400 sm:text-2xl">
                              {lowestPrice === 0
                                ? "Free"
                                : formatPrice(lowestPrice)}
                            </div>
                          </div>
                          <div className="h-10 w-px bg-gray-800/50 transition-colors duration-300 group-hover:bg-gray-700/50 sm:h-12"></div>
                          <div>
                            <div className="mb-0.5 text-xs font-medium text-gray-500 transition-colors duration-300 group-hover:text-gray-400 sm:mb-1">
                              Tickets left
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-3.5 w-3.5 text-emerald-400 transition-transform duration-300 group-hover:scale-110 sm:h-4 sm:w-4" />
                              <span className="text-base font-bold text-gray-300 transition-colors duration-300 group-hover:text-emerald-400 sm:text-lg">
                                {event.stats.remainingTickets}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:scale-105 hover:from-indigo-500 hover:to-purple-500 hover:shadow-xl hover:shadow-indigo-500/50 active:scale-95 sm:w-auto sm:px-8 sm:py-3 sm:text-base"
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
                          <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full rounded-2xl border border-gray-800/50 bg-gray-900/50 p-8 text-center backdrop-blur-sm sm:p-12">
              <p className="text-base text-gray-400 sm:text-lg">
                No events found for this category
              </p>
            </div>
          )}
        </div>

        {pagination && pagination.totalPages >= 1 && (
          <div className="mt-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-sm text-gray-400">
              Showing{" "}
              <span className="font-semibold text-white">
                {filteredEvents.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-white">
                {pagination.totalItems}
              </span>{" "}
              events
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`rounded-lg p-2 transition-all ${
                  currentPage === 1
                    ? "cursor-not-allowed bg-gray-800 text-gray-600"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-1">
                {renderPageNumbers().map((page, index) => (
                  <Fragment key={index}>
                    {page === "..." ? (
                      <span className="px-3 py-2 text-gray-500">...</span>
                    ) : (
                      <button
                        onClick={() => handlePageChange(page as number)}
                        className={`rounded-lg px-4 py-2 font-semibold transition-all ${
                          currentPage === page
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </Fragment>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className={`rounded-lg p-2 transition-all ${
                  currentPage === pagination.totalPages
                    ? "cursor-not-allowed bg-gray-800 text-gray-600"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] bg-center opacity-5" />
    </section>
  );
};

export default FeaturedEvents;
