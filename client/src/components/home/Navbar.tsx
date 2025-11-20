"use client";
import { Search, Ticket, Menu, X, Calendar, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLogout, useMe } from "@/utils/query";
import { PiSquaresFour } from "react-icons/pi";

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { data } = useMe();
  const { mutateAsync: handleLogout, isPending } = useLogout();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-sky-500 transition-transform group-hover:scale-105">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-xl font-black text-transparent">
              LOCKETIX
            </span>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 lg:flex">
            {/* Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="h-10 w-10 text-gray-300 hover:bg-white/10 hover:text-white"
            >
              <Search className="h-5 w-5" />
            </Button>

            {data ? (
              <>
                {data.role === "USER" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/my-tickets")}
                    className="h-10 text-gray-300 hover:bg-white/10 hover:text-white"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    My Tickets
                  </Button>
                )}
                {data.role !== "USER" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/dashboard")}
                    className="h-10 text-gray-300 hover:bg-white/10 hover:text-white"
                  >
                    <PiSquaresFour className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isPending}
                  onClick={async () => {
                    await handleLogout();
                    window.location.reload();
                  }}
                  className="h-10 text-gray-300 hover:bg-white/10 hover:text-white"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/auth/sign-in")}
                  className="h-10 text-gray-300 hover:bg-white/10 hover:text-white"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push("/auth/sign-up")}
                  className="h-10 bg-gradient-to-r from-teal-500 to-sky-500 px-6 font-semibold hover:from-teal-600 hover:to-sky-600"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="h-10 w-10 text-gray-300 hover:bg-white/10 hover:text-white lg:hidden"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Search Bar - Expandable */}
        {isSearchOpen && (
          <div className="animate-in slide-in-from-top-2 hidden pb-4 lg:block">
            <div className="relative mx-auto max-w-2xl">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search for events, artists, venues..."
                className="h-12 border-white/10 bg-white/5 pl-12 text-white placeholder:text-gray-400 focus:border-teal-500/50"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-white/10 bg-slate-900/95 backdrop-blur-xl lg:hidden">
          <div className="container mx-auto space-y-4 px-4 py-6">
            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="border-t border-white/10 bg-slate-900/95 backdrop-blur-xl lg:hidden">
                <div className="container mx-auto space-y-4 px-4 py-6">
                  {/* Mobile Search */}
                  <div className="relative">
                    <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search events..."
                      className="h-12 border-white/10 bg-white/5 pl-12 text-white placeholder:text-gray-400"
                    />
                  </div>

                  {/* Mobile Actions */}
                  <div className="space-y-3 border-t border-white/10 pt-4">
                    {data ? (
                      <>
                        {data.role === "USER" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push("/my-tickets")}
                            className="h-12 w-full justify-start rounded-md px-4 text-gray-200 transition hover:bg-white/5 hover:text-white"
                          >
                            <Calendar className="mr-3 h-4 w-4" />
                            My Tickets
                          </Button>
                        )}
                        {data.role !== "USER" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push("/dashboard")}
                            className="h-12 w-full justify-start rounded-md px-4 text-gray-200 transition hover:bg-white/5 hover:text-white"
                          >
                            <PiSquaresFour className="mr-3 h-4 w-4" />
                            Dashboard
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isPending}
                          onClick={async () => {
                            await handleLogout();
                            window.location.reload();
                          }}
                          className="h-12 w-full justify-start rounded-md px-4 text-gray-200 transition hover:bg-white/5 hover:text-white"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Keluar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push("/auth/sign-in")}
                          className="h-12 w-full justify-start rounded-md px-4 text-gray-200 transition hover:bg-white/5 hover:text-white"
                        >
                          Sign In
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => router.push("/auth/sign-up")}
                          className="h-12 w-full rounded-md bg-gradient-to-r from-teal-500 to-sky-500 px-4 font-semibold text-white transition hover:from-teal-600 hover:to-sky-600"
                        >
                          Sign Up
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
