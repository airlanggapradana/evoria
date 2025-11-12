"use client";
import {
  Ticket,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-20 h-96 w-96 animate-pulse rounded-full bg-teal-500/5 blur-3xl" />
        <div className="absolute top-0 right-20 h-96 w-96 animate-pulse rounded-full bg-purple-500/5 blur-3xl delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Brand Section - Larger */}
          <div className="lg:col-span-1">
            <Link href="/" className="group mb-6 flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-purple-500 transition-transform group-hover:scale-105">
                <Ticket className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-2xl font-bold text-transparent">
                EventHub
              </span>
            </Link>
            <p className="mb-6 leading-relaxed text-gray-400">
              Your gateway to unforgettable experiences. Discover, book, and
              enjoy the best events worldwide with seamless ticketing solutions.
            </p>

            {/* Newsletter */}
            <div className="mb-6 space-y-3">
              <p className="text-sm font-semibold text-white">
                Subscribe to our newsletter
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your email"
                  className="h-11 border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-teal-500/50"
                />
                <Button className="h-11 bg-gradient-to-r from-teal-500 to-purple-500 px-6 hover:from-teal-600 hover:to-purple-600">
                  Subscribe
                </Button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              <Link
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 transition-all hover:border-teal-500/50 hover:bg-teal-500/10 hover:text-teal-400"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 transition-all hover:border-teal-500/50 hover:bg-teal-500/10 hover:text-teal-400"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 transition-all hover:border-teal-500/50 hover:bg-teal-500/10 hover:text-teal-400"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 transition-all hover:border-teal-500/50 hover:bg-teal-500/10 hover:text-teal-400"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Support & Contact */}
          <div className="flex flex-col items-end lg:col-span-1">
            <h3 className="mb-4 text-right text-lg font-bold text-white">
              Support
            </h3>
            <ul className="mb-6 space-y-3 text-right text-sm">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 transition-colors hover:text-teal-400"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 transition-colors hover:text-teal-400"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 transition-colors hover:text-teal-400"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 transition-colors hover:text-teal-400"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 transition-colors hover:text-teal-400"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-end gap-3 text-gray-400">
                <span>support@eventhub.com</span>
                <Mail className="h-4 w-4 text-teal-400" />
              </div>
              <div className="flex items-center justify-end gap-3 text-gray-400">
                <span>+1 (555) 123-4567</span>
                <Phone className="h-4 w-4 text-teal-400" />
              </div>
              <div className="flex items-center justify-end gap-3 text-gray-400">
                <span>123 Event Street, NY 10001</span>
                <MapPin className="h-4 w-4 text-teal-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-gray-400">
            &copy; 2025 EventHub. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm">
            <Link
              href="#"
              className="text-gray-400 transition-colors hover:text-teal-400"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-gray-400 transition-colors hover:text-teal-400"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-gray-400 transition-colors hover:text-teal-400"
            >
              Cookies
            </Link>
          </div>

          <Button
            onClick={scrollToTop}
            size="icon"
            className="h-10 w-10 rounded-full bg-gradient-to-r from-teal-500 to-purple-500 transition-all hover:scale-105 hover:from-teal-600 hover:to-purple-600"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
