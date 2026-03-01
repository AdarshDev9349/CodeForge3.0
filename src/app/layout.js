'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Silk from "../ui/background";
import LoadingWrapper from "../ui/LoadingWrapper";
import FloatingDockDemo from "../ui/floating-demo";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {!isAdminRoute && <Silk />}
        {!isAdminRoute && <FloatingDockDemo />}
        <LoadingWrapper>
          
          {children}
        </LoadingWrapper>
      </body>
    </html>
  );
}
