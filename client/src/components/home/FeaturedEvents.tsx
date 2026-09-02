"use client";

import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Clock,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Search,
  Calendar as CalendarIcon,
  ArrowRight,
} from "lucide-react";
import { useState, useMemo, Fragment, useEffect } from "react";
import { useGetAllEvents, useMe } from "@/utils/query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import FeaturedEventSkeleton from "@/components/skeletons/featured-event-skeleton";
import { Badge } from "@/components/ui/badge";

interface FeaturedEventsProps {
  externalCategory?: string;
  externalSearch?: string;
}

const FeaturedEvents = ({
  externalCategory,
  externalSearch,
}: FeaturedEventsProps) => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 400);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync external filters if provided
  useEffect(() => {
    if (externalCategory) {
      setSelectedCategory(externalCategory);
    }
  }, [externalCategory]);

  useEffect(() => {
    if (externalSearch !== undefined) {
      setSearchQuery(externalSearch);
    }
  }, [externalSearch]);

  const { data, isLoading } = useGetAllEvents({
    page: currentPage,
    limit: 6,
    search: debouncedSearchQuery,
  });
  const { data: session, isLoading: isLoadingSession } = useMe();

  const events = data?.data;
  const pagination = data?.pagination;

  // Extract unique categories
  const categories = useMemo(() => {
    const baseCategories = ["All", "Konser", "Seminar", "Olahraga", "Festival"];
    if (!events || events.length === 0) return baseCategories;
    const fromEvents = Array.from(
      new Set(
        events
          .map((evt) => evt.category)
          .filter((cat): cat is string => Boolean(cat))
      )
    );
    return Array.from(new Set([...baseCategories, ...fromEvents]));
  }, [events]);

  // Filter events based on selected category
  const filteredEvents = useMemo(() => {
    if (!events) return [];
    if (selectedCategory === "All") return events;
    return events.filter(
      (event) =>
        event.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [events, selectedCategory]);

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return {
      day: String(date.getDate()).padStart(2, "0"),
      month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      fullDate: date.toLocaleDateString("en-US", {
        month: "short",
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
      const eventsSection = document.getElementById("events");
      if (eventsSection) {
        eventsSection.scrollIntoView({ behavior: "smooth" });
      }
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

  if (isLoading || isLoadingSession) return <FeaturedEventSkeleton />;

  return (
    <section
      id="events"
      className="relative scroll-mt-20 bg-slate-50/50 py-16 sm:py-20 lg:py-24"
    >
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end sm:mb-12">
          <div>
            <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/80 px-3.5 py-1 text-xs font-bold tracking-wider text-violet-700 uppercase">
              <Sparkles className="h-3.5 w-3.5 text-violet-600" />
              <span>UPCOMING EVENTS</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Popular Events Near You
            </h2>
            <p className="mt-2 text-base text-slate-600">
              Discover and book tickets for the hottest events happening right now.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-violet-600 hover:text-violet-700"
          >
            <span>View All Events</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              aria-label="Cari event"
              placeholder="Search events, concerts, seminars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 rounded-full border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant="ghost"
                className={`h-9 rounded-full px-4 text-xs font-semibold transition-all duration-200 sm:text-sm ${
                  selectedCategory.toLowerCase() === category.toLowerCase()
                    ? "bg-violet-600 text-white shadow-md shadow-violet-500/25 hover:bg-violet-700 hover:text-white"
                    : "border border-slate-200/80 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                }`}
              >
                {category === "Konser"
                  ? "Music"
                  : category === "Seminar"
                  ? "Business"
                  : category === "Olahraga"
                  ? "Sports"
                  : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => {
              const startDate = formatDate(event.startTime);
              const lowestPrice = getLowestPrice(event.tickets);

              return (
                <div
                  key={event.id}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-500/10"
                >
                  {/* Event Thumbnail with Date Badge Overlay */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100 sm:h-56">
                    <Image
                      src={
                        event.bannerUrl ||
                        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                    {/* Reference-style Date Badge: Top-Left Pill Card */}
                    <div className="absolute top-3.5 left-3.5 flex flex-col items-center justify-center rounded-2xl border border-white/40 bg-white/95 px-3 py-2 text-center shadow-lg backdrop-blur-md">
                      <span className="text-[10px] font-black tracking-wider text-violet-600 uppercase">
                        {startDate.month}
                      </span>
                      <span className="text-lg font-black leading-none text-slate-900">
                        {startDate.day}
                      </span>
                    </div>

                    {/* Top-Right Badges: Status & Free */}
                    <div className="absolute top-3.5 right-3.5 flex flex-col items-end gap-1.5">
                      {!event.isPaid && (
                        <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-md">
                          FREE
                        </span>
                      )}
                      <Badge
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-xs ${
                          event.isApproved
                            ? "bg-slate-900/80 text-white backdrop-blur-md"
                            : "bg-amber-500 text-white"
                        }`}
                      >
                        {event.isApproved ? "Verified" : "Pending"}
                      </Badge>
                    </div>

                    {/* Category Tag pill over bottom left of image */}
                    <div className="absolute bottom-3.5 left-3.5">
                      <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                        {event.category || "Event"}
                      </span>
                    </div>
                  </div>

                  {/* Event Details Content */}
                  <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                    <div>
                      <h3 className="line-clamp-2 text-lg font-bold text-slate-900 transition-colors duration-200 group-hover:text-violet-600 sm:text-xl">
                        {event.title}
                      </h3>

                      <p className="mt-1.5 line-clamp-2 text-xs text-slate-500 sm:text-sm">
                        {event.description}
                      </p>

                      {/* Location & Time Row */}
                      <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-violet-500" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 shrink-0 text-violet-500" />
                          <span>
                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Price & Book Button */}
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div>
                        <span className="text-[11px] font-medium text-slate-400">
                          Starts from
                        </span>
                        <p className="text-base font-extrabold text-slate-900 sm:text-lg">
                          {lowestPrice === 0 ? "Free" : formatPrice(lowestPrice)}
                        </p>
                      </div>

                      <button
                        className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-white shadow-md transition-all duration-200 sm:px-5 sm:py-2.5 sm:text-sm ${
                          session?.role === "ORGANIZER" || !event.isApproved
                            ? "cursor-not-allowed bg-slate-300 text-slate-500"
                            : "bg-gradient-to-r from-violet-600 to-purple-600 shadow-violet-500/25 hover:from-violet-700 hover:to-purple-700 hover:scale-105 active:scale-95"
                        }`}
                        disabled={session?.role === "ORGANIZER" || !event.isApproved}
                        onClick={async () => {
                          if (session?.role === "ORGANIZER") {
                            toast.error("Organizer tidak dapat membeli tiket.", {
                              position: "top-center",
                              richColors: true,
                            });
                            return;
                          }
                          if (!session) {
                            router.push("/auth/sign-in");
                          } else {
                            router.push(`/events/${event.id}`);
                          }
                        }}
                      >
                        <span>
                          {session?.role === "ORGANIZER"
                            ? "Organizer Mode"
                            : !event.isApproved
                            ? "Pending"
                            : "Book Now"}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full">
              <div className="mx-auto max-w-lg rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-xs">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                  <CalendarIcon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  No Events Found
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  We couldn&apos;t find any events matching your criteria. Try resetting
                  your search or explore other categories.
                </p>

                <div className="mt-6 flex justify-center gap-3">
                  <Button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSearchQuery("");
                      setCurrentPage(1);
                    }}
                    className="rounded-full bg-violet-600 px-6 font-semibold text-white hover:bg-violet-700"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-6 sm:flex-row">
            <p className="text-xs text-slate-500 sm:text-sm">
              Showing <span className="font-bold text-slate-800">{filteredEvents.length}</span>{" "}
              of <span className="font-bold text-slate-800">{pagination.totalItems}</span> events
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition ${
                  currentPage === 1
                    ? "cursor-not-allowed opacity-40"
                    : "hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                }`}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {renderPageNumbers().map((page, index) => (
                <Fragment key={index}>
                  {page === "..." ? (
                    <span className="px-2 text-xs text-slate-400">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(page as number)}
                      className={`h-9 min-w-[36px] rounded-xl px-2 text-xs font-bold transition ${
                        currentPage === page
                          ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </Fragment>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className={`flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition ${
                  currentPage === pagination.totalPages
                    ? "cursor-not-allowed opacity-40"
                    : "hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                }`}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedEvents;
