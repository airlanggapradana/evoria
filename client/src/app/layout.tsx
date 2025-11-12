import "@/styles/globals.css";

import { type Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import TanstackProvider from "@/utils/TanstackProvider";

export const metadata: Metadata = {
  title: "LOKET - Your Event Ticketing Platform",
  description: "Buy and sell event tickets with ease on LOKET.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable}`}>
      <TanstackProvider>
        <body>
          {children}
          <Toaster />
        </body>
      </TanstackProvider>
    </html>
  );
}
