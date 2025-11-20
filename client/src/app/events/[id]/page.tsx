"use client";
import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  Share2,
  Heart,
  Ticket,
  CheckCircle,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useGetEventDetails, useMakePayment, useMe } from "@/utils/query";
import { toast } from "sonner";

const EventDetail = () => {
  const router = useRouter();
  const { id } = useParams();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const { data: eventData, isLoading } = useGetEventDetails(String(id));
  const { data: session, isLoading: isLoadingSession } = useMe();
  const { mutateAsync: handlePayment, isPending, error } = useMakePayment();

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      fullDate: date.toLocaleDateString("en-US", {
        weekday: "long",
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

  if (isLoading || isLoadingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <div className="text-sm text-gray-400">Memuat acara...</div>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return <div>No Event Details</div>;
  }

  const startDate = formatDate(eventData.startTime);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header Navigation */}
      <div className="bg-opacity-95 sticky top-0 z-50 border-b border-gray-800 bg-gray-950 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <button
              className="flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Kembali ke Beranda</span>
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 transition-colors hover:bg-gray-700">
                <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 transition-colors hover:bg-gray-700">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative h-64 overflow-hidden sm:h-80 md:h-96">
        <Image
          src={eventData.bannerUrl}
          alt={eventData.title}
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/50 to-gray-950"></div>

        {/* Date Badge */}
        <div className="absolute top-4 left-4 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 p-4 text-center shadow-2xl sm:top-8 sm:left-8 sm:rounded-2xl sm:p-6">
          <div className="mb-1 text-3xl font-bold sm:text-5xl">
            {startDate.day}
          </div>
          <div className="text-sm font-semibold tracking-wider sm:text-lg">
            {startDate.month}
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
          <span className="bg-opacity-80 rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs font-semibold backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm">
            {eventData.category}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
          {/* Main Content */}
          {error && (
            <div className="rounded-xl border border-red-800 bg-red-900/30 p-4 text-red-300 lg:col-span-3">
              <strong>Error:</strong> {error.message}
            </div>
          )}
          <div className="space-y-6 sm:space-y-8 lg:col-span-2">
            {/* Title and Description */}
            <div>
              <h1 className="mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-3xl font-bold text-transparent sm:mb-4 sm:text-4xl md:text-5xl">
                {eventData.title}
              </h1>
              <p className="text-base leading-relaxed text-gray-400 sm:text-lg">
                {eventData.description}
              </p>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:rounded-2xl sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="bg-opacity-20 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 sm:h-14 sm:w-14">
                    <Calendar className="h-5 w-5 text-indigo-200 sm:h-7 sm:w-7" />
                  </div>
                  <div className="min-w-0">
                    <div className="mb-1 text-xs text-gray-500 sm:text-sm">
                      Tanggal
                    </div>
                    <div className="truncate text-sm font-semibold sm:text-lg">
                      {startDate.fullDate}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:rounded-2xl sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="bg-opacity-20 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-500 sm:h-14 sm:w-14">
                    <Clock className="h-5 w-5 text-purple-200 sm:h-7 sm:w-7" />
                  </div>
                  <div className="min-w-0">
                    <div className="mb-1 text-xs text-gray-500 sm:text-sm">
                      Waktu
                    </div>
                    <div className="text-sm font-semibold sm:text-lg">
                      {formatTime(eventData.startTime)} -{" "}
                      {formatTime(eventData.endTime)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:rounded-2xl sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="bg-opacity-20 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-pink-500 sm:h-14 sm:w-14">
                    <MapPin className="h-5 w-5 text-pink-200 sm:h-7 sm:w-7" />
                  </div>
                  <div className="min-w-0">
                    <div className="mb-1 text-xs text-gray-500 sm:text-sm">
                      Lokasi
                    </div>
                    <div className="truncate text-sm font-semibold sm:text-lg">
                      {eventData.location}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:rounded-2xl sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="bg-opacity-20 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500 sm:h-14 sm:w-14">
                    <Users className="h-5 w-5 text-cyan-100 sm:h-7 sm:w-7" />
                  </div>
                  <div className="min-w-0">
                    <div className="mb-1 text-xs text-gray-500 sm:text-sm">
                      Organizer
                    </div>
                    <div className="truncate text-sm font-semibold sm:text-lg">
                      {eventData.organizer.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 p-6 sm:rounded-2xl sm:p-8">
              <h3 className="mb-4 text-lg font-bold sm:mb-6 sm:text-xl">
                Event Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
                <div className="text-center">
                  <div className="mb-2 text-2xl font-bold text-indigo-400 sm:text-3xl">
                    {eventData.stats.totalRegistrations}
                  </div>
                  <div className="text-xs text-gray-500 sm:text-sm">
                    Total Registrasi
                  </div>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-2xl font-bold text-green-400 sm:text-3xl">
                    {eventData.stats.confirmedCount}
                  </div>
                  <div className="text-xs text-gray-500 sm:text-sm">
                    Diterima
                  </div>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-2xl font-bold text-purple-400 sm:text-3xl">
                    {eventData.stats.checkedInCount}
                  </div>
                  <div className="text-xs text-gray-500 sm:text-sm">
                    Checked In
                  </div>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-2xl font-bold text-pink-400 sm:text-3xl">
                    {eventData.stats.remainingTickets}
                  </div>
                  <div className="text-xs text-gray-500 sm:text-sm">
                    Tiket tersisa
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Ticket Selection */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <div className="rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 p-5 sm:rounded-2xl sm:p-6">
                <h3 className="mb-5 text-xl font-bold sm:mb-6 sm:text-2xl">
                  Pilih Tiket
                </h3>

                <div className="mb-5 space-y-3 sm:mb-6 sm:space-y-4">
                  {eventData.tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket.id)}
                      className={`cursor-pointer rounded-xl border-2 p-3 transition-all sm:p-4 ${
                        selectedTicket === ticket.id
                          ? "bg-opacity-10 border-indigo-500 bg-indigo-500"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Ticket className="h-4 w-4 text-indigo-400 sm:h-5 sm:w-5" />
                          <span className="text-sm font-semibold sm:text-base">
                            {ticket.name}
                          </span>
                        </div>
                        {selectedTicket === ticket.id && (
                          <CheckCircle className="h-4 w-4 text-teal-400 sm:h-5 sm:w-5" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-white/90 sm:text-2xl">
                          {formatPrice(ticket.price)}
                        </span>
                        <span className="text-xs text-gray-300 sm:text-sm">
                          {ticket.quantity} tersedia
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  disabled={!selectedTicket}
                  className={`w-full rounded-xl py-3 text-base font-bold transition-all sm:py-4 sm:text-lg ${
                    selectedTicket
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30 hover:from-indigo-500 hover:to-purple-500"
                      : "cursor-not-allowed bg-gray-800 text-gray-600"
                  }`}
                  onClick={async () => {
                    if (!session || !selectedTicket) return;
                    if (!eventData.isPaid) {
                      const res = await handlePayment({
                        eventId: eventData.id,
                        ticketId: selectedTicket,
                        userId: session.id,
                      });
                      if (res) {
                        localStorage.setItem(
                          "registrationId",
                          res.data.registration.id,
                        );
                      }
                      toast.success("Berhasil mendaftar acara!", {
                        position: "top-center",
                        richColors: true,
                      });
                      router.push("/");
                    } else {
                      const res = await handlePayment({
                        eventId: eventData.id,
                        ticketId: selectedTicket,
                        userId: session.id,
                      });
                      if (res) {
                        localStorage.setItem(
                          "registrationId",
                          res.data.registration.id,
                        );
                      }
                      if (res?.data.payment.redirectUrl) {
                        router.push(res.data.payment.redirectUrl);
                      }
                    }
                  }}
                >
                  {selectedTicket ? "Daftar Sekarang" : "Pilih tiket dulu"}
                </button>

                <div className="mt-5 border-t border-gray-800 pt-5 sm:mt-6 sm:pt-6">
                  <div className="flex items-center gap-2 text-xs text-gray-400 sm:text-sm">
                    <UserCheck className="h-4 w-4" />
                    <span>
                      {eventData.stats.confirmedCount} orang telah mendaftar
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
