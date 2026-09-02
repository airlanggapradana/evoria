"use client";

import Image from "next/image";
import { Users, Calendar, Ticket, MapPin, CheckCircle } from "lucide-react";

const stats = [
  {
    number: "25K+",
    label: "Events Hosted",
    icon: Calendar,
  },
  {
    number: "1M+",
    label: "Happy Users",
    icon: Users,
  },
  {
    number: "5M+",
    label: "Tickets Sold",
    icon: Ticket,
  },
  {
    number: "350+",
    label: "Cities Covered",
    icon: MapPin,
  },
];

const TrustStats = () => {
  return (
    <section id="why-us" className="relative scroll-mt-20 bg-slate-50/50 py-16 sm:py-20 lg:py-24">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Heading, Subtitle & Stat Counters */}
          <div className="flex flex-col space-y-6 lg:col-span-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/80 px-4 py-1.5 text-xs font-bold tracking-widest text-violet-700 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
              <span>WHY CHOOSE EVORIA</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:leading-tight">
              The World&apos;s Most Trusted Event Ticket Platform
            </h2>

            <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
              We make it easy to discover, book, and enjoy the best events happening
              around the world with a secure and seamless experience.
            </p>

            {/* 4 Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4 sm:gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-violet-200 hover:shadow-md"
                >
                  <p className="text-2xl font-black text-violet-600 sm:text-3xl">
                    {stat.number}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Key Value Points */}
            <div className="space-y-2.5 pt-2 text-xs font-medium text-slate-600 sm:text-sm">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>Instant confirmation with dynamic secure QR code</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>Transparent ticket pricing with zero hidden fees</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>Full support for event organizers with live check-in scanner</span>
              </div>
            </div>
          </div>

          {/* Right Column: Celebratory Illustration Graphic */}
          <div className="relative flex justify-center lg:col-span-6">
            <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-100 bg-white p-4 shadow-2xl shadow-violet-500/10 sm:p-6">
              <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-violet-50 sm:h-80">
                <Image
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80"
                  alt="Happy event attendees"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-violet-950/80 via-transparent to-transparent" />

                {/* Floating attendee card */}
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-white/95 p-4 shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                      <Ticket className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Over 1,000,000+ Verified Ticket Check-ins
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Seamless digital ticket scanning with 99.9% uptime
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustStats;
