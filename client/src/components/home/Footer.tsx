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
import Image from "next/image";

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
              <Image
                src={
                  "https://res.cloudinary.com/airlanggapradana/image/upload/v1763976168/ChatGPT_Image_Nov_24__2025__04_20_41_PM-removebg-preview_1_krtgkj.webp"
                }
                alt={"logo_footer"}
                width={200}
                height={200}
              />
            </Link>
            <p className="mb-6 leading-relaxed text-gray-400">
              Langkahmu menuju pengalaman acara yang tak terlupakan dimulai di
              sini. Temukan, pesan, dan nikmati acara favoritmu dengan mudah
              bersama Evoria.
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
                <Button className="h-11 bg-gradient-to-r from-teal-500 to-sky-500 px-6 hover:from-teal-600 hover:to-sky-600">
                  Subscribe
                </Button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              <Link
                href="https://instagram.com/iamrangga._"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 transition-all hover:border-teal-500/50 hover:bg-teal-500/10 hover:text-teal-400"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/airlanggapradana/"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 transition-all hover:border-teal-500/50 hover:bg-teal-500/10 hover:text-teal-400"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-gray-400">
            &copy; 2025 Evoria. All rights reserved.
          </p>

          <Button
            onClick={scrollToTop}
            size="icon"
            className="h-10 w-10 rounded-full bg-gradient-to-r from-teal-500 to-sky-500 transition-all hover:scale-105 hover:from-teal-600 hover:to-sky-600"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
