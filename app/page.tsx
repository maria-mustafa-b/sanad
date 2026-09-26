import Link from "next/link";
import { HeroScrollDemo } from "@/components/HeroScrollDemo";
import { SanadHero } from "@/components/landing/sanad-hero";
import { ShieldCheck, FileSearch, Mic, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col w-full bg-gray-50">
      
      {/* Full-width Dubai Parallax Hero */}
      <SanadHero />

      {/* Dark Section for the 3D Scroll Demo to seamlessly blend with the Hero */}
      <div className="w-full bg-gray-900 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
          <HeroScrollDemo />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-5xl mx-auto px-4 py-20">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">How SANAD Empowers You</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A complete end-to-end ecosystem for understanding your situation, creating verifiable evidence, and applying for government support.
          </p>
        </div>

        {/* Feature Grid */}
        <section className="grid md:grid-cols-3 gap-8 mb-24">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
              <Mic className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">1. Voice Intake</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Speak naturally in Urdu, Hindi, Arabic, Bengali, or English. Our AI transcripts, translates, and structures your situation legally in real-time.
            </p>
            <Link href="/chat" className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Start Voice Intake <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">2. Cryptographic Proof</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Upload documents for AI OCR verification. We seal your claim and evidence on the Polygon blockchain as a tamper-proof Verifiable Credential.
            </p>
            <Link href="/documents" className="text-emerald-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Open Document Vault <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 border border-purple-100">
              <FileSearch className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">3. Find Support</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Automatically match your situation with the exact UAE government services and legal clinics that can help resolve your specific case.
            </p>
            <Link href="/services" className="text-purple-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Browse UAE Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
