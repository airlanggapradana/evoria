import "@/styles/globals.css";

import { type Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

export const metadata: Metadata = {
  title: "LOKET - Your Event Ticketing Platform",
  description: "Buy and sell event tickets with ease on LOKET.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${openSans.variable}`}>
      <body>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
