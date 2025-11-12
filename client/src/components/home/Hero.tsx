"use client";
import { Search, Calendar, MapPin, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Hero = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-sky-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute right-10 bottom-20 h-96 w-96 animate-pulse rounded-full bg-teal-500/20 blur-3xl delay-1000" />
        <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-blue-500/10 blur-3xl delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center">
        <div className="container mx-auto px-4 py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
            {/* Left Column - Main Content */}
            <div className="flex flex-col justify-center space-y-8">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-2 backdrop-blur-sm">
                <TrendingUp className="h-4 w-4 text-teal-400" />
                <span className="text-sm font-medium text-teal-300">
                  Lebih dari 10.000+ Event Tersedia
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl leading-tight font-extrabold text-white md:text-6xl">
                  Temukan
                  <span className="block bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
                    Pengalaman Terbaikmu
                  </span>
                </h1>
                <p className="text-lg text-gray-300 md:text-xl">
                  Jelajahi konser, festival, pertandingan olahraga, dan
                  pengalaman eksklusif. Pesan tiket secara instan dan ciptakan
                  kenangan tak terlupakan.
                </p>
              </div>

              {/* Enhanced Search Bar */}
              <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Cari event, artis, venue..."
                      className="h-14 border-white/10 bg-white/10 pl-12 text-white placeholder:text-gray-400 focus:border-teal-500/50"
                    />
                  </div>
                  <Button
                    size="lg"
                    className="h-14 bg-gradient-to-r from-teal-500 to-sky-500 px-8 font-semibold hover:from-teal-600 hover:to-sky-600"
                  >
                    <Search className="mr-2 h-5 w-5" />
                    Cari
                  </Button>
                </div>

                {/* Quick Filters */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Pencarian cepat:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 border border-white/10 bg-white/5 text-white hover:bg-white/10"
                    >
                      Akhir Pekan Ini
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 border border-white/10 bg-white/5 text-white hover:bg-white/10"
                    >
                      Dekat Saya
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-white">50K+</p>
                  <p className="text-sm text-gray-400">Event Aktif</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-white">1M+</p>
                  <p className="text-sm text-gray-400">Pengguna Puas</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-white">200+</p>
                  <p className="text-sm text-gray-400">Kota</p>
                </div>
              </div>
            </div>

            {/* Right Column - Categories */}
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/20 to-purple-900/20 p-6 backdrop-blur-sm transition-transform hover:scale-105">
                <div className="mb-4 text-4xl">🎵</div>
                <h3 className="mb-2 text-xl font-bold text-white">Konser</h3>
                <p className="text-sm text-gray-300">
                  Musik live & pertunjukan
                </p>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-teal-500/20 to-teal-900/20 p-6 backdrop-blur-sm transition-transform hover:scale-105">
                <div className="mb-4 text-4xl">⚽</div>
                <h3 className="mb-2 text-xl font-bold text-white">Olahraga</h3>
                <p className="text-sm text-gray-300">Pertandingan & turnamen</p>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/20 to-blue-900/20 p-6 backdrop-blur-sm transition-transform hover:scale-105">
                <div className="mb-4 text-4xl">🎭</div>
                <h3 className="mb-2 text-xl font-bold text-white">Teater</h3>
                <p className="text-sm text-gray-300">Pertunjukan & drama</p>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-pink-500/20 to-pink-900/20 p-6 backdrop-blur-sm transition-transform hover:scale-105">
                <div className="mb-4 text-4xl">🎪</div>
                <h3 className="mb-2 text-xl font-bold text-white">Festival</h3>
                <p className="text-sm text-gray-300">Perayaan budaya</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
