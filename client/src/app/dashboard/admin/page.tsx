"use client";
import React, { useState } from "react";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  AlertTriangle,
  TrendingUp,
  FileText,
  Menu,
  X,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  BarChart3,
  Download,
} from "lucide-react";
import {
  useGetAllIncomingEvents,
  useLogout,
  useUpdateEventApproval,
} from "@/utils/query";
import type { Event } from "@/types/get-incoming-events.type";
import { toast } from "sonner";
import { RiLogoutBoxLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import EventCard from "@/components/admin/EventCard";
import EventModal from "@/components/admin/EventModal";

interface StatCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: React.ReactNode;
  value: React.ReactNode;
  color: string;
}

const AdminDashboard = () => {
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: adminData, isLoading } = useGetAllIncomingEvents(currentPage);
  const { mutateAsync: handleUpdateApproval, isPending } =
    useUpdateEventApproval();
  const { mutateAsync: handleLogout, isPending: isPendingLogout } = useLogout();

  const formatDateTime = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!adminData?.user || !adminData.events) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4 text-white">
        <div className="max-w-md text-center">
          <div className="bg-opacity-20 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-500">
            <AlertTriangle className="h-10 w-10 text-red-400" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">Error Loading Data</h2>
          <p className="mb-6 text-gray-400">
            Unable to load dashboard data. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold transition-all hover:from-indigo-500 hover:to-purple-500"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const filteredEvents = adminData.events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      selectedTab === "all" || event.status.toLowerCase() === selectedTab;
    return matchesSearch && matchesTab;
  });

  const stats = adminData.stats;

  const pagination = adminData.pagination;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const totalPages = pagination.totalPages;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const StatCard: React.FC<StatCardProps> = ({
    icon: Icon,
    label,
    value,
    color,
  }) => (
    <div className="rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-4 transition-all hover:border-gray-600 sm:rounded-2xl sm:p-6">
      <div className="mb-3 flex items-start justify-between sm:mb-4">
        <div
          className={`h-10 w-10 rounded-lg sm:h-12 sm:w-12 sm:rounded-xl ${color} bg-opacity-20 flex items-center justify-center`}
        >
          <Icon
            className={`h-5 w-5 sm:h-6 sm:w-6 ${color.replace(/^bg-/, "text-")}`}
          />
        </div>
        <TrendingUp className="h-4 w-4 text-green-400 sm:h-5 sm:w-5" />
      </div>
      <div className="mb-1 text-2xl font-bold sm:text-3xl">{value}</div>
      <div className="text-xs text-gray-400 sm:text-sm">{label}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-opacity-95 sticky top-0 z-50 border-b border-gray-800 bg-gray-950 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between sm:h-16">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="rounded-lg bg-gray-800 p-2 transition-colors hover:bg-gray-700 lg:hidden"
              >
                {showMobileMenu ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
              <h1 className="text-lg font-bold sm:text-xl">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="relative rounded-lg bg-gray-800 p-2 transition-colors hover:bg-gray-700">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <button className="hidden rounded-lg bg-gray-800 p-2 transition-colors hover:bg-gray-700 sm:block">
                <Settings className="h-5 w-5" />
              </button>
              <button
                type="button"
                disabled={isPendingLogout}
                className="flex items-center gap-2 rounded-lg bg-gray-800 px-3 py-2 text-sm font-semibold transition-colors hover:bg-gray-700 disabled:opacity-50"
                onClick={async (e) => {
                  if (!confirm("Logout and clear session?")) return;
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.setAttribute("aria-busy", "true");
                  btn.disabled = true;
                  try {
                    await handleLogout();
                    router.replace("/");
                  } finally {
                    btn.removeAttribute("aria-busy");
                    btn.disabled = false;
                  }
                }}
                aria-label="Logout"
              >
                <RiLogoutBoxLine className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="mb-2 text-2xl font-bold sm:text-3xl">
            Selamat Datang, {adminData.user.name}! 👋
          </h2>
          <p className="text-sm text-gray-400 sm:text-base">
            Berikut adalah ringkasan aktivitas terbaru di platform acara Anda.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 lg:grid-cols-4 lg:gap-6">
          <StatCard
            icon={Calendar}
            label="Total Events"
            value={stats.totalEvents}
            color="bg-indigo-500"
          />
          <StatCard
            icon={Clock}
            label="Menunggu Persetujuan"
            value={stats.pendingApproval}
            color="bg-yellow-500"
          />
          <StatCard
            icon={CheckCircle}
            label="Diterima"
            value={stats.approvedEvents}
            color="bg-green-500"
          />
          <StatCard
            icon={XCircle}
            label="Ditolak"
            value={stats.rejectedEvents}
            color="bg-red-500"
          />
        </div>

        {/* Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="scrollbar-hide flex gap-2 overflow-x-auto border-b border-gray-800 pb-px">
            {["all", "pending", "approved", "rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 text-sm font-semibold whitespace-nowrap capitalize transition-all sm:px-6 sm:py-3 sm:text-base ${
                  selectedTab === tab
                    ? "border-b-2 border-indigo-500 text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-500 sm:left-4 sm:h-5 sm:w-5" />
            <input
              type="text"
              placeholder="Search events or organizers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2.5 pr-4 pl-10 text-sm transition-colors focus:border-indigo-500 focus:outline-none sm:rounded-xl sm:py-3 sm:pl-12 sm:text-base"
            />
          </div>
          <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-gray-700 sm:rounded-xl sm:px-6 sm:py-3 sm:text-base">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>

        {/* Events List */}
        <div className="space-y-4 sm:space-y-6">
          {selectedTab !== "organizers" &&
            filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isPending={isPending}
                onOpen={(e) => {
                  setSelectedEvent(e);
                  setShowModal(true);
                }}
                onApprove={async () => {
                  try {
                    const res = await handleUpdateApproval({
                      eventId: event.id,
                      isApproved: true,
                    });
                    if (res === 200) {
                      toast.success("Event approved successfully!", {
                        position: "top-center",
                        richColors: true,
                      });
                    }
                  } catch (err) {
                    if (err instanceof Error) {
                      toast.error(`Error approving event: ${err.message}`, {
                        position: "top-center",
                        richColors: true,
                      });
                    }
                  }
                }}
                onReject={async () => {
                  try {
                    const res = await handleUpdateApproval({
                      eventId: event.id,
                      isApproved: false,
                    });
                    if (res === 200) {
                      toast.success("Event rejected successfully!", {
                        position: "top-center",
                        richColors: true,
                      });
                    }
                  } catch (err) {
                    if (err instanceof Error) {
                      toast.error(`Error rejecting event: ${err.message}`, {
                        position: "top-center",
                        richColors: true,
                      });
                    }
                  }
                }}
              />
            ))}
        </div>

        {filteredEvents.length === 0 && selectedTab !== "organizers" && (
          <div className="py-12 text-center sm:py-16">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800 sm:h-20 sm:w-20">
              <FileText className="h-8 w-8 text-gray-600 sm:h-10 sm:w-10" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-400 sm:text-xl">
              No Events Found
            </h3>
            <p className="text-sm text-gray-500 sm:text-base">
              Try adjusting your search or filter
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 0 && (
          <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-xs text-gray-400 sm:text-sm">
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
                  <React.Fragment key={index}>
                    {page === "..." ? (
                      <span className="px-3 py-2 text-sm text-gray-500">
                        ...
                      </span>
                    ) : (
                      <button
                        className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all sm:px-4 ${
                          currentPage === page
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <button
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

      {/* Modal */}
      {showModal && selectedEvent && (
        <EventModal
          open={showModal}
          event={selectedEvent}
          onClose={() => setShowModal(false)}
        />
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
