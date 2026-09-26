import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "SANAD | Worker Support & Digital Credentials",
  description: "Understand your situation, prove what matters, and find the support you need.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />
      </head>
      <body className="bg-gray-50 text-gray-900 font-sans antialiased min-h-screen flex flex-col">
        {/* Transparent-to-solid Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>

        {/* Minimal Footer */}
        <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm z-10 relative">
          <p>© {new Date().getFullYear()} SANAD. Built for dignity and clarity.</p>
        </footer>
      </body>
    </html>
  );
}
