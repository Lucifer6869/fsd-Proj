// Removed type import: import type { Metadata } from "next";
// Removed type import: import { Inter } from "next/font/google"; // Changed to Inter for a standard sans-serif
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


export const metadata = { // Removed type: Metadata
  title: "TeamUp - Team Management", // Updated title
  description: "Manage your student team members efficiently with TeamUp.", // Updated description
  // Add icon metadata - point to the standard favicon location
  // NOTE: You need to add an actual favicon.ico or icon.(png|svg) file
  // in the /public or /src/app directory for this to work.
  // I cannot generate image files.
  icons: {
    icon: '/favicon.ico', // Standard path for favicon
    // You can also specify other types like apple-touch-icon:
    // apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}) { // Removed types: Readonly<{ children: React.ReactNode; }>
  return (
    <html lang="en" className="dark">{/* Added dark class here and removed whitespace below */}
      <body
        className={cn(
          `${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground` // Use Geist variables and add flex structure, added background/foreground
        )}
      >
        {/* Added container and padding for consistent page width */}
        <div className="container mx-auto px-4 py-8 flex-grow">
            {children}
        </div>
        <Toaster /> {/* Add Toaster for notifications */}
      </body>
    </html>
  );
}
