"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  Bell, 
  Keyboard, 
  Mic, 
  MicOff,
  Users, 
  Home, 
  Heart, 
  Briefcase,
  Loader2,
  ArrowRight
} from "lucide-react";
import { VoicePoweredOrb } from "@/components/ui/voice-powered-orb";
import { useSituation } from "@/lib/context/SituationContext";

export default function DashboardPage() {
  const router = useRouter();
  const { addMessage, updateProfile } = useSituation();

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sanad_user");
      if (stored) {
        try { setUserProfile(JSON.parse(stored)); } catch (e) {}
      }
    }
  }, []);

  // Web Speech API for voice recognition on Ask SANAD
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        
        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.onerror = (e: any) => {
          console.warn("Speech recognition error:", e);
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Handle user speech submission
  const handleVoiceToggle = () => {
    if (!recognitionRef.current) {
      // Fallback for browsers without speech API
      router.push("/chat");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      if (transcript.trim()) {
        processSpokenQuery(transcript.trim());
      }
    } else {
      setTranscript("");
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        setIsRecording(false);
      }
    }
  };

  // The chat page sends ?q= to the assistant with full conversation context.
  const processSpokenQuery = (spokenText: string) => {
    setIsAiProcessing(true);
    router.push(`/chat?q=${encodeURIComponent(spokenText)}&send=1`);
  };

  const examplePrompts = [
    {
      icon: Users,
      text: "I want to sponsor my parents.",
      query: "I want to sponsor my parents to UAE under my residency"
    },
    {
      icon: Home,
      text: "I need to renew my residency.",
      query: "How do I renew my UAE residency visa?"
    },
    {
      icon: Heart,
      text: "What health insurance options do I have?",
      query: "What are the mandatory health insurance options for UAE residents?"
    },
    {
      icon: Briefcase,
      text: "I'm looking for education support.",
      query: "What government education support and school sponsorships are available in UAE?"
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-2rem)] flex flex-col justify-between overflow-hidden bg-[#FAFBF8] antialiased">
      
      {/* Right Background: Burj Khalifa Skyline & Waters */}
      <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[50%] pointer-events-none z-0">
        <Image 
          src="/dashboard-burj-bg.jpg" 
          alt="Dubai Skyline Background" 
          fill
          priority
          className="object-cover object-top sm:object-right-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAFBF8] via-[#FAFBF8]/80 to-transparent"></div>
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#FAFBF8] to-transparent"></div>
      </div>

      {/* ================= TOP RIGHT NAV BAR ================= */}
      <header className="relative z-10 w-full px-6 sm:px-10 py-5 flex items-center justify-end gap-3">
        <Link 
          href="/notifications"
          className="relative p-2.5 rounded-full bg-white/90 backdrop-blur-md border border-[#E3E7E0] text-[#202A27] hover:text-[#153D32] shadow-2xs transition"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E53E3E] ring-2 ring-white"></span>
        </Link>

        <div className="w-9 h-9 rounded-full bg-[#E3ECE7] border border-[#CCD8D1] text-[#153D32] font-bold text-xs flex items-center justify-center shadow-2xs">
          {userProfile?.name ? userProfile.name.slice(0, 2).toUpperCase() : "SK"}
        </div>
      </header>

      {/* ================= CENTER HERO SECTION ================= */}
      <main className="relative z-10 max-w-4xl mx-auto w-full px-4 sm:px-8 py-2 flex flex-col items-center text-center space-y-6">
        
        {/* Title */}
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-7 h-7 text-[#153D32] fill-[#153D32]" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#153D32] tracking-tight">
            How can I help you today?
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm md:text-base text-[#5C6661] max-w-xl leading-relaxed">
          Tell me about your situation in your own language, and I'll find the right government support, explain your eligibility and guide you through the steps.
        </p>

        {/* Languages are detected automatically; this is information, not a selector */}
        <p className="text-[11px] text-[#5C6661] pt-1">
          Speak or type in Arabic, English, हिंदी, اردو, മലയാളം, বাংলা or Hinglish. SANAD detects your language automatically.
        </p>

        {/* ================= VOICE ORB & INTERACTION CARD (CENTERED MICROPHONE) ================= */}
        <div className="w-full max-w-xl bg-white/95 backdrop-blur-md rounded-[32px] border border-[#BCE1CA] p-6 sm:p-8 shadow-[0_15px_40px_rgba(21,61,50,0.06)] flex flex-col items-center justify-center relative mt-2 space-y-6">
          
          {/* Top Audio Visualizer Wave / WebGL Orb */}
          <div className="flex flex-col items-center justify-center space-y-2 w-full text-center">
            <div className="relative w-36 h-28 flex items-center justify-center overflow-hidden mx-auto">
              <VoicePoweredOrb 
                className="w-full h-full"
                hue={150} // Emerald Green Theme matching SANAD
                enableVoiceControl={true}
                onVoiceDetected={(detected) => setIsRecording(detected)}
              />
            </div>
            
            <h3 className="text-base sm:text-lg font-extrabold text-[#153D32]">
              {isRecording ? "Listening to your voice..." : "Speak to SANAD"}
            </h3>
            <p className="text-xs text-[#7B8580] max-w-sm">
              {isRecording 
                ? (transcript || "Speak clearly into your microphone...") 
                : "Tap the mic and tell me what you need in your language"}
            </p>
          </div>

          {/* Centered Microphone Action Row */}
          <div className="w-full flex items-center justify-between pt-4 border-t border-[#F0F3EE] px-4">
            
            {/* Keyboard Button (Left) */}
            <Link 
              href="/chat"
              className="p-3 rounded-full bg-[#FAFBF9] border border-[#E3E7E0] text-[#5C6661] hover:text-[#153D32] hover:bg-white transition shadow-2xs cursor-pointer"
              title="Type your question"
            >
              <Keyboard className="w-5 h-5" />
            </Link>

            {/* BIG CENTERED GLOWING MICROPHONE BUTTON */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`relative p-5 rounded-full text-white transition transform hover:scale-105 active:scale-95 cursor-pointer ${
                  isRecording 
                    ? "bg-red-600 ring-8 ring-red-100 animate-pulse shadow-[0_8px_30px_rgba(220,38,38,0.4)]" 
                    : "bg-[#153D32] hover:bg-[#103027] ring-8 ring-[#EAF5EF] shadow-[0_8px_25px_rgba(21,61,50,0.3)]"
                }`}
                title={isRecording ? "Tap to stop & analyze" : "Click to speak"}
              >
                {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              </button>
              <span className="text-[11px] font-bold text-[#153D32] mt-2">
                {isRecording ? "Listening... (Tap to finish)" : "Tap to speak"}
              </span>
            </div>

            {/* Try an Example (Right) */}
            <Link
              href="/chat?q=I+want+to+sponsor+my+parents+to+the+UAE&send=1"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#FAFBF9] border border-[#E3E7E0] text-xs font-bold text-[#153D32] hover:bg-white transition shadow-2xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#153D32]" />
              <span>Try example</span>
            </Link>

          </div>

          {isAiProcessing && (
            <div className="flex items-center gap-2 text-xs font-bold text-[#153D32] bg-[#EBF7EE] border border-[#BBF7D0] px-4 py-2 rounded-full animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>SANAD AI is analyzing your speech...</span>
            </div>
          )}

        </div>

      </main>

      {/* ================= BOTTOM PROMPTS ================= */}
      <footer className="relative z-10 max-w-5xl mx-auto w-full px-6 py-6 space-y-3">
        <p className="text-xs font-bold text-[#5C6661] text-left">
          You can say for example:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {examplePrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => processSpokenQuery(item.query)}
              className="bg-white/95 backdrop-blur-sm border border-[#E3E7E0] hover:border-[#153D32] p-3.5 rounded-2xl flex items-center gap-3 transition shadow-2xs group text-left cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-[#FAFBF9] border border-[#ECEFEA] text-[#153D32] flex items-center justify-center shrink-0 group-hover:bg-[#153D32] group-hover:text-white transition">
                <item.icon className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-[#202A27] leading-snug group-hover:text-[#153D32] transition">
                {item.text}
              </p>
            </button>
          ))}
        </div>
      </footer>

    </div>
  );
}
