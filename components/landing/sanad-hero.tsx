"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { ShieldCheck, Mic, CheckCircle, Smartphone } from "lucide-react";

export function SanadHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    tl.to(imageRef.current, {
      yPercent: 15,
      ease: "none",
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[100vh] min-h-[700px] flex items-center justify-center overflow-hidden bg-gray-900"
    >
      <div ref={imageRef} className="absolute inset-0 w-full h-[115%] -top-[5%] z-0">
        <Image
          src="/images/sanad-dubai-hero.jpg"
          alt="Dubai Skyline"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-900/80 via-gray-900/50 to-gray-900/90 mix-blend-multiply" />
      <div className="absolute inset-0 z-0 bg-emerald-900/10" />

      <div ref={contentRef} className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center md:items-start text-center md:text-left mt-16 md:mt-0">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-8 border border-emerald-500/20 backdrop-blur-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>AI • Verified • Accessible</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
          Support you can access. <br className="hidden md:block" />
          <span className="text-emerald-400">Proof you can carry.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed drop-shadow-sm">
          SANAD helps you understand your situation, discover relevant support, create portable verifiable credentials, and navigate your service journey — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto mb-16">
          <Link href="/chat" className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-lg font-bold text-lg hover:bg-emerald-500 transition shadow-[0_0_20px_rgba(5,150,105,0.4)] flex items-center justify-center gap-2">
            Get Started
          </Link>
          <Link href="#how-it-works" className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white backdrop-blur-md border border-white/20 rounded-lg font-bold text-lg hover:bg-white/20 transition flex items-center justify-center gap-2">
            Explore SANAD
          </Link>
        </div>

        <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4 text-sm font-medium text-gray-300">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-emerald-400" />
            <span>AI-Powered & Multilingual</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Verifiable Credentials</span>
          </div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Accessible by Design</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center opacity-70 animate-bounce">
        <span className="text-xs font-bold text-white uppercase tracking-widest mb-2">Scroll to explore</span>
        <div className="w-5 h-8 border-2 border-white/50 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white rounded-full" />
        </div>
      </div>
    </div>
  );
}
