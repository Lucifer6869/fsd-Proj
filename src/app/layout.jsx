
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


export const metadata = {
  title: "TeamUp - Team Management", // Updated title
  description: "Manage your student team members efficiently with TeamUp.", // Updated description
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={cn(
          `${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col` // Use Geist variables and add flex structure
        )}
      >
        {/* Add padding to the main content area */}
        <main className="flex-grow p-4 md:p-6">
          {children}
        </main>
        <Toaster /> {/* Add Toaster for notifications */}
      </body>
    </html>
  );
}
