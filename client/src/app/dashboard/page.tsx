"use client";
import React, { useEffect, useState } from "react";
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  BarChart3,
  Download,
} from "lucide-react";
import { useDeleteEvent, useGetOrganizerDetails } from "@/utils/query";
import DashboardSkeleton from "@/components/skeletons/dashboard-skeleton";
import { useRouter } from "next/navigation";
import { getCookie } from "@/utils/cookies";
import { toast } from "sonner";
import { useEdgeStore } from "@/lib/edgestore";

const OrganizerDashboard = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const { edgestore } = useEdgeStore();

  const { mutateAsync: handleDeleteEvent, isPending: isPendingDelete } =
    useDeleteEvent();
  const { data: organizerData, isLoading } = useGetOrganizerDetails();

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    const fetchCookies = async () => {
      const accessToken = await getCookie("access_token");
      const refreshToken = await getCookie("refresh_token");
      if (!accessToken || !refreshToken) {
        router.push("/auth/sign-in");
      }
    };
    void fetchCookies();
  }, [router]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!organizerData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        No Data
      </div>
    );
  }

  const filteredEvents = organizerData.data.recentEvents.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const StatCard: React.FC<{
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string;
    value: React.ReactNode;
    subtext?: string;
    color: string;
  }> = ({ icon: Icon, label, value, subtext, color }) => {
    const safeColor = color;
    const textColorClass = safeColor.replace(/^bg-/, "text-");

    return (
      <div className="rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-4 transition-all hover:border-gray-600 sm:rounded-2xl sm:p-6">
        <div className="mb-3 flex items-start justify-between sm:mb-4">
          <div
            className={`h-10 w-10 rounded-lg sm:h-12 sm:w-12 sm:rounded-xl ${safeColor} bg-opacity-20 flex items-center justify-center`}
          >
            {Icon && (
              <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${textColorClass}`} />
            )}
          </div>
          <TrendingUp className="h-4 w-4 text-green-400 sm:h-5 sm:w-5" />
        </div>
        <div className="mb-1 text-2xl font-bold sm:text-3xl">{value}</div>
        <div className="mb-1 text-xs text-gray-400 sm:text-sm">{label}</div>
        {subtext && <div className="text-xs text-gray-500">{subtext}</div>}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 lg:px-6 lg:py-8">
      {/* Welcome Section */}
      <div className="mb-6 sm:mb-8">
        <h2 className="mb-2 text-2xl font-bold lg:text-3xl">
          Selamat Datang, {organizerData.data.organizer.name}! 👋
        </h2>
        <p className="text-sm text-gray-400 sm:text-base">
          Disinilah kamu dapat mengelola semua acara yang kamu buat dan melihat
          statistiknya.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 sm:mb-8">
        <div className="scrollbar-hide flex gap-1 overflow-x-auto border-b border-gray-800 pb-px sm:gap-2">
          {["overview", "events", "analytics"].map((tab) => (
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

      {/* Overview Tab */}
      {selectedTab === "overview" && (
        <div className="space-y-6 sm:space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
            <StatCard
              icon={Calendar}
              label="Total Events"
              value={organizerData.data.totalEvents}
              color="bg-indigo-500"
            />
            <StatCard
              icon={Users}
              label="Total Registrations"
              value={organizerData.data.totalRegistrations}
              subtext={`${organizerData.data.registrationsByStatus.CONFIRMED} confirmed`}
              color="bg-purple-500"
            />
            <StatCard
              icon={DollarSign}
              label="Total Revenue"
              value={formatPrice(organizerData.data.totalRevenue)}
              color="bg-green-500"
            />
            <StatCard
              icon={CheckCircle}
              label="Confirmed"
              value={organizerData.data.registrationsByStatus.CONFIRMED}
              subtext={`${organizerData.data.registrationsByStatus.PENDING} pending`}
              color="bg-cyan-500"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <button
              className="group rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-4 text-left transition-all hover:border-indigo-500 sm:p-6"
              onClick={() => router.push("/dashboard/create-event")}
            >
              <Plus className="mb-2 h-6 w-6 text-indigo-400 transition-transform group-hover:scale-110 sm:mb-3 sm:h-8 sm:w-8" />
              <h3 className="mb-1 text-sm font-bold sm:text-base">
                Buat Event Baru
              </h3>
              <p className="text-xs text-gray-400 sm:text-sm">
                Mulai membuat acara baru sekarang!
              </p>
            </button>
            <button className="group rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-4 text-left transition-all hover:border-purple-500 sm:p-6">
              <BarChart3 className="mb-2 h-6 w-6 text-purple-400 transition-transform group-hover:scale-110 sm:mb-3 sm:h-8 sm:w-8" />
              <h3 className="mb-1 text-sm font-bold sm:text-base">
                Lihat Analytics
              </h3>
              <p className="text-xs text-gray-400 sm:text-sm">
                Pantau performa acara kamu secara real-time
              </p>
            </button>
            <button className="group rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-4 text-left transition-all hover:border-green-500 sm:p-6">
              <Download className="mb-2 h-6 w-6 text-green-400 transition-transform group-hover:scale-110 sm:mb-3 sm:h-8 sm:w-8" />
              <h3 className="mb-1 text-sm font-bold sm:text-base">
                Export Reports
              </h3>
              <p className="text-xs text-gray-400 sm:text-sm">
                Download event data dan laporan
              </p>
            </button>
          </div>

          {/* Recent Events */}
          <div>
            <h3 className="mb-2 text-lg font-bold sm:text-xl">
              Events Terbaru
            </h3>
            <p className={"text-muted-foreground mb-3 text-sm sm:mb-4"}>
              Menampilkan 5 acara terbaru yang telah kamu buat.
            </p>
            <div className="space-y-3 sm:space-y-4">
              {organizerData.data.recentEvents.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="overflow-hidden rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 transition-all hover:border-gray-600 sm:rounded-2xl"
                >
                  <div className="p-4 sm:p-6">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h4 className="mb-1 truncate text-base font-bold sm:text-lg">
                          {event.title}
                        </h4>
                        <p className="truncate text-xs text-gray-400 sm:text-sm">
                          {formatDate(event.startTime)} • {event.location}
                        </p>
                      </div>
                      <button className="ml-2 flex-shrink-0 rounded-lg bg-gray-800 p-1.5 transition-colors hover:bg-gray-700 sm:p-2">
                        <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                      <div>
                        <div className="text-lg font-bold text-indigo-400 sm:text-2xl">
                          {event.totalParticipants}
                        </div>
                        <div className="text-xs text-gray-500">Peserta</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-400 sm:text-2xl">
                          {event.ticketsSold}
                        </div>
                        <div className="text-xs text-gray-500">
                          Tiket terjual
                        </div>
                      </div>
                      <div>
                        <div className="truncate text-lg font-bold text-purple-400 sm:text-2xl">
                          {event.revenue > 0
                            ? formatPrice(event.revenue)
                            : "Tidak ada pendapatan"}
                        </div>
                        <div className="text-xs text-gray-500">Pendapatan</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Events Tab */}
      {selectedTab === "events" && (
        <div className="space-y-4 sm:space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-500 sm:left-4 sm:h-5 sm:w-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2.5 pr-3 pl-10 text-sm transition-colors focus:border-indigo-500 focus:outline-none sm:rounded-xl sm:py-3 sm:pr-4 sm:pl-12 sm:text-base"
              />
            </div>
            <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-gray-700 sm:rounded-xl sm:px-6 sm:py-3 sm:text-base">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
              Filter
            </button>
          </div>

          {/* Events List */}
          <div className="space-y-3 sm:space-y-4">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="overflow-hidden rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 transition-all hover:border-gray-600 sm:rounded-2xl"
              >
                <div className="p-4 sm:p-6">
                  <div className="mb-3 flex items-start justify-between sm:mb-4">
                    <div className="min-w-0 flex-1">
                      <h4 className="mb-2 text-lg font-bold sm:text-xl">
                        {event.title}
                      </h4>
                      <div className="flex flex-col gap-2 text-xs text-gray-400 sm:flex-row sm:flex-wrap sm:gap-4 sm:text-sm">
                        <span>📅 {formatDate(event.startTime)}</span>
                        <span>📍 {event.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 grid grid-cols-2 gap-2 sm:mb-4 sm:gap-4 lg:grid-cols-4">
                    <div className="rounded-lg bg-gray-800 p-2 text-center sm:p-3">
                      <div className="text-lg font-bold text-indigo-400 sm:text-xl">
                        {event.totalParticipants}
                      </div>
                      <div className="text-xs text-gray-500">Participants</div>
                    </div>
                    <div className="rounded-lg bg-gray-800 p-2 text-center sm:p-3">
                      <div className="text-lg font-bold text-green-400 sm:text-xl">
                        {event.ticketsSold}
                      </div>
                      <div className="text-xs text-gray-500">Tickets Sold</div>
                    </div>
                    <div className="col-span-2 rounded-lg bg-gray-800 p-2 text-center sm:p-3">
                      <div className="truncate text-lg font-bold text-purple-400 sm:text-xl">
                        {event.revenue > 0
                          ? formatPrice(event.revenue)
                          : "No Revenue"}
                      </div>
                      <div className="text-xs text-gray-500">Revenue</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold transition-colors hover:bg-indigo-500 sm:gap-2">
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    <button className="flex items-center gap-1.5 rounded-lg bg-gray-700 px-3 py-2 text-sm font-semibold transition-colors hover:bg-gray-600 sm:gap-2">
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button className="flex items-center gap-1.5 rounded-lg bg-gray-700 px-3 py-2 text-sm font-semibold transition-colors hover:bg-gray-600 sm:gap-2">
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Export</span>
                    </button>
                    <button
                      className="ml-auto flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold transition-colors hover:bg-red-500 sm:gap-2"
                      disabled={isPendingDelete}
                      onClick={async () => {
                        try {
                          const res = await handleDeleteEvent(event.id);
                          if (res === 200) {
                            toast.success("Event deleted successfully", {
                              position: "top-center",
                              richColors: true,
                            });
                            await edgestore.publicFiles.delete({
                              url: event.bannerUrl,
                            });
                          }
                        } catch (e) {
                          if (e instanceof Error) {
                            toast.error(`Error deleting event: ${e.message}`, {
                              position: "top-center",
                              richColors: true,
                            });
                          }
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {selectedTab === "analytics" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-center sm:rounded-2xl sm:p-8">
            <BarChart3 className="mx-auto mb-3 h-12 w-12 text-indigo-400 sm:mb-4 sm:h-16 sm:w-16" />
            <h3 className="mb-2 text-xl font-bold sm:text-2xl">
              Analytics Dashboard
            </h3>
            <p className="mb-4 text-sm text-gray-400 sm:mb-6 sm:text-base">
              Detailed analytics and insights coming soon...
            </p>
            <button className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold transition-all hover:from-indigo-500 hover:to-purple-500 sm:px-6 sm:py-3 sm:text-base">
              View Full Analytics
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
