"use client";

import { useState } from "react";
import { Mail, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const NewsletterBanner = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Silakan masukkan alamat email yang valid.", {
        position: "top-center",
        richColors: true,
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      toast.success("Terima kasih telah berlangganan newsletter Evoria!", {
        position: "top-center",
        richColors: true,
        description: "Kami akan mengirimkan update event dan diskon eksklusif ke email Anda.",
      });
    }, 600);
  };

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 p-8 shadow-2xl shadow-violet-500/20 sm:p-12 lg:p-16">
          {/* Subtle Ambient Shapes */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-black/10 blur-2xl" />

          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-12">
            {/* Left Column: 3D Mail Icon with Notification Badge */}
            <div className="flex items-center gap-6 lg:col-span-7">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-inner backdrop-blur-md sm:h-24 sm:w-24 sm:rounded-3xl">
                <Mail className="h-10 w-10 text-white sm:h-12 sm:w-12" />
                {/* Floating Notification Badge */}
                <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 font-bold text-white shadow-lg ring-4 ring-purple-600">
                  <span className="text-xs">1</span>
                </div>
              </div>

              <div className="space-y-1.5 text-white">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-violet-200 uppercase">
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>JOIN OUR COMMUNITY</span>
                </div>
                <h3 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
                  Subscribe to Our Newsletter
                </h3>
                <p className="max-w-md text-xs leading-relaxed text-violet-100 sm:text-sm">
                  Get updates on new events, exclusive presale offers, and special discounts
                  straight to your inbox.
                </p>
              </div>
            </div>

            {/* Right Column: Email Subscription Form */}
            <div className="lg:col-span-5">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-2.5 rounded-2xl bg-white p-2 shadow-xl sm:flex-row sm:items-center sm:gap-2 sm:rounded-full"
              >
                <div className="flex flex-1 items-center px-4">
                  <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-transparent px-3 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-sm"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 text-xs font-bold text-white shadow-md shadow-violet-500/30 transition-all hover:from-violet-700 hover:to-purple-700 sm:rounded-full sm:text-sm"
                >
                  <span>{isSubmitting ? "Subscribing..." : "Subscribe Now"}</span>
                  <Send className="ml-2 h-3.5 w-3.5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterBanner;
