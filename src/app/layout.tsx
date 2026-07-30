import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { EngagementProvider } from "@/context/EngagementContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReplyDaddy - Reddit Marketing Tool",
  description: "MMP Demo for ReplyDaddy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
      <body className="bg-[var(--background)] text-[var(--foreground)] flex min-h-screen" suppressHydrationWarning>
        <EngagementProvider>
          <Sidebar />
          <main className="flex-1 flex flex-col h-screen ml-64 pl-4 pt-4">
            <div className="bg-white border border-zinc-200/50 border-b-0 rounded-tl-3xl shadow-sm flex-1 overflow-y-auto relative">
              {children}
            </div>
          </main>
        </EngagementProvider>
      </body>
    </html>
  );
}
