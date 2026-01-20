import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "@/components/Navigation";
import { NotificationProvider } from "@/components/NotificationProvider";
import { KeyboardShortcutsProvider } from "@/components/KeyboardShortcutsProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";
import SessionProvider from "@/components/SessionProvider";
import GuestBanner from "@/components/GuestBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Planova - Project Management System",
  description: "A modern, full-stack project management system built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light overflow-x-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white overflow-x-hidden`}
      >
        <SessionProvider>
          <ToastProvider>
            <NotificationProvider>
              <KeyboardShortcutsProvider>
                <Navigation />
                <GuestBanner />
                <main className="min-h-screen">
                  {children}
                </main>
              </KeyboardShortcutsProvider>
            </NotificationProvider>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}