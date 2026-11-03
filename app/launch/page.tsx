"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Globe2, 
  Lock, 
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  Search,
  Check,
  AlertTriangle
} from "lucide-react";

export default function LaunchVideoCinematic() {
  const [scene, setScene] = useState(0);

  useEffect(() => {
    // Perfectly matched to the voiceover timestamps in master_soundtrack.mp3:
    // Scene 1: 0 - 17s (The Problem)
    // Scene 2: 17 - 31s (Introducing SANAD)
    // Scene 3: 31 - 46s (Voice-First Accessibility & Live AI Parsing)
    // Scene 4: 46 - 65s (Document OCR & Verifiable Credential)
    // Scene 5: 65 - 78s (Human Dignity & Platform Impact)
    // Scene 6: 78 - 92s (Brand Reveal & Tagline Crescendo)
    const t1 = setTimeout(() => setScene(1), 17000);
    const t2 = setTimeout(() => setScene(2), 31000);
    const t3 = setTimeout(() => setScene(3), 46000);
    const t4 = setTimeout(() => setScene(4), 65000);
    const t5 = setTimeout(() => setScene(5), 78000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#070709] text-[#f4efe6] overflow-hidden flex items-center justify-center font-sans select-none">
      {/* Background dynamic grid and lighting glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#13131a_1px,transparent_1px),linear-gradient(to_bottom,#13131a_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#d4af37]/8 rounded-full blur-[140px] pointer-events-none" />

      {/* Top persistent subtle status watermark */}
      <div className="absolute top-8 left-12 right-12 flex justify-between items-center text-xs text-neutral-500 font-mono tracking-widest z-30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
          <span>SANAD CORE OS • DEMO LAUNCH</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>AI ENGINE: GEMINI MULTIMODAL</span>
          <span>•</span>
          <span>POLYGON AMOY INTEGRITY</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ======================================================== */}
        {/* SCENE 1 — THE PROBLEM | 0:00–0:17                        */}
        {/* ======================================================== */}
        {scene === 0 && (
          <motion.div
            key="scene-1"
            className="flex flex-col items-center justify-center max-w-5xl text-center px-8 z-10 w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181822]/90 border border-[#2b2b3a] text-[11px] uppercase tracking-[0.3em] text-[#d4af37] mb-8 shadow-lg"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>THE BARRIER • COMPLEXITY & DISCONNECTION</span>
            </motion.div>

            {/* Kinetic floating UI problem fragments with parallax motion */}
            <div className="relative w-full h-44 mb-6">
              {[
                { title: "Standard Employment Contract § 14", sub: "Withheld final gratuity & repatriation", x: -280, y: -25, rot: -5, delay: 1.2 },
                { title: "Wage Protection System (WPS) Flag", sub: "Payment non-remittance > 42 days", x: 260, y: -15, rot: 4, delay: 2.0 },
                { title: "MOHRE Grievance Form 3B", sub: "Complex Arabic & English requirements", x: -210, y: 55, rot: 3, delay: 2.8 },
                { title: "Visa Status Cancellation Notice", sub: "Deadline countdown in progress", x: 230, y: 50, rot: -3, delay: 3.6 }
              ].map((doc, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.7, x: doc.x, y: doc.y, rotate: doc.rot }}
                  animate={{ opacity: 0.9, scale: 1, y: [doc.y - 4, doc.y + 4, doc.y - 4] }}
                  transition={{ 
                    opacity: { delay: doc.delay, duration: 1 },
                    scale: { delay: doc.delay, duration: 1 },
                    y: { repeat: Infinity, duration: 4 + idx, ease: "easeInOut" }
                  }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-5 py-3.5 rounded-xl bg-[#121218]/95 border border-[#272733] shadow-2xl text-left"
                >
                  <div className="flex items-center gap-2 text-xs font-mono text-[#d4af37] mb-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{doc.title}</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 font-light">{doc.sub}</div>
                </motion.div>
              ))}
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4.8, duration: 1.2 }}
              className="text-4xl md:text-6xl font-light tracking-tight text-[#f4efe6] mb-6 leading-tight max-w-4xl"
            >
              When help feels out of reach,{" "}
              <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f7d97b] to-[#d4af37]">
                where do you turn?
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 8.0, duration: 1.2 }}
              className="text-lg md:text-xl text-neutral-400 font-light max-w-2xl leading-relaxed"
            >
              Knowing your rights isn't enough when systems expect complicated forms, unfamiliar terminology, and inaccessible pathways.
            </motion.p>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* SCENE 2 — INTRODUCING SANAD | 0:17–0:31                 */}
        {/* ======================================================== */}
        {scene === 1 && (
          <motion.div
            key="scene-2"
            className="flex flex-col items-center justify-center max-w-4xl text-center px-8 z-10"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -25, filter: "blur(10px)" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Glowing brand pulse */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 180 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mb-8"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1.2 }}
              className="text-8xl md:text-9xl font-serif text-[#d4af37] mb-2 font-normal tracking-wide drop-shadow-[0_0_35px_rgba(212,175,55,0.25)]"
            >
              سَنَد
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1.1 }}
              className="text-5xl md:text-6xl font-light tracking-[0.3em] text-[#f4efe6] mb-8"
            >
              SANAD
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2, duration: 1.1 }}
              className="space-y-3"
            >
              <h2 className="text-2xl md:text-3xl font-light text-[#f4efe6]">
                AI-Powered Guidance • Human-Centered Impact
              </h2>
              <p className="text-base text-neutral-400 font-light max-w-lg mx-auto leading-relaxed">
                A supportive guide designed to help people understand their situations, discover relevant services, and move forward with confidence.
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* SCENE 3 — VOICE-FIRST ACCESSIBILITY | 0:31–0:46         */}
        {/* ======================================================== */}
        {scene === 2 && (
          <motion.div
            key="scene-3"
            className="flex flex-col items-center justify-center max-w-4xl w-full px-6 z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 1.2 }}
          >
            <div className="text-center mb-8">
              <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-mono">01 • ACCESSIBLE INTAKE</span>
              <h2 className="text-3xl md:text-5xl font-light text-[#f4efe6] mt-2">Speak naturally in your own words.</h2>
            </div>

            {/* High-end SaaS Voice Interface Card with live sound bars & streaming tokens */}
            <div className="w-full bg-[#111116] border border-[#262633] rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#20202b]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                    <Mic className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#f4efe6]">Live Voice Ingestion</div>
                    <div className="text-xs font-mono text-neutral-400">Continuous Hindi / Urdu / Arabic Audio Stream</div>
                  </div>
                </div>

                {/* Simulated Audio Waveform Bar Visualizer */}
                <div className="flex items-center gap-1.5 h-8">
                  {[24, 40, 16, 56, 32, 64, 28, 48, 20, 60, 36, 18].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [12, h, 14] }}
                      transition={{ repeat: Infinity, duration: 1 + (i % 4) * 0.2, ease: "easeInOut" }}
                      className="w-1 bg-[#d4af37] rounded-full"
                    />
                  ))}
                </div>
              </div>

              {/* Live natural speech transcription */}
              <div className="p-5 rounded-2xl bg-[#171720] border border-[#2b2b3b] text-neutral-200 text-lg md:text-xl font-light leading-relaxed mb-6">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 1.5 }}
                >
                  “Meri August ki salary nahi mili aur company bol rahi hai next month milegi.”
                </motion.span>
              </div>

              {/* Semantic Intent Structuring - Extracted Live by Gemini */}
              <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.4, duration: 0.8 }}
                  className="p-3.5 rounded-xl bg-[#13131a] border border-[#262633]"
                >
                  <span className="text-neutral-500 block mb-1">LEGAL INTENT</span>
                  <span className="text-[#d4af37] font-sans text-sm font-medium">Unpaid Wages Claim</span>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3.2, duration: 0.8 }}
                  className="p-3.5 rounded-xl bg-[#13131a] border border-[#262633]"
                >
                  <span className="text-neutral-500 block mb-1">INCIDENT PERIOD</span>
                  <span className="text-neutral-200 font-sans text-sm font-medium">August (Overdue &gt;30d)</span>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 4.0, duration: 0.8 }}
                  className="p-3.5 rounded-xl bg-[#13131a] border border-[#262633]"
                >
                  <span className="text-neutral-500 block mb-1">AI CONFIDENCE</span>
                  <span className="text-emerald-400 font-sans text-sm font-medium">96.8% Certainty</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* SCENE 4 — DOCUMENTS & VERIFIABLE CREDENTIALS | 0:46–0:65*/}
        {/* ======================================================== */}
        {scene === 3 && (
          <motion.div
            key="scene-4"
            className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-5xl px-8 z-10 w-full"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 1.2 }}
          >
            {/* Left Card: Document Vision Extraction */}
            <div className="flex-1 bg-[#121218] border border-[#242432] rounded-3xl p-7 shadow-2xl w-full">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#20202c]">
                <div className="flex items-center gap-2.5 text-xs font-mono text-neutral-300">
                  <FileText className="w-4 h-4 text-[#d4af37]" />
                  <span>Salary Slip OCR Analysis</span>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-700/60 text-emerald-300">
                  ✓ Verified Document
                </span>
              </div>
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between py-2 border-b border-[#1c1c27]">
                  <span className="text-neutral-400">Employer Entity</span>
                  <span className="text-neutral-200 font-medium">Al-Noor Contracting LLC</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1c1c27]">
                  <span className="text-neutral-400">Claimed Wage</span>
                  <span className="text-[#d4af37] font-medium text-sm">AED 4,850.00</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-neutral-400">Clause Flag</span>
                  <span className="text-amber-300 font-medium">Passport Withholding Detected</span>
                </div>
              </div>
            </div>

            {/* Right Card: Portable Verifiable Credential */}
            <div className="flex-1 bg-[#14141d] border border-[#343445] rounded-3xl p-7 shadow-[0_20px_60px_rgba(0,0,0,0.85)] relative overflow-hidden w-full">
              <div className="absolute top-0 right-0 w-44 h-44 bg-[#d4af37]/12 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-3.5 mb-6">
                <ShieldCheck className="w-8 h-8 text-[#d4af37]" />
                <div>
                  <h3 className="text-lg font-medium text-[#f4efe6]">SANAD Verifiable Claim Record</h3>
                  <p className="text-xs text-neutral-400">Cryptographically verifiable on-chain record</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0c0c11] border border-[#222230] space-y-2.5 mb-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400 font-mono">INTEGRITY STATE</span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-medium text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    Record Integrity Verified
                  </span>
                </div>
                <div className="text-[11px] font-mono text-neutral-400 break-all bg-[#14141a] p-2 rounded-lg border border-[#1f1f28]">
                  0x9f4e2b8...a71c (Polygon Amoy Testnet)
                </div>
              </div>

              <div className="text-xs text-neutral-400 font-light leading-relaxed">
                Portable proof workers can carry, present, and verify across support organizations with full sovereignty.
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* SCENE 5 — THE HUMAN IMPACT | 0:65–0:78                  */}
        {/* ======================================================== */}
        {scene === 4 && (
          <motion.div
            key="scene-5"
            className="flex flex-col items-center justify-center max-w-4xl text-center px-8 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 1.2 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-xs uppercase tracking-[0.35em] text-[#d4af37] font-mono mb-6"
            >
              HUMAN DIGNITY • TECHNOLOGY WITH PURPOSE
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-light text-[#f4efe6] mb-6 tracking-tight leading-tight">
              Technology should do more than process information.
            </h2>

            <p className="text-xl md:text-2xl text-neutral-300 font-light max-w-2xl leading-relaxed mb-10">
              It should help people understand their options, navigate complexity, and{" "}
              <span className="text-[#d4af37] font-medium">take their next step with dignity.</span>
            </p>

            <div className="flex items-center gap-8 text-xs text-neutral-400 font-mono">
              <span className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#d4af37]" /> Multilingual Speech
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#d4af37]" /> Zero Forced Tracking
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d4af37]" /> Human-First AI
              </span>
            </div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* SCENE 6 — BRAND REVEAL & CRESCENDO | 0:78–0:92          */}
        {/* ======================================================== */}
        {scene === 5 && (
          <motion.div
            key="scene-6"
            className="flex flex-col items-center justify-center max-w-3xl text-center px-8 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 1.4 }}
              className="text-8xl md:text-9xl font-serif text-[#d4af37] mb-2 font-normal drop-shadow-[0_0_45px_rgba(212,175,55,0.3)]"
            >
              سَنَد
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 1.2 }}
              className="text-5xl md:text-6xl font-light tracking-[0.3em] text-[#f4efe6] mb-8"
            >
              SANAD
            </motion.div>

            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0, duration: 1.2 }}
              className="text-2xl md:text-3xl font-light text-[#f4efe6] mb-4"
            >
              Support that starts with understanding.
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.0, duration: 1.2 }}
              className="text-sm uppercase tracking-[0.35em] text-neutral-400 font-mono"
            >
              AI-POWERED GUIDANCE • HUMAN-CENTERED IMPACT
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
