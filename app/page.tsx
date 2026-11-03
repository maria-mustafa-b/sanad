"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Search, 
  FileText, 
  ShieldCheck, 
  Bot, 
  Globe2, 
  Lock,
  MessageSquare
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col w-full bg-[#F7F7F2]">
      
      {/* ======================================================== */}
      {/* SECTION 1: HERO (Image 4 exact layout)                   */}
      {/* ======================================================== */}
      <section className="relative w-full min-h-[620px] lg:min-h-[680px] flex items-center overflow-hidden pt-24 pb-16">
        
        {/* Full-width Dubai Skyline Background with Ivory Gradient Mask */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-dubai-bg.jpg"
            alt="Dubai Skyline"
            fill
            priority
            className="object-cover object-right md:object-center"
            sizes="100vw"
          />
          {/* Subtle ivory overlay & left gradient so text is razor sharp */}
          <div className="absolute inset-0 bg-[#F7F7F2]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7F7F2] via-[#F7F7F2]/85 to-transparent w-full md:w-3/5" />
        </div>

        {/* Content aligned to left */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full">
          <div className="max-w-xl space-y-6">
            
            {/* Pill: UAE Flag + UAE Government Services */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#E4E7E1] text-[#202A27] text-xs font-bold shadow-2xs">
              <span className="text-sm">🇦🇪</span>
              <span>UAE Government Services</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#202A27] tracking-tight leading-[1.1]">
              Government Services,<br />
              Made Simple.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#68716D] leading-relaxed max-w-lg">
              An intelligent assistant to help you discover services, understand eligibility and navigate your government journey.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link 
                href="/auth" 
                className="px-6 py-3.5 bg-[#153D32] text-white font-bold text-sm rounded-full hover:bg-[#1a4a3d] transition shadow-xs flex items-center gap-2"
              >
                <span>Try SANAD</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link 
                href="/services" 
                className="px-6 py-3.5 bg-white text-[#202A27] border border-[#153D32]/30 font-bold text-sm rounded-full hover:bg-[#F7F7F2] transition shadow-2xs"
              >
                Explore Services
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-[#202A27]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#153D32]" />
                <span>AI-Powered</span>
              </div>
              <div className="h-4 w-px bg-[#E4E7E1]" />
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#153D32]" />
                <span>Multilingual</span>
              </div>
              <div className="h-4 w-px bg-[#E4E7E1]" />
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#153D32]" />
                <span>Secure & Private</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 2: HOW SANAD WORKS (3 Step Cards with Arrows)    */}
      {/* ======================================================== */}
      <section id="how-it-works" className="w-full py-16 bg-[#F7F7F2]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-[#202A27] tracking-tight">
              How SANAD Works
            </h2>
            <p className="text-sm text-[#68716D] mt-2">
              A simple, guided journey from your situation to the right government support.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Card 1: Discover */}
            <Link href="/services" className="w-full md:w-1/3">
              <div className="bg-[#EDF5F0]/80 hover:bg-[#EDF5F0] p-6 rounded-2xl border border-[#DDEBE3] transition group flex items-start gap-4 h-full shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-white text-[#153D32] flex items-center justify-center shrink-0 shadow-2xs">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#202A27] mb-1">Discover</h3>
                  <p className="text-xs text-[#68716D] leading-relaxed">
                    Find services relevant to your situation.
                  </p>
                </div>
              </div>
            </Link>

            {/* Arrow 1 */}
            <div className="hidden md:flex text-[#68716D] shrink-0">
              <ArrowRight className="w-5 h-5 opacity-60" />
            </div>

            {/* Card 2: Prepare */}
            <Link href="/documents" className="w-full md:w-1/3">
              <div className="bg-[#EDF5F0]/80 hover:bg-[#EDF5F0] p-6 rounded-2xl border border-[#DDEBE3] transition group flex items-start gap-4 h-full shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-white text-[#153D32] flex items-center justify-center shrink-0 shadow-2xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#202A27] mb-1">Prepare</h3>
                  <p className="text-xs text-[#68716D] leading-relaxed">
                    Understand requirements and prepare documents.
                  </p>
                </div>
              </div>
            </Link>

            {/* Arrow 2 */}
            <div className="hidden md:flex text-[#68716D] shrink-0">
              <ArrowRight className="w-5 h-5 opacity-60" />
            </div>

            {/* Card 3: Access */}
            <Link href="/credentials" className="w-full md:w-1/3">
              <div className="bg-[#EDF5F0]/80 hover:bg-[#EDF5F0] p-6 rounded-2xl border border-[#DDEBE3] transition group flex items-start gap-4 h-full shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-white text-[#153D32] flex items-center justify-center shrink-0 shadow-2xs">
                  <ShieldCheck className="w-5 h-5 text-[#166534]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#202A27] mb-1">Access</h3>
                  <p className="text-xs text-[#68716D] leading-relaxed">
                    Get step-by-step guidance and verify your credentials.
                  </p>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 3: YOUR GOVERNMENT SERVICES, IN ONE PLACE        */}
      {/* (Laptop Mockup on Left + 3 Pillars on Right)             */}
      {/* ======================================================== */}
      <section id="about" className="w-full py-16 bg-[#F7F7F2]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Rendered Laptop Mockup */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[500px] aspect-[16/10] drop-shadow-xl">
              <Image 
                src="/dashboard-laptop-mockup.jpg" 
                alt="SANAD Dashboard Laptop Mockup"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
          </div>

          {/* Right: Feature Descriptions */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#202A27] tracking-tight leading-tight">
                Your Government<br />
                Services, in One Place.
              </h2>
              <p className="text-xs sm:text-sm text-[#68716D] mt-2 leading-relaxed">
                A personalised experience with an AI assistant, document intelligence and secure digital credentials.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              
              {/* Feature 1 */}
              <Link href="/chat" className="group">
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E4E7E1] text-[#153D32] flex items-center justify-center shadow-2xs group-hover:bg-[#153D32] group-hover:text-white transition">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <h4 className="font-extrabold text-xs text-[#202A27] group-hover:text-[#153D32] transition">
                    AI Assistant
                  </h4>
                  <p className="text-[11px] text-[#68716D] leading-relaxed">
                    Ask, understand and get guidance.
                  </p>
                </div>
              </Link>

              {/* Feature 2 */}
              <Link href="/documents" className="group">
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E4E7E1] text-[#153D32] flex items-center justify-center shadow-2xs group-hover:bg-[#153D32] group-hover:text-white transition">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h4 className="font-extrabold text-xs text-[#202A27] group-hover:text-[#153D32] transition">
                    Document Intelligence
                  </h4>
                  <p className="text-[11px] text-[#68716D] leading-relaxed">
                    Upload and extract information with AI.
                  </p>
                </div>
              </Link>

              {/* Feature 3 */}
              <Link href="/credentials" className="group">
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E4E7E1] text-[#153D32] flex items-center justify-center shadow-2xs group-hover:bg-[#153D32] group-hover:text-white transition">
                    <ShieldCheck className="w-4 h-4 text-[#166534]" />
                  </div>
                  <h4 className="font-extrabold text-xs text-[#202A27] group-hover:text-[#153D32] transition">
                    Digital Credentials
                  </h4>
                  <p className="text-[11px] text-[#68716D] leading-relaxed">
                    Access and verify your records securely.
                  </p>
                </div>
              </Link>

            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 4: CALL TO ACTION BANNER (Clean Vector Background) */}
      {/* ======================================================== */}
      <section className="w-full pb-16 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden relative min-h-[160px] flex items-center justify-center py-10 shadow-sm bg-gradient-to-r from-[#123E33] via-[#154639] to-[#0E2C24]">
          
          {/* Subtle Skyline Silhouette in Foreground */}
          <div className="absolute left-0 bottom-0 top-0 w-80 opacity-20 pointer-events-none">
            <Image 
              src="/dashboard-burj-bg.jpg"
              alt="Dubai Skyline Silhouette"
              fill
              className="object-cover object-left"
            />
          </div>

          {/* Banner Action Content */}
          <div className="relative z-10 text-center space-y-4 px-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-snug drop-shadow-sm">
              Your Government Journey Starts with SANAD.
            </h2>
            
            <div>
              <Link 
                href="/auth"
                className="inline-flex items-center gap-2 px-7 py-3 bg-white text-[#153D32] hover:text-[#0f2e25] font-extrabold text-xs sm:text-sm rounded-full hover:bg-[#F7F7F2] transition shadow-md group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 5: FOOTER                                        */}
      {/* ======================================================== */}
      <footer className="w-full bg-[#112F27] text-white py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-white/60">
          <div className="flex items-center gap-3">
            <Image 
              src="/sanad-logo-full-transparent.png" 
              alt="SANAD Logo" 
              width={28} 
              height={28} 
              className="object-contain"
            />
            <span className="font-extrabold text-sm text-white">SANAD</span>
            <span className="text-white/40">|</span>
            <span>UAE Responsible AI & Government Service Navigation</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/auth" className="hover:text-white transition">Log In</Link>
            <Link href="/services" className="hover:text-white transition">Services</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
