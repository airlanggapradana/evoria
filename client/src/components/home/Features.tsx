"use client";
import React, { useState } from "react";
import { additionalFeatures, mainFeatures } from "@/utils/data";

const LandingPageFeatures = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-950 py-12 text-white sm:py-16 md:py-20">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full bg-indigo-500 opacity-10 mix-blend-multiply blur-3xl filter sm:h-96 sm:w-96"></div>
        <div className="absolute top-1/2 right-1/4 h-64 w-64 animate-pulse rounded-full bg-purple-500 opacity-10 mix-blend-multiply blur-3xl filter delay-1000 sm:h-96 sm:w-96"></div>
        <div className="absolute bottom-1/4 left-1/2 h-64 w-64 animate-pulse rounded-full bg-pink-500 opacity-10 mix-blend-multiply blur-3xl filter delay-2000 sm:h-96 sm:w-96"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center sm:mb-16">
          <div className="bg-opacity-20 mb-4 inline-block rounded-full bg-indigo-500 px-3 py-1.5 sm:mb-6 sm:px-4 sm:py-2">
            <span className="text-xs font-semibold tracking-wider text-indigo-100 uppercase sm:text-sm">
              Features
            </span>
          </div>
          <h2 className="mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text px-4 py-2 text-3xl font-bold text-transparent sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
            Semua yang Anda Butuhkan untuk
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            Menyelenggarakan Acara Sukses
          </h2>
          <p className="mx-auto max-w-3xl px-4 text-base text-gray-400 sm:text-lg md:text-xl">
            Platform kami dirancang untuk memberikan semua alat yang Anda
            butuhkan guna membuat, mengelola, dan menyukseskan acara Anda dengan
            mudah.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="mb-12 grid grid-cols-1 gap-4 sm:mb-16 sm:grid-cols-2 sm:gap-6 lg:mb-20 lg:grid-cols-3 lg:gap-8">
          {mainFeatures.map((feature, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
              className="group relative rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 p-6 transition-all duration-500 hover:scale-105 hover:border-gray-700 sm:rounded-3xl sm:p-8"
            >
              {/* Gradient Glow Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-10 sm:rounded-3xl`}
              ></div>

              {/* Icon */}
              <div className="relative mb-4 sm:mb-6">
                <div
                  className={`h-14 w-14 rounded-xl sm:h-16 sm:w-16 sm:rounded-2xl ${feature.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                >
                  <feature.icon
                    className={`h-7 w-7 sm:h-8 sm:w-8 text-${feature.iconBg.split("-")[1]}-200`}
                  />
                </div>
              </div>

              {/* Content */}
              <h3 className="mb-2 text-xl font-bold transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 group-hover:bg-clip-text group-hover:text-transparent sm:mb-3 sm:text-2xl">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-400 sm:text-base">
                {feature.description}
              </p>

              {/* Hover Indicator */}
              <div
                className={`absolute right-6 bottom-6 h-2 w-2 rounded-full bg-gradient-to-r sm:right-8 sm:bottom-8 ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              ></div>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 p-6 sm:rounded-3xl sm:p-8 lg:p-12">
          <div className="mb-8 text-center sm:mb-10">
            <h3 className="mb-2 text-2xl font-bold sm:mb-3 sm:text-3xl">
              Dan Masih Banyak Lagi!
            </h3>
            <p className="text-sm text-gray-400 sm:text-base">
              Dikemas dengan fitur tambahan untuk meningkatkan pengalaman acara
              Anda
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4">
            {additionalFeatures.map((feature, index) => (
              <div
                key={index}
                className="group flex flex-col items-center rounded-xl p-3 text-center transition-all duration-300 hover:bg-gray-800 sm:p-4"
              >
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 transition-all duration-300 group-hover:bg-indigo-600 sm:mb-3 sm:h-12 sm:w-12">
                  <feature.icon className="h-5 w-5 text-gray-400 transition-colors duration-300 group-hover:text-white sm:h-6 sm:w-6" />
                </div>
                <span className="text-xs font-semibold text-gray-300 transition-colors duration-300 group-hover:text-white sm:text-sm">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-2 gap-6 sm:mt-16 sm:gap-8 lg:mt-20 lg:grid-cols-4">
          <div className="text-center">
            <div className="mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl">
              10K+
            </div>
            <div className="text-sm text-gray-400 sm:text-base">
              Events Created
            </div>
          </div>
          <div className="text-center">
            <div className="mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl">
              50K+
            </div>
            <div className="text-sm text-gray-400 sm:text-base">
              Active Users
            </div>
          </div>
          <div className="text-center">
            <div className="mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl">
              99.9%
            </div>
            <div className="text-sm text-gray-400 sm:text-base">Uptime</div>
          </div>
          <div className="text-center">
            <div className="mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl">
              24/7
            </div>
            <div className="text-sm text-gray-400 sm:text-base">Support</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center sm:mt-16 lg:mt-20">
          <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 p-8 sm:rounded-3xl sm:p-10 lg:p-12">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20"></div>

            <div className="relative">
              <h3 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl md:text-4xl">
                Siap untuk Memulai Acara Anda?
              </h3>
              <p className="mx-auto mb-6 max-w-3xl px-4 text-base text-gray-400 sm:mb-8 sm:text-lg md:text-xl">
                Bergabunglah dengan ribuan penyelenggara acara yang telah sukses
                menggunakan platform kami untuk menciptakan pengalaman tak
                terlupakan.
              </p>
              <div className="flex flex-col justify-center gap-3 px-4 sm:flex-row sm:gap-4">
                <button className="rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 px-6 py-3 text-base font-bold shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 hover:from-indigo-500 hover:to-sky-500 sm:px-8 sm:py-4 sm:text-lg">
                  Buat Acara Sekarang
                </button>
                <button className="rounded-xl bg-gray-800 px-6 py-3 text-base font-bold transition-all hover:scale-105 hover:bg-gray-700 sm:px-8 sm:py-4 sm:text-lg">
                  Lihat Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageFeatures;
