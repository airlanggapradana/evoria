"use client";
import { Search, Ticket, Menu, X, User, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-purple-500 transition-transform group-hover:scale-105">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-2xl font-bold text-transparent">
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

            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/my-tickets")}
              className="h-10 text-gray-300 hover:bg-white/10 hover:text-white"
            >
              <Calendar className="mr-2 h-4 w-4" />
              My Tickets
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-gray-300 hover:bg-white/10 hover:text-white"
            >
              <User className="h-5 w-5" />
            </Button>

            <Button
              size="sm"
              className="h-10 bg-gradient-to-r from-teal-500 to-purple-500 px-6 font-semibold hover:from-teal-600 hover:to-purple-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
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
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search events..."
                className="h-12 border-white/10 bg-white/5 pl-12 text-white placeholder:text-gray-400"
              />
            </div>

            {/* Mobile Links */}
            <div className="space-y-2">
              <Link
                href="#events"
                className="block py-3 text-sm font-medium text-gray-300 transition-colors hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Events
              </Link>
              <Link
                href="#categories"
                className="block py-3 text-sm font-medium text-gray-300 transition-colors hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="#how-it-works"
                className="block py-3 text-sm font-medium text-gray-300 transition-colors hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#contact"
                className="block py-3 text-sm font-medium text-gray-300 transition-colors hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="space-y-2 border-t border-white/10 pt-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/my-tickets")}
                className="w-full justify-start text-gray-300 hover:bg-white/10 hover:text-white"
              >
                <Calendar className="mr-2 h-4 w-4" />
                My Tickets
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:bg-white/10 hover:text-white"
              >
                <User className="mr-2 h-4 w-4" />
                Sign In
              </Button>
              <Button className="w-full bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
