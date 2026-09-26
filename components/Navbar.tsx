"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Force solid if not on the home page
  const isSolid = !isHome || scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSolid
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-bold text-lg group-hover:bg-emerald-700 transition">
            S
          </div>
          <span className={`font-bold text-xl tracking-tight transition-colors ${isSolid ? "text-gray-900" : "text-white drop-shadow-sm"}`}>
            SANAD
          </span>
        </Link>
        
        <nav className={`hidden md:flex items-center gap-6 font-medium text-sm transition-colors ${isSolid ? "text-gray-600" : "text-gray-100 drop-shadow-sm"}`}>
          <Link href="/" className={`hover:text-emerald-500 transition`}>Home</Link>
          <Link href="/#how-it-works" className={`hover:text-emerald-500 transition`}>How it works</Link>
          <Link href="/dashboard" className={`hover:text-emerald-500 transition`}>Dashboard</Link>
          <Link href="/chat" className={`hover:text-emerald-500 transition`}>Get Help</Link>
          <Link href="/verify" className={`hover:text-emerald-500 transition`}>Verify Credential</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/chat" className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-emerald-700 transition shadow-sm border border-emerald-500/50">
            Start Case
          </Link>
        </div>
      </div>
    </header>
  );
}
