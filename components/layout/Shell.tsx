"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, MessageSquare, ShieldCheck, FileText, Bell, 
  Settings, LogOut, Menu, X, Building2, Clock, FolderOpen
} from "lucide-react";
import { Navbar } from "../Navbar"; // Fallback to original Navbar for public routes

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // If we are on the landing page or verify page, don't show the sidebar layout
  const isPublicRoute = pathname === "/" || pathname.startsWith("/verify");

  if (isPublicRoute) {
    return (
      <>
        <Navbar />
        {children}
        <footer className="bg-slate-950 text-gray-400 py-12 border-t border-slate-900 z-10 relative">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/sanad-logo.png" className="w-8 h-8 opacity-80 object-contain" alt="SANAD"/>
              <span className="font-bold text-white text-lg tracking-wide">SANAD</span>
            </div>
            <div className="flex gap-8 text-sm font-medium">
              <Link href="#" className="hover:text-emerald-400 transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-emerald-400 transition-colors">Terms</Link>
              <Link href="/settings" className="hover:text-emerald-400 transition-colors">Accessibility</Link>
            </div>
            <p className="text-sm">© {new Date().getFullYear()} SANAD. Built for dignity and clarity.</p>
          </div>
        </footer>
      </>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Situation", href: "/chat", icon: MessageSquare },
    { name: "Services", href: "/services", icon: Building2 },
    { name: "My Applications", href: "/applications", icon: FolderOpen },
    { name: "My Credentials", href: "/credentials", icon: ShieldCheck },
    { name: "Documents", href: "/documents", icon: FileText },
    { name: "Notifications", href: "/notifications", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <img src="/sanad-logo.png" alt="SANAD Logo" className="w-8 h-8 object-contain" />
          <span className="font-extrabold text-xl text-gray-900 tracking-tight">SANAD</span>
        </Link>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-gray-600">
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 md:translate-x-0 md:static md:shrink-0
        ${isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
      `}>
        <Link href="/" className="p-6 hidden md:flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity">
          <img src="/sanad-logo.png" alt="SANAD Logo" className="w-8 h-8 object-contain" />
          <span className="font-extrabold text-2xl text-gray-900 tracking-tight">SANAD</span>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                  isActive 
                    ? "bg-teal-50 text-teal-700 shadow-sm border border-teal-100/50" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-teal-600" : "text-gray-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-100 space-y-1">
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
            <Settings className="w-5 h-5 text-gray-400" /> Settings
          </Link>
          
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold text-sm">
                W
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 leading-none mb-1">Worker</p>
                <p className="text-xs font-semibold text-gray-400">Authenticated</p>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        
        {/* Desktop Top Header (for auth routes) */}
        <header className="hidden md:flex bg-white/50 backdrop-blur-md border-b border-gray-100 px-8 py-4 items-center justify-between sticky top-0 z-30">
          <div className="text-sm font-bold text-gray-400">
            {navItems.find(i => pathname.startsWith(i.href))?.name || "Dashboard"}
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </div>
  );
}
