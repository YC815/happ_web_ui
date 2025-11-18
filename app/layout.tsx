import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

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
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
