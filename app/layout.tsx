import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Happ System - 訂房管理系統",
  description: "Happ 自動化訂房管理後台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto bg-neutral-100">
            {/* Mobile Header */}
            <div className="md:hidden sticky top-0 z-10 flex items-center gap-2 border-b bg-white px-4 py-3">
              <MobileNav />
              <h1 className="text-lg font-bold">Happ System</h1>
            </div>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
