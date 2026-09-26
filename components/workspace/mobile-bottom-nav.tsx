"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Mic, ShieldCheck, Bell } from "lucide-react";
import { SosEmergencyModal } from "./sos-emergency-modal";

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Proof", icon: ShieldCheck, href: "/credentials" },
    { label: "Tell SANAD", icon: Mic, href: "/understand", isPrimary: true },
    { label: "Alerts", icon: Bell, href: "/notifications" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 py-1 px-3 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-5 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg border-4 border-white transition-transform active:scale-95 no-underline"
                title="Speak to SANAD"
              >
                <Mic size={24} />
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 text-xs font-semibold no-underline transition-colors ${
                isActive ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
        <div className="flex flex-col items-center justify-center">
          <SosEmergencyModal />
        </div>
      </div>
    </div>
  );
}
