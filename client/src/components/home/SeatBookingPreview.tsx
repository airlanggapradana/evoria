"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SeatBookingPreview = () => {
  // Seat state mockup: seat IDs 1 to 40
  // Some booked seats, some selected
  const [selectedSeats, setSelectedSeats] = useState<number[]>([14, 15]);
  const bookedSeats = [3, 7, 8, 18, 22, 29, 30, 35];

  const pricePerTicket = 450000;
  const serviceFee = 25000;

  const toggleSeat = (seatId: number) => {
    if (bookedSeats.includes(seatId)) return;
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      } else {
        if (prev.length >= 6) {
          toast.warning("Maksimal 6 tiket per transaksi.", {
            position: "top-center",
          });
          return prev;
        }
        return [...prev, seatId];
      }
    });
  };

  const handleDecreaseQuantity = () => {
    if (selectedSeats.length > 1) {
      setSelectedSeats(selectedSeats.slice(0, -1));
    }
  };

  const handleIncreaseQuantity = () => {
    // Find next available seat
    for (let i = 1; i <= 42; i++) {
      if (!bookedSeats.includes(i) && !selectedSeats.includes(i)) {
        if (selectedSeats.length >= 6) {
          toast.warning("Maksimal 6 tiket per transaksi.", {
            position: "top-center",
          });
          return;
        }
        setSelectedSeats([...selectedSeats, i]);
        break;
      }
    }
  };

  const totalTickets = selectedSeats.length;
  const subtotal = totalTickets * pricePerTicket;
  const totalAmount = totalTickets > 0 ? subtotal + serviceFee : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full bg-violet-100/40 blur-[140px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center sm:mb-16">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/80 px-4 py-1.5 text-xs font-bold tracking-widest text-violet-700 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
            <span>BOOK YOUR TICKETS</span>
            <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Select Seats & Book Tickets
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
            Experience interactive seat selection, instant transparent pricing, and instant
            digital QR tickets right on your mobile.
          </p>
        </div>

        {/* Showcase Grid Container */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Seat Map Controller (3 cols) */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 lg:col-span-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Seat Map</h3>
              <p className="mt-1 text-xs text-slate-500">
                Click any seat to customize your booking
              </p>

              {/* Seat Legend */}
              <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                  <span className="h-3.5 w-3.5 rounded-full border border-violet-200 bg-violet-100" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                  <span className="h-3.5 w-3.5 rounded-full bg-violet-600 shadow-sm shadow-violet-500/40" />
                  <span>Selected ({selectedSeats.length})</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                  <span className="h-3.5 w-3.5 rounded-full bg-slate-300" />
                  <span>Booked</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mt-8 border-t border-slate-100 pt-6">
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Quantity
                </span>
                <div className="mt-2.5 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-2">
                  <button
                    onClick={handleDecreaseQuantity}
                    disabled={selectedSeats.length <= 1}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-700 shadow-xs transition hover:bg-slate-100 disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-base font-extrabold text-slate-900">
                    {selectedSeats.length}
                  </span>
                  <button
                    onClick={handleIncreaseQuantity}
                    disabled={selectedSeats.length >= 6}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-xs transition hover:bg-violet-700 disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-2.5">
              <Button
                onClick={() => {
                  const eventsSection = document.getElementById("events");
                  if (eventsSection) {
                    eventsSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="h-11 w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 font-bold text-white shadow-md shadow-violet-500/25 transition-all hover:shadow-lg hover:shadow-violet-500/35"
              >
                Continue Booking
              </Button>
              <button
                onClick={() => {
                  const eventsSection = document.getElementById("events");
                  if (eventsSection) {
                    eventsSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="w-full py-2 text-center text-xs font-semibold text-slate-500 hover:text-violet-600"
              >
                ← Back to Events
              </button>
            </div>
          </div>

          {/* Center Column: Interactive Seat Grid Mockup (5 cols) */}
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-100 bg-gradient-to-b from-slate-50/70 to-white p-6 shadow-xl shadow-slate-200/50 lg:col-span-5">
            {/* Stage Banner */}
            <div className="relative mb-8 w-full max-w-xs">
              <div className="flex h-9 items-center justify-center rounded-full bg-slate-800 text-xs font-bold tracking-widest text-white uppercase shadow-md">
                STAGE
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-gradient-to-r from-transparent via-violet-400 to-transparent opacity-60" />
            </div>

            {/* Seat Grid */}
            <div className="grid grid-cols-7 gap-2.5 sm:gap-3">
              {Array.from({ length: 42 }).map((_, index) => {
                const seatId = index + 1;
                const isBooked = bookedSeats.includes(seatId);
                const isSelected = selectedSeats.includes(seatId);

                return (
                  <button
                    key={seatId}
                    disabled={isBooked}
                    onClick={() => toggleSeat(seatId)}
                    title={`Seat ${seatId} - ${
                      isBooked ? "Booked" : isSelected ? "Selected" : "Available"
                    }`}
                    className={`h-8 w-8 sm:h-9 sm:w-9 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isBooked
                        ? "cursor-not-allowed bg-slate-200 text-slate-400"
                        : isSelected
                        ? "scale-110 bg-violet-600 text-white shadow-md shadow-violet-500/35"
                        : "bg-violet-100/70 text-violet-900 hover:scale-105 hover:bg-violet-200"
                    }`}
                  >
                    {seatId}
                  </button>
                );
              })}
            </div>

            <p className="mt-8 text-center text-xs text-slate-500">
              Interactive theater seating plan. Selected seats:{" "}
              <span className="font-bold text-violet-600">
                {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
              </span>
            </p>
          </div>

          {/* Right Column: Booking Summary & Digital Mobile Ticket Preview (4 cols) */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            {/* Booking Summary Card */}
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/50">
              <h3 className="text-base font-bold text-slate-900">Booking Summary</h3>

              {/* Event Mini Info */}
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=200&q=80"
                    alt="The Weeknd Live in Concert"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="truncate text-sm font-bold text-slate-900">
                    The Weeknd Live in Concert
                  </h4>
                  <p className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    24 May, 2024 • 7:30 PM
                  </p>
                  <p className="flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    Madison Square Garden, NY
                  </p>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Tickets ({totalTickets})</span>
                  <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Service Fee</span>
                  <span className="font-semibold text-slate-900">{formatPrice(serviceFee)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2 text-sm font-extrabold text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-violet-600">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              {/* Secure Payment Badges */}
              <div className="mt-4 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Secure 256-bit Payment Supported</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-600">
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
                    Midtrans
                  </span>
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
                    QRIS
                  </span>
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
                    BCA / Mandiri
                  </span>
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
                    GoPay
                  </span>
                </div>
              </div>
            </div>

            {/* Digital Ticket Mockup */}
            <div className="relative overflow-hidden rounded-3xl border border-violet-200/80 bg-gradient-to-b from-violet-600 to-indigo-700 p-5 text-white shadow-xl shadow-violet-500/20">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-violet-200 uppercase">
                    E-TICKET PASS
                  </span>
                  <h4 className="text-base font-extrabold">YOUR DIGITAL TICKET</h4>
                </div>
                <CheckCircle2 className="h-6 w-6 text-emerald-300" />
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-4 text-slate-900 shadow-inner">
                <div className="p-2 bg-white rounded-lg">
                  <QRCode
                    value="https://evoria.id/ticket/EVTG24-5995"
                    size={110}
                    level="M"
                  />
                </div>
                <p className="mt-2 font-mono text-xs font-bold text-slate-700">
                  TICKET ID: #EVTG24-5995
                </p>
                <p className="text-[11px] text-slate-500">Seats: {selectedSeats.join(", ")}</p>
              </div>

              <div className="mt-3 text-center">
                <p className="text-xs font-medium text-violet-100">
                  Instant QR validation at venue entrance ✨
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeatBookingPreview;
