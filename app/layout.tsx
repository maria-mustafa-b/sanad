import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { SosEmergencyModal } from "@/components/workspace/sos-emergency-modal";
import { MobileBottomNav } from "@/components/workspace/mobile-bottom-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SANAD — Support starts with understanding",
    template: "%s | SANAD",
  },
  description:
    "Understand your situation. Prove what matters. Find the support you need.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <Link href="/" className="brand" aria-label="SANAD home">
            <ShieldCheck aria-hidden="true" size={30} />
            <span>
              SANAD{" "}
              <span lang="ar" dir="rtl">
                سند
              </span>
            </span>
          </Link>
          <nav aria-label="Main navigation">
            <Link href="/">Overview</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/understand">Your situation</Link>
            <Link href="/services">Services</Link>
            <Link href="/documents">Documents</Link>
            <Link href="/verify">Verification</Link>
            <Link href="/onboarding">Get started</Link>
          </nav>
          <div className="flex items-center gap-2">
            <SosEmergencyModal />
            <span className="phase-badge">Independent prototype</span>
          </div>
        </header>
        {children}
        <MobileBottomNav />
        <footer>
          <span>SANAD · Understand. Confirm. Move forward.</span>
          <span>
            An independent hackathon prototype. Not a government service.
          </span>
        </footer>
      </body>
    </html>
  );
}
