"use client";

import Link from "next/link";
import {
  Sparkles,
  ArrowUp,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Mail,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="footer" className="border-t border-slate-100 bg-white pt-16 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          {/* Brand & Socials (Col 1 & 2) */}
          <div className="space-y-5 lg:col-span-2">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 text-white shadow-md shadow-violet-500/25">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900">
                Evoria<span className="text-violet-600">.</span>
              </span>
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-slate-500">
              Your one-stop platform for discovering amazing events, concerts, conferences, and
              booking tickets in just a few clicks.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-2">
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="https://instagram.com/iamrangga._"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="https://linkedin.com/in/airlanggapradana/"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold tracking-wider text-slate-900 uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li>
                <Link href="/" className="transition hover:text-violet-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#events" className="transition hover:text-violet-600">
                  Events
                </Link>
              </li>
              <li>
                <Link href="#categories" className="transition hover:text-violet-600">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="#why-us" className="transition hover:text-violet-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#footer" className="transition hover:text-violet-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold tracking-wider text-slate-900 uppercase">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li>
                <Link href="#events" className="transition hover:text-violet-600">
                  Music & Concerts
                </Link>
              </li>
              <li>
                <Link href="#events" className="transition hover:text-violet-600">
                  Business & Conferences
                </Link>
              </li>
              <li>
                <Link href="#events" className="transition hover:text-violet-600">
                  Sports & Outdoor
                </Link>
              </li>
              <li>
                <Link href="#events" className="transition hover:text-violet-600">
                  Festivals & Parties
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold tracking-wider text-slate-900 uppercase">
              Contact Us
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-violet-500" />
                <a href="mailto:hello@evoria.com" className="transition hover:text-violet-600">
                  hello@evoria.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-violet-500" />
                <span>+62 (021) 567-8900</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-violet-500" />
                <span>Jl. Sudirman No. 123, Jakarta</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Evoria. All rights reserved.
          </p>

          <p className="flex items-center gap-1 text-xs text-slate-500">
            Made with <Heart className="h-3.5 w-3.5 fill-violet-600 text-violet-600" /> for
            unforgettable experiences
          </p>

          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-50 text-violet-600 transition hover:bg-violet-600 hover:text-white"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
