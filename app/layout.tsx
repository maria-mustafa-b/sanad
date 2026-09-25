import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
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
            <Link href="/understand">Your situation</Link>
            <Link href="/verify">Verification</Link>
          </nav>
          <span className="phase-badge">Prototype · Foundation</span>
        </header>
        {children}
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
