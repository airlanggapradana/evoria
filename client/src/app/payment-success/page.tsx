"use client";
import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Calendar,
  MapPin,
  Ticket,
  Download,
  Share2,
  ArrowRight,
  Sparkles,
  Mail,
  Bell,
} from "lucide-react";
import { useGetRegistrationDetails, useMe } from "@/utils/query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SuccessSkeleton from "@/components/skeletons/success-skeleton";

const PaymentSuccessPage = () => {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);
  const [animated, setAnimated] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);

  const { data, isLoading, error } = useGetRegistrationDetails(registrationId!);
  const { data: session, isLoading: isLoadingSession } = useMe();

  useEffect(() => {
    if (!isLoadingSession && !session) {
      router.push("/auth/sign-in");
    }
    const regId = localStorage.getItem("registrationId");
    if (regId) {
      setRegistrationId(regId);
    }
    setAnimated(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }, [isLoadingSession, router, session]);

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
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

  const formatPaymentMethod = (method: string) => {
    const methods = {
      qris: "QRIS",
      bank_transfer: "Bank Transfer",
      e_wallet: "E-Wallet",
      credit_card: "Credit Card",
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return methods[method] ?? method.toUpperCase();
  };

  if (isLoading) {
    return <SuccessSkeleton />;
  }

  if (!data) {
    return <div>No Data</div>;
  }

  const registration = data.data;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950 text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500 opacity-20 mix-blend-multiply blur-3xl filter"></div>
        <div className="absolute top-1/3 right-1/4 h-96 w-96 animate-pulse rounded-full bg-pink-500 opacity-20 mix-blend-multiply blur-3xl filter delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 h-96 w-96 animate-pulse rounded-full bg-indigo-500 opacity-20 mix-blend-multiply blur-3xl filter delay-2000"></div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0">
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="animate-fall absolute h-2 w-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                backgroundColor: ["#8b5cf6", "#ec4899", "#06b6d4", "#10b981"][
                  Math.floor(Math.random() * 4)
                ],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Success Icon */}
        <div
          className={`mb-8 text-center transition-all duration-1000 sm:mb-12 ${animated ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}`}
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 animate-pulse rounded-full bg-green-500 opacity-50 blur-2xl"></div>
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-2xl sm:h-32 sm:w-32">
              <CheckCircle
                className="h-12 w-12 text-white sm:h-16 sm:w-16"
                strokeWidth={3}
              />
            </div>
          </div>

          <h1 className="mt-8 mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text py-2 text-3xl font-bold text-transparent sm:text-5xl">
            {registration.payment
              ? "Payment Successful!"
              : "Registration Successful!"}
          </h1>
          <p className="mb-2 text-lg text-gray-400 sm:text-xl">
            {registration.payment
              ? "Your ticket has been confirmed"
              : "You're all set for the event"}
          </p>
          <div className="bg-opacity-50 inline-flex items-center gap-2 rounded-full bg-gray-800 px-4 py-2 text-sm text-gray-300 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span>
              {registration.payment
                ? `Transaction ID: ${registration.payment.transactionId.slice(0, 8)}...`
                : `Registration ID: ${registration.id.slice(0, 8)}...`}
            </span>
          </div>
        </div>

        {/* Main Content Card */}
        <div
          className={`overflow-hidden rounded-3xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl transition-all delay-300 duration-1000 ${animated ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          {/* Event Banner */}
          <div className="relative h-48 overflow-hidden sm:h-64">
            <Image
              src={"https://picsum.photos/seed/picsum/1920/1080"}
              alt={registration.event.title}
              width={400}
              height={400}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
            <div className="absolute right-6 bottom-6 left-6">
              <span className="bg-opacity-90 mb-3 inline-block rounded-full bg-pink-500 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                {registration.event.category}
              </span>
              <h2 className="text-2xl font-bold sm:text-3xl">
                {registration.event.title}
              </h2>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-6 p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-opacity-20 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500">
                    <Calendar className="h-6 w-6 text-indigo-200" />
                  </div>
                  <div className="min-w-0">
                    <div className="mb-1 text-xs text-gray-400">Event Date</div>
                    <div className="truncate text-sm font-semibold">
                      {formatDate(registration.event.startTime)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatTime(registration.event.startTime)} -{" "}
                      {formatTime(registration.event.endTime)}
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
                    <div className="mb-1 text-xs text-gray-400">Location</div>
                    <div className="truncate text-sm font-semibold">
                      {registration.event.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Info */}
            <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500">
                    <Ticket className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Ticket Type</div>
                    <div className="text-lg font-bold">
                      {registration.ticket.name}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Status</div>
                  <div className="text-lg font-bold text-green-400">
                    {registration.status}
                  </div>
                </div>
              </div>

              {registration.payment ? (
                <div className="space-y-3 border-t border-gray-700 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-400">Payment Method</div>
                    <div className="font-semibold">
                      {formatPaymentMethod(registration.payment.method)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-400">Payment Status</div>
                    <div className="font-semibold text-green-400">
                      {registration.payment.status}
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-700 pt-3">
                    <div className="text-gray-400">Total Paid</div>
                    <div className="text-2xl font-bold text-green-400">
                      {formatPrice(registration.payment.amount)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between border-t border-gray-700 pt-4">
                  <div className="text-gray-400">Ticket Price</div>
                  <div className="text-2xl font-bold text-green-400">FREE</div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-2">
              <button className="group flex items-center justify-center gap-2 rounded-xl bg-gray-800 px-6 py-4 font-semibold transition-all hover:bg-gray-700">
                <Download className="h-5 w-5 transition-transform group-hover:scale-110" />
                Download Ticket
              </button>
              <button className="group flex items-center justify-center gap-2 rounded-xl bg-gray-800 px-6 py-4 font-semibold transition-all hover:bg-gray-700">
                <Share2 className="h-5 w-5 transition-transform group-hover:scale-110" />
                Share Event
              </button>
            </div>

            {/* Primary CTA */}
            <button
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-lg font-bold shadow-lg shadow-indigo-500/30 transition-all hover:from-indigo-500 hover:to-purple-500"
              onClick={() => router.push("my-tickets")}
            >
              View My Tickets
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div
          className={`mt-8 space-y-4 transition-all delay-500 duration-1000 ${animated ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          {/* Confirmation Email */}
          <div className="rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-6">
            <div className="flex items-start gap-4">
              <div className="bg-opacity-20 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500">
                <Mail className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-lg font-bold">
                  Confirmation Email Sent
                </h3>
                <p className="text-sm text-gray-400">
                  We&#39;ve sent a confirmation email to{" "}
                  <span className="font-semibold text-white">
                    {registration.user.email}
                  </span>{" "}
                  with your ticket details and QR code.
                </p>
              </div>
            </div>
          </div>

          {/* Reminder */}
          <div className="rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-6">
            <div className="flex items-start gap-4">
              <div className="bg-opacity-20 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-500">
                <Bell className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-lg font-bold">Event Reminder</h3>
                <p className="text-sm text-gray-400">
                  Don&#39;t forget to arrive 30 minutes early. Bring your ticket
                  QR code for quick check-in at the entrance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Need help? Contact our support team at support@campusevents.com
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccessPage;
