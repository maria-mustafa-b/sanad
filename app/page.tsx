import Link from "next/link";
import { SanadHero } from "@/components/landing/sanad-hero";
import { ServicesPreview } from "@/components/landing/services-preview";
import { Features } from "@/components/ui/features-4";
import { ShieldCheck, Users, Globe2, Lock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col w-full bg-white">
      
      {/* Full-width Dubai Parallax Hero */}
      <SanadHero />

      {/* New Features Grid (from user snippet) */}
      <Features />

      {/* Services Preview Section */}
      <ServicesPreview />

      {/* Stats / Trust Section */}
      <section className="w-full bg-slate-900 py-24 border-t border-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center divide-x divide-slate-800">
            <div className="flex flex-col items-center">
              <Globe2 className="w-10 h-10 text-emerald-500 mb-4 opacity-80" />
              <div className="text-4xl font-black mb-2">5+</div>
              <div className="text-gray-400 font-medium tracking-wide">Languages Supported</div>
            </div>
            <div className="flex flex-col items-center">
              <Lock className="w-10 h-10 text-emerald-500 mb-4 opacity-80" />
              <div className="text-4xl font-black mb-2">Web3</div>
              <div className="text-gray-400 font-medium tracking-wide">Polygon Amoy Testnet</div>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-10 h-10 text-emerald-500 mb-4 opacity-80" />
              <div className="text-4xl font-black mb-2">Zero</div>
              <div className="text-gray-400 font-medium tracking-wide">Mock Data</div>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-10 h-10 text-emerald-500 mb-4 opacity-80" />
              <div className="text-4xl font-black mb-2">24/7</div>
              <div className="text-gray-400 font-medium tracking-wide">AI Legal structuring</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
