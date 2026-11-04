"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Sparkles, 
  Bell, 
  Mic, 
  MicOff,
  Send, 
  Plus, 
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  RefreshCw
} from "lucide-react";
import { useSituation } from "@/lib/context/SituationContext";

const voiceErrors: Record<string, string> = {
  "not-allowed": "Microphone access is blocked. Allow the mic in your browser settings, or type instead.",
  "service-not-allowed": "Microphone access is blocked. Allow the mic in your browser settings, or type instead.",
  "no-speech": "I didn't hear anything. Tap the mic and try again.",
  "audio-capture": "No microphone was found. Check your mic, or type instead.",
  "network": "Voice recognition needs an internet connection. Try again, or type instead.",
};

function ChatVoiceInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") || "";

  const { profile, messages, addMessage, updateProfile, clearChat } = useSituation();
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Read a reply aloud in the script it was written in.
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopSpeaking = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    setSpeakingId(null);
  };

  // Browser voice fallback: prefer a "Natural"/"Online" neural voice for the text's language.
  const speakWithBrowser = (id: string, text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return setSpeakingId(null);
    const lang = /[؀-ۿ]/.test(text) ? (/[ٹڈڑںھہے]/.test(text) ? "ur" : "ar")
      : /[ऀ-ॿ]/.test(text) ? "hi"
      : /[ঀ-৿]/.test(text) ? "bn"
      : /[ഀ-ൿ]/.test(text) ? "ml"
      : "en";
    const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith(lang));
    const voice = voices.find((v) => /natural|online|neural|google/i.test(v.name)) || voices[0];
    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.lang = voice?.lang || lang;
    u.rate = 0.95;
    u.onend = () => setSpeakingId(null);
    u.onerror = () => setSpeakingId(null);
    window.speechSynthesis.speak(u);
  };

  // Natural neural voice from the server first, browser voice if that fails.
  const speak = async (id: string, text: string) => {
    if (speakingId === id) return stopSpeaking();
    stopSpeaking();
    setSpeakingId(id);
    try {
      const res = await fetch("/api/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("tts");
      const url = URL.createObjectURL(await res.blob());
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { URL.revokeObjectURL(url); setSpeakingId(null); };
      await audio.play();
    } catch {
      speakWithBrowser(id, text);
    }
  };
  const [inputText, setInputText] = useState(initialQuery);
  const [isRecording, setIsRecording] = useState(false);
  const [autoSendVoice, setAutoSendVoice] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sanad_user");
      if (stored) {
        try { setUserProfile(JSON.parse(stored)); } catch (e) {}
      }
    }
  }, []);

  // Web Speech API
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = navigator.language || "en-US";
        recognition.onerror = (e: any) => {
          setVoiceError(voiceErrors[e.error] || "Voice input failed. Try again, or type instead.");
          setIsRecording(false);
        };
        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInputText(transcript);
        };
        recognition.onend = () => {
          setIsRecording(false);
          setAutoSendVoice(true);
        };
        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use text input or Chrome/Edge.");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setVoiceError("");
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch {
        setVoiceError("Voice input could not start. Try again, or type instead.");
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiProcessing]);

  // When the user stops speaking, send what was transcribed.
  useEffect(() => {
    if (autoSendVoice) {
      setAutoSendVoice(false);
      if (inputText.trim()) handleSend();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSendVoice]);

  // Voice/typed query handed over from the dashboard: send it once.
  const autoSent = useRef(false);
  useEffect(() => {
    if (!autoSent.current && initialQuery && searchParams?.get("send") === "1") {
      autoSent.current = true;
      router.replace("/chat");
      handleSend(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isAiProcessing) return;

    // 1. Add user message
    addMessage({
      sender: "user",
      text: text,
    });
    setInputText("");
    setIsAiProcessing(true);

    try {
      // 2. Send the whole conversation so the assistant keeps context and language
      const history = [...messages, { sender: "user" as const, text }].map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));
      const knownFacts = Object.fromEntries(
        Object.values(profile?.facts || {}).map((f) => [f.label, f.value])
      );

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, profile: knownFacts }),
      });
      const data = await res.json();

      if (!res.ok) {
        addMessage({
          sender: "sanad",
          text: data?.message || "SANAD could not answer right now. Nothing was saved. Please try again.",
        });
        return;
      }

      // 3. Store only facts the user explicitly stated
      const facts = { ...(profile?.facts || {}) };
      // New or changed values need the user's confirmation on My Situation.
      for (const f of data.facts || []) {
        const prev = facts[f.key];
        facts[f.key] = { label: f.label, value: f.value, source: "Conversation", confirmed: prev?.value === f.value && prev.confirmed };
      }
      updateProfile({
        facts,
        services: data.services || [],
        missing_info: data.missing_info || [],
        target_service: data.services?.[0]?.title || profile?.target_service || "",
        service_category: data.services?.[0]?.category || profile?.service_category || "",
      });

      // 4. Assistant reply in the user's language, with at most one follow-up question
      addMessage({
        sender: "sanad",
        text: data.next_question ? `${data.reply}\n\n${data.next_question}` : data.reply,
        // The connected journey: chat -> documents (OCR) -> situation -> services -> application
        quickActions: [
          { label: "Upload documents", href: "/documents" },
          { label: "View My Situation", href: "/situation" },
          ...((data.services || []).some((s: { title: string }) => /family|sponsor|parent/i.test(s.title))
            ? [{ label: "Prepare application", href: "/applications/family-sponsorship" }]
            : []),
        ],
      });
    } catch (e) {
      addMessage({
        sender: "sanad",
        text: "Network error: SANAD could not reach the assistant. Nothing was saved. Please try again.",
      });
    } finally {
      setIsAiProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-5xl mx-auto px-4 sm:px-6 py-4 animate-in fade-in duration-300">
      
      {/* ================= TOP HEADER (Matching Screen 3) ================= */}
      <header className="flex items-center justify-between pb-4 border-b border-[#ECEFEA] shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 rounded-xl bg-white border border-[#E3E7E0] text-[#153D32] hover:bg-[#F4F6F2] transition text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <span>← Ask SANAD</span>
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-[#153D32] tracking-tight">
              Conversation with SANAD
            </h1>
            <p className="text-[11px] text-[#6E7873]">
              Explain your situation naturally. SANAD understands and creates your profile.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {messages.length > 0 && (
            <button
              onClick={() => { stopSpeaking(); clearChat(); }}
              className="px-3 py-1.5 rounded-full bg-white border border-[#E3E7E0] text-[11px] font-bold text-[#153D32] hover:bg-[#F4F6F2]"
            >
              New conversation
            </button>
          )}
          <Link 
            href="/notifications"
            className="relative p-2 rounded-full bg-white border border-[#E3E7E0] text-[#202A27] hover:text-[#153D32] shadow-2xs transition"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E53E3E] ring-2 ring-white"></span>
          </Link>
          <div className="w-8 h-8 rounded-full bg-[#E3ECE7] border border-[#CCD8D1] text-[#153D32] font-bold text-xs flex items-center justify-center shadow-2xs">
            {userProfile?.name ? userProfile.name.slice(0, 2).toUpperCase() : "SK"}
          </div>
        </div>
      </header>

      {/* ================= CHAT MESSAGES SCROLL AREA (Screen 3) ================= */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-2">
        {messages.length === 0 && !isAiProcessing && (
          <div className="text-center py-16 space-y-3">
            <p className="text-lg font-black text-[#153D32]">Tell SANAD what you need.</p>
            <p className="text-xs text-[#68716D] max-w-md mx-auto">
              Type or tap the mic and speak in any language. SANAD asks one question at a time and remembers your answers.
            </p>
          </div>
        )}
        {voiceError && (
          <p role="alert" className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-4 py-2 rounded-xl">
            {voiceError}
          </p>
        )}
        {isRecording && (
          <div className="flex justify-end">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              {inputText || "Listening..."}
            </div>
          </div>
        )}
        {messages.map((msg, idx) => {
          const isUser = msg.sender === "user";

          return (
            <div
              key={msg.id || idx}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-1.5 animate-in fade-in duration-200`}
            >
              {/* Message Bubble Container */}
              <div className="flex items-start gap-3 max-w-[85%] sm:max-w-[75%]">
                
                {/* Assistant Brand Avatar */}
                {!isUser && (
                  <div className="w-9 h-9 rounded-2xl bg-[#153D32] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                    سند
                  </div>
                )}

                <div className={`space-y-3 ${isUser ? "items-end" : "items-start"}`}>
                  
                  {/* User Bubble */}
                  {isUser ? (
                    <div className="bg-[#EBF5EF] text-[#153D32] border border-[#BCE1CA] px-5 py-3.5 rounded-2xl rounded-tr-xs shadow-2xs flex items-center gap-3">
                      <Mic className="w-4 h-4 text-[#153D32] shrink-0" />
                      <p className="text-xs sm:text-sm font-medium leading-relaxed">
                        {msg.text}
                      </p>
                    </div>
                  ) : (
                    /* SANAD Bubble */
                    <div className="bg-white text-[#202A27] border border-[#ECEFEA] p-5 rounded-2xl rounded-tl-xs shadow-2xs space-y-4">
                      <p className="text-xs sm:text-sm text-[#202A27] font-medium leading-relaxed whitespace-pre-line">
                        {msg.text}
                      </p>

                      {/* Numbered Structured Questions (Screen 3) */}
                      {msg.structuredQuestions && msg.structuredQuestions.length > 0 && (
                        <div className="bg-[#FAFBF9] rounded-xl p-4 border border-[#ECEFEA] space-y-2.5">
                          {msg.structuredQuestions.map((q, qIdx) => (
                            <div key={qIdx} className="flex items-start gap-2.5 text-xs text-[#3A4540]">
                              <span className="w-4 h-4 rounded-full bg-[#153D32] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {qIdx + 1}
                              </span>
                              <span className="font-medium">{q}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Quick Action Navigation Buttons */}
                      {msg.quickActions && (
                        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#F0F3EE]">
                          {msg.quickActions.map((act, aIdx) => (
                            <Link
                              key={aIdx}
                              href={act.href}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#153D32] text-white text-xs font-bold hover:bg-[#103027] transition shadow-2xs"
                            >
                              <span>{act.label}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Timestamp + read aloud */}
                  <div className={`flex items-center gap-2 px-1 ${isUser ? "justify-end" : "justify-start"}`}>
                    <span className="text-[10px] text-[#8C9691]">{msg.timestamp || "Just now"}</span>
                    {!isUser && (
                      <button
                        onClick={() => speak(msg.id, msg.text)}
                        className="text-[10px] font-bold text-[#153D32] hover:underline"
                        aria-label={speakingId === msg.id ? "Stop reading" : "Read reply aloud"}
                      >
                        {speakingId === msg.id ? "■ Stop" : "🔊 Listen"}
                      </button>
                    )}
                  </div>
                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="w-9 h-9 rounded-2xl bg-[#E3ECE7] border border-[#CCD8D1] text-[#153D32] font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    {userProfile?.name ? userProfile.name.slice(0, 2).toUpperCase() : "SK"}
                  </div>
                )}

              </div>
            </div>
          );
        })}

        {isAiProcessing && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#153D32] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
              سند
            </div>
            <div className="bg-white border border-[#ECEFEA] p-4 rounded-2xl rounded-tl-xs flex items-center gap-3 text-xs text-[#5C6661] shadow-2xs">
              <Loader2 className="w-4 h-4 animate-spin text-[#153D32]" />
              <span>SANAD is analyzing your situation and official regulations...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ================= FIXED BOTTOM INPUT BAR (Matching Screen 3) ================= */}
      <div className="shrink-0 pt-2 pb-2">
        <div className="bg-white rounded-2xl border border-[#DDE2D9] p-2 flex items-center gap-2 shadow-[0_8px_30px_rgba(21,61,50,0.06)]">
          
          {/* Plus icon */}
          <button 
            type="button" 
            className="p-2 text-[#8C9691] hover:text-[#153D32] hover:bg-[#FAFBF9] rounded-xl transition"
            title="Attach Document"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Voice Wave Icon */}
          <div className="flex items-center text-[#8C9691] px-1">
            <span className="text-xs">|||</span>
          </div>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder={isRecording ? "Listening to your voice..." : "Speak or type a message..."}
            className="flex-1 bg-transparent border-none text-xs sm:text-sm text-[#202A27] placeholder:text-[#8C9691] focus:outline-none"
          />

          {/* Big Green Mic Button (Screen 3) */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-3 rounded-full text-white transition shadow-sm ${
              isRecording 
                ? "bg-red-600 animate-pulse ring-4 ring-red-100" 
                : "bg-[#153D32] hover:bg-[#103027] ring-4 ring-[#EAF5EF]"
            }`}
            title={isRecording ? "Stop Recording" : "Speak to SANAD"}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Send Button */}
          {inputText.trim() && (
            <button
              type="button"
              onClick={() => handleSend()}
              className="p-3 rounded-full bg-[#153D32] hover:bg-[#103027] text-white transition shadow-2xs"
            >
              <Send className="w-4 h-4" />
            </button>
          )}

        </div>
      </div>

    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#153D32]" />
      </div>
    }>
      <ChatVoiceInner />
    </Suspense>
  );
}