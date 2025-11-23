"use client";
import React, { useState } from "react";
import {
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  MoreVertical,
  AlertTriangle,
  TrendingUp,
  FileText,
  Menu,
  X,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useGetAllOrganizersWithEvents,
  useLogout,
  useUpdateEventApproval,
} from "@/utils/query";
import type { Event } from "@/types/get-incoming-events.type";
import { toast } from "sonner";
import { RiLogoutBoxLine } from "react-icons/ri";
import { useRouter } from "next/navigation";

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

  const { data: adminData, isLoading } =
    useGetAllOrganizersWithEvents(currentPage);
  const { mutateAsync: handleUpdateApproval, isPending } =
    useUpdateEventApproval();
  const { mutateAsync: handleLogout, isPending: isPendingLogout } = useLogout();

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500 bg-opacity-20 text-yellow-200 border-yellow-500";
      case "APPROVED":
        return "bg-green-500 bg-opacity-20 text-green-100 border-green-500";
      case "REJECTED":
        return "bg-red-500 bg-opacity-20 text-red-200 border-red-500";
      default:
        return "bg-gray-500 bg-opacity-20 text-gray-200 border-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "APPROVED":
        return <CheckCircle className="h-4 w-4" />;
      case "REJECTED":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
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
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="overflow-hidden rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 transition-all hover:border-gray-600 sm:rounded-2xl"
            >
              <div className="p-4 sm:p-6">
                <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex items-start gap-3">
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold sm:gap-2 sm:px-3 sm:py-1.5 sm:text-sm ${getStatusColor(event.status)}`}
                      >
                        {getStatusIcon(event.status)}
                        <span>{event.status}</span>
                      </div>
                      {event.status === "PENDING" && (
                        <div className="bg-opacity-20 rounded-full bg-orange-500 px-2.5 py-1 text-xs font-semibold text-orange-200 sm:px-3 sm:py-1.5 sm:text-sm">
                          Butuh Tindakan
                        </div>
                      )}
                    </div>
                    <h3 className="mb-2 truncate text-lg font-bold sm:text-xl">
                      {event.title}
                    </h3>
                    <p className="mb-3 line-clamp-2 text-xs text-gray-400 sm:text-sm">
                      {event.description}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400 sm:gap-4 sm:text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        {formatDate(event.startTime)}
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        {event.organizer.name}
                      </span>
                      <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowModal(true);
                    }}
                    className="rounded-lg bg-gray-800 p-2 transition-colors hover:bg-gray-700 sm:self-start"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-3 sm:mb-6 sm:grid-cols-4 sm:gap-4">
                  <div className="rounded-lg bg-gray-800 p-2.5 text-center sm:p-3">
                    <div className="truncate text-base font-bold text-indigo-400 sm:text-xl">
                      {event.location}
                    </div>
                    <div className="text-xs text-gray-500">Location</div>
                  </div>
                  <div className="rounded-lg bg-gray-800 p-2.5 text-center sm:p-3">
                    <div className="text-base font-bold text-green-400 sm:text-xl">
                      {event.expectedAttendees}
                    </div>
                    <div className="text-xs text-gray-500">Expected</div>
                  </div>
                  <div className="rounded-lg bg-gray-800 p-2.5 text-center sm:p-3">
                    <div className="text-base font-bold text-purple-400 sm:text-xl">
                      {event.isPaid ? "PAID" : "FREE"}
                    </div>
                    <div className="text-xs text-gray-500">Type</div>
                  </div>
                  <div className="rounded-lg bg-gray-800 p-2.5 text-center sm:p-3">
                    <div className="text-xs font-bold text-gray-400 sm:text-sm">
                      {formatDate(event.submittedAt)}
                    </div>
                    <div className="text-xs text-gray-500">Submitted</div>
                  </div>
                </div>

                {event.status === "PENDING" && (
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <button
                      disabled={isPending}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-xl sm:py-3 sm:text-base"
                      onClick={async () => {
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
                        } catch (e) {
                          if (e instanceof Error) {
                            toast.error(`Error approving event: ${e.message}`, {
                              position: "top-center",
                              richColors: true,
                            });
                          }
                        }
                      }}
                    >
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      Approve
                    </button>
                    <button
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-red-500 sm:rounded-xl sm:py-3 sm:text-base"
                      onClick={async () => {
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
                        } catch (e) {
                          if (e instanceof Error) {
                            toast.error(`Error rejecting event: ${e.message}`, {
                              position: "top-center",
                              richColors: true,
                            });
                          }
                        }
                      }}
                    >
                      <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      Reject
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-gray-600 sm:flex-none sm:rounded-xl sm:py-3 sm:text-base">
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="hidden sm:inline">Details</span>
                    </button>
                  </div>
                )}

                {event.status === "REJECTED" && (
                  <div className="bg-opacity-20 border-opacity-30 mt-4 rounded-lg border border-red-500 bg-red-900 p-3 sm:rounded-xl sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400 sm:h-5 sm:w-5" />
                      <div>
                        <div className="mb-1 text-xs font-semibold text-red-400 sm:text-sm">
                          Rejection Reason:
                        </div>
                        <div className="text-xs text-gray-300 sm:text-sm">
                          The event does not comply with our community
                          guidelines. Please review the guidelines and consider
                          resubmitting after making necessary adjustments.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {event.status === "APPROVED" && (
                  <div className="flex gap-2 sm:gap-3">
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-gray-600 sm:rounded-xl sm:py-3 sm:text-base">
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      View Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
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
        <div className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 sm:rounded-3xl">
            <div className="bg-opacity-95 sticky top-0 border-b border-gray-700 bg-gray-900 p-4 backdrop-blur-md sm:p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold sm:text-xl">Event Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-lg bg-gray-800 p-2 transition-colors hover:bg-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="space-y-4 p-4 sm:p-6">
              <div>
                <div className="mb-1 text-xs text-gray-500 sm:text-sm">
                  Event Title
                </div>
                <div className="text-sm font-semibold sm:text-base">
                  {selectedEvent.title}
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs text-gray-500 sm:text-sm">
                  Description
                </div>
                <div className="text-sm text-gray-300 sm:text-base">
                  {selectedEvent.description}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div className="mb-1 text-xs text-gray-500 sm:text-sm">
                    Organizer
                  </div>
                  <div className="text-sm font-semibold sm:text-base">
                    {selectedEvent.organizer.name}
                  </div>
                  <div className="text-xs text-gray-400 sm:text-sm">
                    {selectedEvent.organizer.email}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-xs text-gray-500 sm:text-sm">
                    Location
                  </div>
                  <div className="text-sm font-semibold sm:text-base">
                    {selectedEvent.location}
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs text-gray-500 sm:text-sm">
                  Event Date & Time
                </div>
                <div className="text-sm sm:text-base">
                  {formatDateTime(selectedEvent.startTime)} -{" "}
                  {formatDateTime(selectedEvent.endTime)}
                </div>
              </div>
            </div>
          </div>
        </div>
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
