"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  MessageSquare, 
  Users, 
  FileText, 
  FolderOpen, 
  ShieldCheck, 
  HelpCircle,
  Settings,
  Bell,
  Menu,
  X,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Pages anyone can open without signing in.
  const isOpenRoute =
    pathname === "/" ||
    ["/auth", "/verify", "/privacy", "/terms", "/help", "/launch"].some((r) => pathname.startsWith(r));

  // Everything else needs a signed-in user; send guests to sign in, then back here.
  useEffect(() => {
    if (isOpenRoute) return setAuthChecked(true);
    let cancelled = false;
    (async () => {
      let signedIn = false;
      try { signedIn = !!JSON.parse(localStorage.getItem("sanad_user") || "null")?.authenticated; } catch {}
      if (!signedIn) {
        const { data } = await supabase.auth.getSession();
        const u = data.session?.user;
        if (u) {
          localStorage.setItem("sanad_user", JSON.stringify({ id: u.id, email: u.email, name: u.user_metadata?.full_name || u.email?.split("@")[0], authenticated: true }));
          signedIn = true;
        }
      }
      if (cancelled) return;
      if (signedIn) setAuthChecked(true);
      else router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
    })();
    return () => { cancelled = true; };
  }, [pathname, isOpenRoute, router]);

  const signOut = async () => {
    // Personal data lives in this browser: never leave it for the next person.
    ["sanad_user", "sanad_chat_history_v2", "sanad_situation_profile_v2", "sanad_documents", "sanad_application_draft_family", "sanad_applications"].forEach((k) =>
      localStorage.removeItem(k)
    );
    await supabase.auth.signOut().catch(() => {});
    window.location.href = "/";
  };

  // If we are on public presentation routes (landing page, auth page, verify page), DO NOT show the sidebar layout
  const isPublicRoute = pathname === "/" || pathname.startsWith("/auth") || pathname.startsWith("/verify");

  if (!authChecked) {
    return <div className="min-h-screen bg-[#FCFCFA]" />;
  }

  if (isPublicRoute) {
    return (
      <div className="min-h-screen bg-[#F7F7F2] text-[#202A27] flex flex-col font-sans">
        {children}
      </div>
    );
  }

  // Exact 5 core sidebar items matching all 9 screens:
  // 1. Ask SANAD
  // 2. My Situation
  // 3. My Applications
  // 4. My Documents
  // 5. My Credentials
  const navItems = [
    { name: "Ask SANAD", href: "/dashboard", icon: MessageSquare },
    { name: "My Situation", href: "/situation", icon: Users },
    { name: "My Applications", href: "/applications", icon: FileText },
    { name: "My Documents", href: "/documents", icon: FolderOpen },
    { name: "My Credentials", href: "/credentials", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#FCFCFA] text-[#202A27] flex flex-col md:flex-row antialiased">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-[#ECEFEA] px-5 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2" aria-label="SANAD home">
          <Image 
            src="/sanad-brand-logo.jpg" 
            alt="SANAD Logo" 
            width={32} 
            height={32}
            className="object-contain" 
          />
          <span className="font-extrabold text-[#153D32] text-lg tracking-tight">سند SANAD</span>
        </Link>
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-[#202A27] hover:bg-[#F4F6F2] rounded-lg"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ================= EXACT 9-SCREEN SIDEBAR ================= */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#ECEFEA] flex flex-col justify-between py-6 px-4 transition-transform duration-200 md:translate-x-0 md:static md:shrink-0
        ${isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
      `}>
        {/* Top: Official SANAD Logo + Tagline */}
        <div>
          <div className="px-3 pb-6 pt-1">
            <Link href="/" className="inline-block relative w-36 h-20" aria-label="SANAD home">
              <Image 
                src="/sanad-brand-logo.jpg" 
                alt="SANAD Logo" 
                fill
                priority
                className="object-contain object-left"
              />
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/chat");
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    isActive 
                      ? "bg-[#153D32] text-white shadow-sm" 
                      : "text-[#5C6661] hover:bg-[#F4F6F2] hover:text-[#202A27]"
                  }`}
                >
                  <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-[#7B8580]"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Utility Items */}
        <div className="pt-4 border-t border-[#ECEFEA] px-2 space-y-2">
          <Link 
            href="/"
            className="flex items-center gap-2.5 text-xs font-semibold text-[#5C6661] hover:text-[#153D32] transition"
          >
            <ArrowLeft className="w-4 h-4 text-[#7B8580]" />
            <span>Back to home</span>
          </Link>
          <button
            onClick={signOut}
            className="flex items-center gap-2.5 text-xs font-semibold text-[#5C6661] hover:text-[#153D32] transition"
          >
            <LogOut className="w-4 h-4 text-[#7B8580]" />
            <span>Sign out</span>
          </button>
          <Link 
            href="/help"
            className="flex items-center gap-2.5 text-xs font-semibold text-[#5C6661] hover:text-[#153D32] transition"
          >
            <HelpCircle className="w-4 h-4 text-[#7B8580]" />
            <span>Help & Support</span>
          </Link>
          <Link 
            href="/settings"
            className="flex items-center gap-2.5 text-xs font-semibold text-[#5C6661] hover:text-[#153D32] transition"
          >
            <Settings className="w-4 h-4 text-[#7B8580]" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* Main Page Area */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        {children}
      </main>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-xs"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

    </div>
  );
}
