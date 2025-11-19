"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  AlertCircle,
  Calendar,
  CheckCheck,
  CheckCircle,
  Clock,
  Loader,
  MapPin,
  Ticket,
  Users,
  XIcon,
} from "lucide-react";
import { useCheckInUser, useGetRegistrationDetails } from "@/utils/query";
import Image from "next/image";

const CheckInContent = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const decoded = jwtDecode<{ qrToken: string; registrationId: string }>(
    token!,
  );

  const { data, isLoading: isLoadingRegistration } = useGetRegistrationDetails(
    decoded.registrationId,
  );
  const { mutateAsync: handleCheckIn, isPending } = useCheckInUser();

  const registrationData = data?.data;

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
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

  if (!registrationData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <p className="text-lg text-gray-400">No data</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950 text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500 opacity-20 mix-blend-multiply blur-3xl filter"></div>
        <div className="absolute top-1/3 right-1/4 h-96 w-96 animate-pulse rounded-full bg-emerald-500 opacity-20 mix-blend-multiply blur-3xl filter delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 h-96 w-96 animate-pulse rounded-full bg-indigo-500 opacity-20 mix-blend-multiply blur-3xl filter delay-2000"></div>
      </div>

      {/* Success Animation */}
      {showSuccess && (
        <div className="bg-opacity-75 animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm">
          <div className="animate-scaleIn rounded-3xl border border-green-500 bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-center shadow-2xl shadow-green-500/30">
            <div className="mx-auto mb-6 flex h-24 w-24 animate-bounce items-center justify-center rounded-full bg-green-500">
              <CheckCheck className="h-12 w-12 text-white" strokeWidth={3} />
            </div>
            <h2 className="mb-2 text-3xl font-bold">Check-in berhasil!</h2>
            <p className="text-gray-400">
              Selamat datang di event, {registrationData?.user.name}!
            </p>
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="bg-opacity-20 mb-4 inline-block rounded-full bg-indigo-500 px-4 py-2">
            <span className="text-sm font-semibold text-indigo-100">
              EVENT CHECK-IN
            </span>
          </div>
          <h1 className="mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text py-2 text-4xl font-bold text-transparent sm:text-5xl">
            Siap untuk Check-In?
          </h1>
          <p className="text-lg text-gray-400">
            Verifikasi dan konfirmasi kehadiran Anda di acara ini.
          </p>
        </div>

        {/* Main Card */}
        <div className="mb-6 overflow-hidden rounded-3xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl">
          {/* Event Banner */}
          <div className="relative h-48 overflow-hidden sm:h-64">
            <Image
              src={"https://picsum.photos/seed/picsum/1920/1080"}
              alt={registrationData.event.title}
              width={400}
              height={400}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 opacity-60`}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              {registrationData.checkedIn ? (
                <div className="bg-opacity-90 flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 backdrop-blur-md">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-bold">Checked In</span>
                </div>
              ) : (
                <div className="bg-opacity-90 flex items-center gap-2 rounded-full bg-yellow-500 px-4 py-2 backdrop-blur-md">
                  <Clock className="h-5 w-5" />
                  <span className="font-bold">Pending Check-in</span>
                </div>
              )}
            </div>

            <div className="absolute right-6 bottom-6 left-6">
              <span className="bg-opacity-20 mb-3 inline-block rounded-full bg-indigo-500 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                {registrationData.event.category}
              </span>
              <h2 className="text-2xl font-bold sm:text-3xl">
                {registrationData.event.title}
              </h2>
            </div>
          </div>

          {/* Event Details */}
          <div className="p-6 sm:p-8">
            {/* User Info */}
            <div className="bg-opacity-50 mb-6 rounded-xl border border-gray-700 bg-gray-800 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                <Users className="h-5 w-5 text-indigo-400" />
                Attendee Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Nama</span>
                  <span className="font-semibold">
                    {registrationData.user.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Email</span>
                  <span className="text-sm font-semibold">
                    {registrationData.user.email}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Registration ID</span>
                  <span className="text-xs font-semibold">
                    {registrationData.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Event Info Grid */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-opacity-20 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500">
                    <Calendar className="h-6 w-6 text-indigo-200" />
                  </div>
                  <div className="min-w-0">
                    <div className="mb-1 text-xs text-gray-400">
                      Tanggal Event
                    </div>
                    <div className="text-sm font-semibold">
                      {formatDate(registrationData.event.startTime)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatTime(registrationData.event.startTime)} -{" "}
                      {formatTime(registrationData.event.endTime)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-opacity-20 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-500">
                    <MapPin className="h-6 w-6 text-purple-200" />
                  </div>
                  <div className="min-w-0">
                    <div className="mb-1 text-xs text-gray-400">Lokasi</div>
                    <div className="text-sm font-semibold">
                      {registrationData.event.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Info */}
            <div className="mb-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500">
                    <Ticket className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Tipe Tiket</div>
                    <div className="text-lg font-bold">
                      {registrationData.ticket.name}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Status</div>
                  <div className="text-lg font-bold text-green-400">
                    {registrationData.status}
                  </div>
                </div>
              </div>

              {registrationData.payment && (
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-gray-400">Jumlah dibayarkan</div>
                    <div className="text-xl font-bold text-green-400">
                      {formatPrice(registrationData.payment.amount)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Check-in Status */}
            {registrationData.checkedIn ? (
              <div className="bg-opacity-20 border-opacity-30 mb-6 rounded-xl border border-green-500 bg-green-900 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-bold text-green-400">
                      Check-in Berhasil!
                    </h3>
                    <p className="mb-3 text-gray-300">
                      Check-in Anda telah berhasil. Selamat menikmati acara ini!
                    </p>
                    <div className="text-sm text-gray-400">
                      Checked in pada{" "}
                      {new Date().toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-opacity-20 border-opacity-30 mb-6 rounded-xl border border-yellow-500 bg-yellow-900 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-500">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-bold text-yellow-400">
                      Check-in diperlukan!
                    </h3>
                    <p className="text-gray-300">
                      Mohon lakukan check-in untuk mengonfirmasi kehadiran Anda
                      di acara ini.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={async () => {
                const res = await handleCheckIn(token!);
                if (res) {
                  setIsCheckedIn(true);
                  setShowSuccess(true);
                  setTimeout(() => {
                    setShowSuccess(false);
                  }, 3000);
                }
              }}
              disabled={registrationData.checkedIn || isPending}
              className={`flex w-full items-center justify-center gap-3 rounded-xl px-8 py-5 text-lg font-bold shadow-lg transition-all ${
                registrationData.checkedIn ||
                new Date(registrationData.event.startTime).toDateString() !==
                  new Date().toDateString()
                  ? "cursor-not-allowed bg-gray-700 text-gray-500"
                  : isPending
                    ? "cursor-wait bg-indigo-600"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-500/30 hover:from-indigo-500 hover:to-purple-500"
              }`}
            >
              {isPending ? (
                <>
                  <Loader className="h-6 w-6 animate-spin" />
                  Checking In...
                </>
              ) : registrationData.checkedIn ? (
                <>
                  <CheckCircle className="h-6 w-6" />
                  Sudah Checked In
                </>
              ) : new Date(registrationData.event.startTime).toDateString() !==
                new Date().toDateString() ? (
                <>
                  <XIcon className="h-6 w-6" />
                  Belum Saatnya Check-In
                </>
              ) : (
                <>
                  <CheckCircle className="h-6 w-6" />
                  Check-In Sekarang
                </>
              )}
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-6">
          <h3 className="mb-3 font-bold">Butuh bantuan?</h3>
          <p className="text-sm text-gray-400">
            Jika Anda mengalami masalah saat check-in, silakan hubungi tim
            dukungan kami di{" "}
            <span className={"text-blue-300 underline"}>
              ranggavfxartwork@gmail.com
            </span>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CheckInContent;
