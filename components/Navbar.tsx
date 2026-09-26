"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white border-b border-gray-100 shadow-sm py-3"
          : "bg-transparent py-4"
      }`}
    >
      <div className="w-full px-4 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <img src="/sanad-logo.png" alt="SANAD Logo" className="w-10 h-10 object-contain drop-shadow-md" />
          <span className={`font-extrabold text-2xl tracking-tight transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`}>
            SANAD
          </span>
        </Link>
        
        {/* Center Nav Pill */}
        <div className={`hidden lg:flex items-center gap-5 px-6 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap overflow-x-auto no-scrollbar ${
          scrolled 
            ? "bg-gray-100 text-gray-700" 
            : "bg-gray-800/40 backdrop-blur-md text-white border border-white/10"
        }`}>
          <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">Dashboard</Link>
          <Link href="/chat" className="hover:text-emerald-400 transition-colors">My Situation</Link>
          <Link href="/services" className="hover:text-emerald-400 transition-colors">Services</Link>
          <Link href="/applications" className="hover:text-emerald-400 transition-colors">My Applications</Link>
          <Link href="/credentials" className="hover:text-emerald-400 transition-colors">My Credentials</Link>
          <Link href="/documents" className="hover:text-emerald-400 transition-colors">Documents</Link>
          <Link href="/notifications" className="hover:text-emerald-400 transition-colors">Notifications</Link>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-4 shrink-0">
          <Link 
            href="/chat" 
            className={`px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all ${
              scrolled 
                ? "bg-gray-900 text-white hover:bg-gray-800" 
                : "bg-gray-900 text-white hover:bg-gray-800 border border-white/10 shadow-lg"
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Start Case
          </Link>
        </div>
      </div>
    </header>
  );
}
