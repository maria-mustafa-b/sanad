import Link from "next/link";
import { HeroScrollDemo } from "@/components/HeroScrollDemo";
import { SanadHero } from "@/components/landing/sanad-hero";
import { ShieldCheck, FileSearch, Mic } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col w-full">
      
      {/* Full-width Dubai Parallax Hero */}
      <SanadHero />

      {/* Main Content Area */}
      <div className="w-full max-w-5xl mx-auto px-4 py-12 md:py-20">
        
        {/* Cool 3D Scroll Animation */}
        <HeroScrollDemo />

        {/* Feature Grid */}
        <section className="grid md:grid-cols-3 gap-6 mt-10">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-6">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">1. Tell your story</h3>
            <p className="text-gray-600 leading-relaxed">
              Speak naturally in your own language. Our AI understands Urdu, Hindi, Arabic, Bengali, and English, structuring your situation legally.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">2. Cryptographic Proof</h3>
            <p className="text-gray-600 leading-relaxed">
              We seal your claim and evidence on the Polygon blockchain. You receive a Verifiable Credential that cannot be tampered with.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center mb-6">
              <FileSearch className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">3. Find Support</h3>
            <p className="text-gray-600 leading-relaxed">
              Automatically match your situation with the exact government services and legal clinics that can help resolve your case.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
