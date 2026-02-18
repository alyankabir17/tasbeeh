import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tasbeeh Counter",
  description:
    "A beautiful digital Tasbeeh counter — track your dhikr, sync across devices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-emerald-975 text-emerald-100 min-h-screen`}
      >
        <AuthProvider>
          <Navbar />
          <div className="max-w-4xl mx-auto">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
