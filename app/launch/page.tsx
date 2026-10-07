"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, FileText, CheckCircle, ShieldCheck, Brain, ArrowRight, Globe } from "lucide-react";

export default function LaunchVideo() {
  const [scene, setScene] = useState(0);

  useEffect(() => {
    // 9 scenes, total 45s
    const timings = [5000, 5000, 5000, 6000, 4000, 6000, 6000, 4000, 4000];
    let current = 0;
    
    const advance = () => {
      if (current >= timings.length - 1) return;
      setTimeout(() => {
        current++;
        setScene(current);
        advance();
      }, timings[current]);
    };
    advance();
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#020617] text-white overflow-hidden flex items-center justify-center font-sans z-50">
      <AnimatePresence mode="wait">
        
        {/* SCENE 01: THE HOOK (0-5s) */}
        {scene === 0 && (
          <motion.div key="s1" className="flex flex-col items-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 1 }}>
            <motion.div className="h-[2px] bg-teal-400 mb-8"
              initial={{ width: 0 }} animate={{ width: 300 }} transition={{ duration: 1.5, ease: "easeInOut" }} />
            <motion.h1 className="text-8xl font-arabic font-bold text-teal-500 mb-4 tracking-widest"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>سَنَد</motion.h1>
            <motion.h2 className="text-6xl font-bold tracking-[0.2em] mb-12"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>SANAD</motion.h2>
            <div className="flex space-x-4 text-2xl font-light text-slate-300">
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>Support you can access.</motion.span>
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4 }}>Proof you can carry.</motion.span>
            </div>
          </motion.div>
        )}

        {/* SCENE 02: THE REAL-WORLD PROBLEM (5-10s) */}
        {scene === 1 && (
          <motion.div key="s2" className="flex flex-col items-center justify-center w-full h-full relative"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {['Salary Slip', 'Employment Contract', 'Visa', 'Form 4B', 'Appeal'].map((text, i) => (
              <motion.div key={i} className="absolute bg-slate-800 border border-slate-700 p-4 rounded-xl text-slate-400 text-xl"
                initial={{ opacity: 0, scale: 0.8, x: ((i * 137) % 800) - 400, y: ((i * 211) % 600) - 300 }}
                animate={{ opacity: [0, 1, 0], scale: 1.2 }}
                transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
              >{text}</motion.div>
            ))}
            <div className="z-10 text-center bg-[#020617]/80 p-12 rounded-3xl backdrop-blur-md">
              <motion.h2 className="text-5xl font-semibold mb-6"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }}>People understand their problems.</motion.h2>
              <motion.h2 className="text-5xl font-semibold text-teal-400"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.5 }}>Systems expect forms.</motion.h2>
            </div>
          </motion.div>
        )}

        {/* SCENE 03: THE HUMAN INPUT (10-15s) */}
        {scene === 2 && (
          <motion.div key="s3" className="flex flex-col items-center w-full max-w-4xl"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}>
            <motion.h3 className="text-3xl text-slate-400 mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Just tell us what happened.</motion.h3>
            <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl flex items-center space-x-6">
              <div className="bg-teal-500/20 p-4 rounded-full"><Mic className="w-8 h-8 text-teal-400" /></div>
              <div className="flex-1 text-3xl font-light text-white leading-relaxed">
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 2 }}>
                  "Meri August ki salary nahi mili aur company bol rahi hai next month milegi."
                </motion.span>
              </div>
            </div>
          </motion.div>
        )}

        {/* SCENE 04: GEMINI UNDERSTANDS (15-21s) */}
        {scene === 3 && (
          <motion.div key="s4" className="flex w-full max-w-5xl items-center justify-between"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <div className="flex-1 pr-12">
              <motion.h2 className="text-5xl font-bold mb-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>AI understands the situation.</motion.h2>
              <motion.h3 className="text-3xl text-teal-400" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 3 }}>You stay in control.</motion.h3>
            </div>
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-8 font-mono text-xl shadow-2xl relative overflow-hidden">
              <Brain className="absolute -bottom-10 -right-10 w-48 h-48 text-teal-500/10" />
              <motion.div className="space-y-4 text-slate-300" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}>Issue <ArrowRight className="inline w-5 text-teal-500 mx-2"/> <span className="text-teal-400">Unpaid Wages</span></motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.0 }}>Period <ArrowRight className="inline w-5 text-teal-500 mx-2"/> <span className="text-teal-400">August 2026</span></motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.5 }}>Employment <ArrowRight className="inline w-5 text-teal-500 mx-2"/> <span className="text-teal-400">Active</span></motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 3.0 }}>Document <ArrowRight className="inline w-5 text-teal-500 mx-2"/> <span className="text-teal-400">Salary Slip</span></motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* SCENE 05: USER CONFIRMATION (21-25s) */}
        {scene === 4 && (
          <motion.div key="s5" className="flex flex-col items-center max-w-lg w-full"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
            <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl mb-8">
              <h3 className="text-slate-400 text-lg uppercase tracking-wider mb-6">Your Situation</h3>
              <div className="space-y-4 text-2xl font-medium mb-10">
                <div className="flex justify-between"><span>Issue</span> <span className="text-white">Unpaid wages</span></div>
                <div className="flex justify-between"><span>Period</span> <span className="text-white">August 2026</span></div>
              </div>
              <motion.button className="w-full bg-teal-500 hover:bg-teal-400 text-[#020617] text-xl font-bold py-5 rounded-2xl flex items-center justify-center space-x-3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                <CheckCircle className="w-6 h-6" /> <span>Confirm details</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* SCENE 06: SERVICE MATCHING (25-31s) */}
        {scene === 5 && (
          <motion.div key="s6" className="flex flex-col items-center w-full max-w-2xl"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }}>
            <div className="flex items-center space-x-6 text-3xl mb-12">
              <motion.span className="text-slate-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>From what happened...</motion.span>
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}><ArrowRight className="w-8 h-8 text-teal-500" /></motion.span>
              <motion.span className="text-teal-400 font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>...to what you can do next.</motion.span>
            </div>
            <motion.div className="w-full bg-slate-900/80 border border-teal-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(20,184,166,0.15)] relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.5 }}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-600 to-teal-400" />
              <h3 className="text-teal-400 text-sm uppercase tracking-widest font-bold mb-2">Relevant Service</h3>
              <h2 className="text-4xl font-bold text-white mb-6">Employment & Labour Support</h2>
              <div className="grid grid-cols-2 gap-6 text-lg">
                <div className="bg-slate-800/50 p-4 rounded-xl">
                  <span className="text-slate-400 block mb-1 text-sm">Required</span>
                  Salary Slip, Visa
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl">
                  <span className="text-slate-400 block mb-1 text-sm">Action</span>
                  File MOHRE Claim
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* SCENE 07: VERIFIABLE CREDENTIAL (31-37s) */}
        {scene === 6 && (
          <motion.div key="s7" className="flex flex-col items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: "blur(10px)" }}>
            <motion.div className="w-[400px] h-[600px] bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between"
              initial={{ rotateY: 90 }} animate={{ rotateY: 0 }} transition={{ duration: 1.5, type: "spring" }}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
              <div>
                <ShieldCheck className="w-16 h-16 text-teal-400 mb-6" />
                <h3 className="text-slate-400 uppercase tracking-widest text-sm mb-2">SANAD</h3>
                <h2 className="text-3xl font-bold text-white leading-tight">Employment<br/>Claim Record</h2>
              </div>
              <div className="bg-slate-950/50 backdrop-blur-md border border-slate-800 rounded-xl p-4">
                <motion.div className="flex items-center space-x-3 text-teal-400 font-medium"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
                  <CheckCircle className="w-5 h-5" /> <span>Record integrity verified</span>
                </motion.div>
                <div className="mt-3 text-xs text-slate-500 font-mono break-all">
                  hash: 0x8f2a9c3e98c76b4a3f12e8b91a2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z...4d1b
                </div>
              </div>
            </motion.div>
            <motion.h2 className="text-4xl mt-12 text-slate-300 tracking-wide"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3 }}>
              Proof you can carry.
            </motion.h2>
          </motion.div>
        )}

        {/* SCENE 08: THE FOUR PILLARS (37-41s) */}
        {scene === 7 && (
          <motion.div key="s8" className="flex flex-col items-center justify-center w-full h-full"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-2 gap-16 mb-16 relative">
              <motion.div className="flex flex-col items-center" initial={{ opacity: 0, x: -50, y: -50 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.5 }}>
                <Brain className="w-12 h-12 text-teal-400 mb-4" /><span className="tracking-widest">AI</span>
              </motion.div>
              <motion.div className="flex flex-col items-center" initial={{ opacity: 0, x: 50, y: -50 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 1.0 }}>
                <FileText className="w-12 h-12 text-teal-400 mb-4" /><span className="tracking-widest">SERVICES</span>
              </motion.div>
              <motion.div className="flex flex-col items-center" initial={{ opacity: 0, x: -50, y: 50 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 1.5 }}>
                <ShieldCheck className="w-12 h-12 text-teal-400 mb-4" /><span className="tracking-widest">WEB3</span>
              </motion.div>
              <motion.div className="flex flex-col items-center" initial={{ opacity: 0, x: 50, y: 50 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 2.0 }}>
                <Globe className="w-12 h-12 text-teal-400 mb-4" /><span className="tracking-widest">ACCESSIBILITY</span>
              </motion.div>
            </div>
            <motion.div className="flex space-x-6 text-2xl font-bold text-teal-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>
              <span>Understand.</span><span>Support.</span><span>Verify.</span>
            </motion.div>
          </motion.div>
        )}

        {/* FINAL SCENE (41-45s) */}
        {scene === 8 && (
          <motion.div key="s9" className="flex flex-col items-center justify-center relative w-full h-full"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
            <div className="absolute bottom-0 w-full h-64 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Dubai_Skyline_Silhouette.svg/1024px-Dubai_Skyline_Silhouette.svg.png')] bg-no-repeat bg-bottom bg-contain opacity-10" />
            
            <motion.h1 className="text-8xl font-arabic font-bold text-white mb-2 tracking-widest"
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 4 }}>سَنَد</motion.h1>
            <motion.h2 className="text-6xl font-bold tracking-[0.3em] mb-12 text-teal-500"
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 4 }}>SANAD</motion.h2>
            
            <div className="flex flex-col items-center space-y-2 text-2xl font-light text-slate-300 mb-16">
              <span>Support you can access.</span>
              <span>Proof you can carry.</span>
            </div>

            <div className="text-sm tracking-[0.4em] text-slate-500 flex items-center space-x-4">
              <span>AI</span><span className="w-1 h-1 bg-teal-500 rounded-full" />
              <span>WEB3</span><span className="w-1 h-1 bg-teal-500 rounded-full" />
              <span>ACCESSIBILITY</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
