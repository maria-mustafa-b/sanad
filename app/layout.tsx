import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "@/components/layout/Shell";

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
        <Shell>
          {children}
        </Shell>
      </body>
    </html>
  );
}
