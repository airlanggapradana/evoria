"use client";
import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  GraduationCap,
  Calendar,
  MapPin,
  Ticket,
  CreditCard,
  QrCode,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  X,
  Download,
} from "lucide-react";
import type { EventElement } from "@/types/get-user-details.type";
import { useGetUserDetails } from "@/utils/query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MyTicketSkeleton from "@/components/skeletons/my-tickets-skeleton";
import QRCode from "react-qr-code";
import { getCookie } from "@/utils/cookies";

const MyTicketsPage = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("all");
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] =
    useState<EventElement | null>(null);

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

  const handleShowQR = (registration: EventElement) => {
    setSelectedRegistration(registration);
    setShowQRModal(true);
  };

  const handleCloseModal = () => {
    setShowQRModal(false);
    setSelectedRegistration(null);
  };

  const { data: userData, isLoading } = useGetUserDetails();

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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

  const getStatusColor = (status: string) => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case "CONFIRMED":
        return "bg-teal-500 bg-opacity-20 text-teal-100 border-teal-500";
      case "PENDING":
        return "bg-yellow-500 bg-opacity-20 text-yellow-400 border-yellow-500";
      case "CANCELLED":
        return "bg-red-500 bg-opacity-20 text-red-400 border-red-500";
      default:
        return "bg-gray-500 bg-opacity-20 text-gray-400 border-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case "CONFIRMED":
        return <CheckCircle className="h-4 w-4" />;
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case "SUCCESS":
        return "text-green-400";
      case "PENDING":
        return "text-yellow-400";
      case "FAILED":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const formatPaymentMethod = (method: string) => {
    return method
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const categoryGradients = {
    Entertainment: "from-pink-500 to-rose-500",
    Business: "from-cyan-500 to-blue-500",
    Technology: "from-emerald-500 to-teal-500",
  };

  if (isLoading) {
    return <MyTicketSkeleton />;
  }

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="animate-pulse text-gray-500">No Data</div>
      </div>
    );
  }

  const filteredEvents = (userData.data.events ?? []).filter((reg) => {
    if (selectedTab === "all") return true;
    if (selectedTab === "upcoming")
      return new Date(reg.event.startTime) > new Date() && !reg.checkedIn;
    if (selectedTab === "past")
      return new Date(reg.event.startTime) <= new Date() && reg.checkedIn;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-opacity-95 sticky top-0 z-50 border-b border-gray-800 bg-gray-950 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <button
              onClick={() => router.push("/")}
              className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-700"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Profile Card */}
        <div className="mb-8 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 p-6 sm:rounded-3xl sm:p-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-3xl font-bold sm:h-24 sm:w-24 sm:text-4xl">
              {userData.data.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
                {userData.data.name}
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{userData.data.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <User className="h-4 w-4" />
                  <span className="text-sm capitalize">
                    {userData.data.role === "USER"
                      ? "Pengguna"
                      : userData.data.role === "ORGANIZER"
                        ? "Penyelenggara"
                        : "Admin"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Ticket className="h-4 w-4" />
                  <span className="text-sm">
                    {userData.data.events?.length ?? 0} Events Registered
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="flex gap-2 border-b border-gray-800 sm:gap-4">
            {["all", "upcoming", "past"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-3 font-semibold capitalize transition-all sm:px-6 ${
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

        {/* Events List */}
        <div className="space-y-6">
          {filteredEvents.map((registration) => (
            <div
              key={registration.registrationId}
              className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 transition-all duration-300 hover:border-gray-700 sm:rounded-3xl"
            >
              <div className="flex flex-col md:flex-row">
                {/* Event Image */}
                <div className="relative md:w-1/3">
                  <Image
                    src={registration.event.bannerUrl}
                    alt={registration.event.title}
                    width={400}
                    height={400}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${categoryGradients[registration.event.category as keyof typeof categoryGradients] ?? ""} opacity-20`}
                  ></div>
                  <div className="relative flex h-48 items-center justify-center p-6 md:h-full">
                    <div className="text-center">
                      <div
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 ${getStatusColor(registration.status)} backdrop-blur-md`}
                      >
                        {getStatusIcon(registration.status)}
                        <span className="text-sm font-semibold capitalize">
                          {registration.status}
                        </span>
                      </div>
                      {registration.checkedIn && (
                        <div className="bg-opacity-20 mt-4 inline-flex items-center gap-2 rounded-full border border-green-500 bg-green-500 px-4 py-2 text-green-100 backdrop-blur-md">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-semibold">
                            Checked In
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-6 sm:p-8 md:w-2/3">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <span className="mb-3 inline-block rounded-full bg-gray-800 px-3 py-1 text-xs font-semibold text-gray-300">
                        {registration.event.category}
                      </span>
                      <h3 className="mb-2 text-xl font-bold transition-colors group-hover:text-indigo-400 sm:text-2xl">
                        {registration.event.title}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-sm text-gray-400 sm:text-base">
                        {registration.event.description}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-800">
                        <Calendar className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-gray-500">Date & Time</div>
                        <div className="truncate text-sm font-semibold">
                          {formatDate(registration.event.startTime)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-800">
                        <MapPin className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-gray-500">Location</div>
                        <div className="truncate text-sm font-semibold">
                          {registration.event.location}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-800">
                        <Ticket className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-gray-500">Ticket Type</div>
                        <div className="text-sm font-semibold">
                          {registration.ticket.name}
                        </div>
                      </div>
                    </div>

                    {registration.payment && (
                      <div className="flex items-center gap-3 text-gray-300">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-800">
                          <CreditCard className="h-5 w-5 text-indigo-400" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs text-gray-500">Payment</div>
                          <div className="text-sm font-semibold">
                            {formatPrice(registration.payment.amount)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-stretch justify-between gap-3 border-t border-gray-800 pt-6 sm:flex-row sm:items-center">
                    <div className="text-xs text-gray-500">
                      Registered on {formatDate(registration.createdAt)}
                    </div>
                    <div className="flex gap-2 sm:gap-3">
                      <button
                        onClick={() => handleShowQR(registration)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-700 sm:flex-none sm:rounded-xl sm:px-6 sm:py-3"
                      >
                        <QrCode className="h-4 w-4" />
                        <span className="hidden sm:inline">Show QR</span>
                        <span className="sm:hidden">QR Code</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-800">
              <Calendar className="h-10 w-10 text-gray-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-400">
              Tidak ada acara
            </h3>
            <p className="text-gray-500">
              Anda belum mendaftar untuk acara apa pun di kategori ini.
            </p>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQRModal && selectedRegistration && (
        <div className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black p-4 backdrop-blur-sm">
          <div className="animate-scale-in w-full max-w-md overflow-hidden rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 sm:rounded-3xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-700 p-6">
              <h3 className="text-xl font-bold">Event Ticket</h3>
              <button
                onClick={handleCloseModal}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 transition-colors hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-6 p-6">
              {/* Event Info */}
              <div className="text-center">
                <h4 className="mb-2 text-lg font-bold">
                  {selectedRegistration.event.title}
                </h4>
                <p className="mb-4 text-sm text-gray-400">
                  {selectedRegistration.event.location}
                </p>
                <div className="inline-flex items-center gap-2 rounded-full bg-gray-800 px-4 py-2 text-sm">
                  <Calendar className="h-4 w-4 text-indigo-400" />
                  <span>
                    {formatDate(selectedRegistration.event.startTime)}
                  </span>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex items-center justify-center rounded-2xl bg-white p-8">
                <div className="text-center">
                  <div
                    style={{
                      height: "auto",
                      margin: "0 auto",
                      maxWidth: 128,
                      width: "100%",
                    }}
                  >
                    <QRCode
                      size={256}
                      style={{
                        height: "auto",
                        maxWidth: "100%",
                        width: "100%",
                      }}
                      value={selectedRegistration.qrCodeUrl}
                      viewBox={`0 0 256 256`}
                    />
                  </div>
                  <p className="mt-4 text-xs font-semibold text-gray-800">
                    ID: {selectedRegistration.registrationId}
                  </p>
                </div>
              </div>

              {/* Ticket Details */}
              <div className="space-y-3 rounded-xl bg-gray-800 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Ticket Type</span>
                  <span className="font-semibold">
                    {selectedRegistration.ticket.name}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Status</span>
                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(selectedRegistration.status)}`}
                  >
                    {getStatusIcon(selectedRegistration.status)}
                    <span className="capitalize">
                      {selectedRegistration.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Check-in</span>
                  <span
                    className={`font-semibold ${selectedRegistration.checkedIn ? "text-green-400" : "text-yellow-400"}`}
                  >
                    {selectedRegistration.checkedIn ? "Checked In" : "Not Yet"}
                  </span>
                </div>
                {selectedRegistration.payment && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Payment Method</span>
                      <span className="font-semibold">
                        {formatPaymentMethod(
                          selectedRegistration.payment.method,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Payment Status</span>
                      <span
                        className={`font-semibold ${getPaymentStatusColor(selectedRegistration.payment.status)}`}
                      >
                        {selectedRegistration.payment.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-700 pt-3 text-sm">
                      <span className="text-gray-400">Amount Paid</span>
                      <span className="font-semibold text-green-400">
                        {formatPrice(selectedRegistration.payment.amount)}
                      </span>
                    </div>
                  </>
                )}
                {!selectedRegistration.payment &&
                  selectedRegistration.ticket.price === 0 && (
                    <div className="flex items-center justify-between border-t border-gray-700 pt-3 text-sm">
                      <span className="text-gray-400">Ticket Price</span>
                      <span className="font-semibold text-green-400">FREE</span>
                    </div>
                  )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-800 px-4 py-3 text-sm font-semibold transition-colors hover:bg-gray-700">
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <button
                  onClick={handleCloseModal}
                  className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold shadow-lg shadow-indigo-500/30 transition-all hover:from-indigo-500 hover:to-purple-500"
                >
                  Tutup
                </button>
              </div>

              {/* Instructions */}
              <div className="pt-2 text-center text-xs text-gray-500">
                Tunjukkan kode QR ini saat check-in di acara.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;
