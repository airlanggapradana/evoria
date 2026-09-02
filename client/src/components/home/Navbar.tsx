"use client";

import {
  Search,
  Ticket,
  Menu,
  X,
  Calendar,
  LogOut,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");

  const { data } = useMe();
  const { mutateAsync: handleLogout, isPending } = useLogout();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const eventsSection = document.getElementById("events");
      if (eventsSection) {
        eventsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100/80 bg-white/90 shadow-xs backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-900">
                Evoria<span className="text-violet-600">.</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1 md:gap-2 lg:flex">
            <Link
              href="/"
              className="rounded-full px-4 py-2 text-sm font-semibold text-violet-600 transition-colors hover:bg-violet-50"
            >
              Home
            </Link>
            <Link
              href="#events"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              Events
            </Link>
            <Link
              href="#categories"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              Categories
            </Link>
            <Link
              href="#why-us"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              About Us
            </Link>
            <Link
              href="#footer"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 lg:flex">
            {/* Search Icon Toggle */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle search bar"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="h-10 w-10 rounded-full text-slate-600 transition-colors hover:bg-violet-50 hover:text-violet-600"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Ticket / My Tickets Quick Icon */}
            {data?.role === "USER" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/my-tickets")}
                aria-label="View My Tickets"
                className="relative h-10 w-10 rounded-full text-slate-600 transition-colors hover:bg-violet-50 hover:text-violet-600"
                title="My Tickets"
              >
                <Ticket className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-violet-600" />
              </Button>
            )}

            {/* Authenticated State vs Guest State */}
            {data ? (
              <div className="flex items-center gap-2">
                {data.role === "USER" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/my-tickets")}
                    className="h-10 rounded-full border-violet-200 bg-violet-50/50 px-4 text-sm font-semibold text-violet-700 transition hover:bg-violet-100/80"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    My Tickets
                  </Button>
                )}
                {data.role === "ORGANIZER" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/dashboard")}
                    className="h-10 rounded-full border-violet-200 bg-violet-50/50 px-4 text-sm font-semibold text-violet-700 transition hover:bg-violet-100/80"
                  >
                    <PiSquaresFour className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                )}
                {data.role === "ADMIN" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/dashboard/admin")}
                    className="h-10 rounded-full border-violet-200 bg-violet-50/50 px-4 text-sm font-semibold text-violet-700 transition hover:bg-violet-100/80"
                  >
                    <PiSquaresFour className="mr-2 h-4 w-4" />
                    Dashboard Admin
                  </Button>
                )}

                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white uppercase">
                    {data.name?.charAt(0) || (
                      <UserIcon className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <span className="max-w-[100px] truncate text-xs font-semibold text-slate-800">
                    {data.name}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isPending}
                  onClick={async () => {
                    await handleLogout();
                    window.location.reload();
                  }}
                  className="h-10 rounded-full text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                  title="Logout"
                >
                  <LogOut className="mr-1.5 h-4 w-4" />
                  Keluar
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/auth/sign-in")}
                  className="h-10 rounded-full px-5 font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push("/auth/sign-up")}
                  className="h-10 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-6 font-semibold text-white shadow-md shadow-violet-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/35 active:scale-[0.98]"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="h-10 w-10 rounded-full text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Expandable Search Bar on Desktop */}
        {isSearchOpen && (
          <div className="animate-in fade-in slide-in-from-top-2 hidden pb-4 duration-200 lg:block">
            <form
              onSubmit={handleSearchSubmit}
              className="relative mx-auto max-w-2xl"
            >
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for events, concerts, workshops, festivals..."
                className="h-12 rounded-full border-violet-100 bg-slate-50/80 pl-12 text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/20"
                autoFocus
              />
              <Button
                type="submit"
                size="sm"
                className="absolute top-1.5 right-1.5 h-9 rounded-full bg-violet-600 px-4 text-xs font-semibold text-white hover:bg-violet-700"
              >
                Search
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="animate-in fade-in slide-in-from-top-4 border-t border-slate-100 bg-white/95 backdrop-blur-xl duration-200 lg:hidden">
          <div className="container mx-auto space-y-4 px-4 py-6">
            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-1">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl px-4 py-2.5 text-base font-semibold text-violet-600 hover:bg-violet-50"
              >
                Home
              </Link>
              <Link
                href="#events"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl px-4 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                Events
              </Link>
              <Link
                href="#categories"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl px-4 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                Categories
              </Link>
              <Link
                href="#why-us"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl px-4 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                About Us
              </Link>
              <Link
                href="#footer"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl px-4 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                Contact
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="space-y-3 border-t border-slate-100 pt-4">
              {data ? (
                <>
                  <div className="mb-2 flex items-center gap-3 px-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                      {data.name?.charAt(0) || <UserIcon className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {data.name}
                      </p>
                      <p className="text-xs text-slate-500">{data.role}</p>
                    </div>
                  </div>

                  {data.role === "USER" && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push("/my-tickets");
                      }}
                      className="h-11 w-full justify-start rounded-xl px-4 font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-600"
                    >
                      <Calendar className="mr-3 h-4 w-4 text-violet-600" />
                      My Tickets
                    </Button>
                  )}
                  {data.role !== "USER" && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push(
                          data.role === "ADMIN"
                            ? "/dashboard/admin"
                            : "/dashboard",
                        );
                      }}
                      className="h-11 w-full justify-start rounded-xl px-4 font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-600"
                    >
                      <PiSquaresFour className="mr-3 h-4 w-4 text-violet-600" />
                      Dashboard
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    disabled={isPending}
                    onClick={async () => {
                      setIsMenuOpen(false);
                      await handleLogout();
                      window.location.reload();
                    }}
                    className="h-11 w-full justify-start rounded-xl px-4 font-medium text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Keluar
                  </Button>
                </>
              ) : (
                <div className="space-y-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push("/auth/sign-in");
                    }}
                    className="h-12 w-full rounded-xl border-slate-200 font-semibold text-slate-700"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push("/auth/sign-up");
                    }}
                    className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 font-semibold text-white shadow-md shadow-violet-500/25"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
