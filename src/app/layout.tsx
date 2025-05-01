import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Changed to Inter for a standard sans-serif
import { Geist, Geist_Mono } from 'next/font/google'; // Keeping Geist as requested
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import { cn } from "@/lib/utils";

// Use Geist fonts as defined in the original layout
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});


export const metadata: Metadata = {
  title: "TeamUp - Team Management", // Updated title
  description: "Manage your student team members efficiently with TeamUp.", // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          `${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col` // Use Geist variables and add flex structure
        )}
      >
        {/* Remove container and padding - let pages handle their layout */}
        <main className="flex-grow">
          {children}
        </main>
        <Toaster /> {/* Add Toaster for notifications */}
      </body>
    </html>
  );
}
