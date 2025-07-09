// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from '@clerk/nextjs';
import { SpeedInsights } from "@vercel/speed-insights/next"
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dr. Abhi Kumar - Patient Management System",
  description: "Comprehensive patient management system for medical practice",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2000,
            className:
              "bg-teal-600 text-white border border-gray-200 shadow-lg rounded-xl px-6 py-4 text-base flex items-center gap-3",
            style: {
              fontSize: "1rem",
              maxWidth: "500px",
            },
          }}
        />
      </body>
    </html>
    </ClerkProvider>
  );
}
