"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { 
  Sparkles, 
  X, 
  Send, 
  Mic, 
  Square, 
  Volume2, 
  Loader2, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  FileText
} from "lucide-react";

interface Message {
  id: string;
  role: "assistant" | "user";
  text: string;
  suggestedAction?: {
    label: string;
    href: string;
  };
}

export function GlobalCopilot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize context-sensitive welcome message when opening or changing routes
  useEffect(() => {
    let initialGreeting = "Hello! I am your SANAD Government Services Copilot. How can I assist you with UAE procedures today?";
    let suggestion: { label: string; href: string } | undefined = undefined;

    if (pathname.includes("/dashboard")) {
      initialGreeting = "Welcome back to your dashboard. You have active service applications and an Emirates ID verification. What would you like help with?";
      suggestion = { label: "Review next action", href: "/applications" };
    } else if (pathname.includes("/services")) {
      initialGreeting = "Browsing UAE government services? I can check your eligibility for Golden Visas, Ejari tenancy, MOHRE contracts, or business permits.";
      suggestion = { label: "Check my eligibility", href: "/services" };
    } else if (pathname.includes("/documents")) {
      initialGreeting = "In your Document Vault, I can analyze uploaded contracts, passports, or tenancy agreements for expiry dates and compliance.";
      suggestion = { label: "Verify documents", href: "/documents" };
    } else if (pathname.includes("/credentials")) {
      initialGreeting = "Here are your Polygon Amoy verifiable credentials. You can present these tamper-proof digital attestations to landlords, banks, or employers.";
      suggestion = { label: "Test verification portal", href: "/verify" };
    }

    setMessages([
      {
        id: "welcome",
        role: "assistant",
        text: initialGreeting,
        suggestedAction: suggestion
      }
    ]);
  }, [pathname]);

  // Voice speech recognition
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
          setInput(currentTranscript);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const handleToggleRecord = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setInput("");
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Mic start failed", e);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input.trim()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.text })),
        })
      });

      const data = await res.json();
      const replyText = res.ok
        ? (data.next_question ? `${data.reply}\n\n${data.next_question}` : data.reply)
        : data.message || "SANAD could not answer right now. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: replyText
        }
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: "I am ready to help. You can access relevant government guidelines in the Service Directory or upload your documents directly for automatic parsing."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const playTTS = (textToSpeak: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Copilot Modal */}
      {isOpen && (
        <div className="w-[380px] sm:w-[420px] h-[540px] bg-white rounded-[14px] border border-[#E4E7E1] shadow-[0_12px_40px_rgba(21,61,50,0.12)] flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          
          {/* Header */}
          <div className="bg-[#153D32] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#256152] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#DDEBE3]" />
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight">SANAD AI Assistant</h3>
                <p className="text-[11px] text-[#DDEBE3]">Unified Government Copilot</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-[#DDEBE3] hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Context Badge */}
          <div className="bg-[#F7F7F2] px-4 py-2 border-b border-[#E4E7E1] flex items-center justify-between text-xs text-[#586660]">
            <span className="font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#166534]"></span>
              Active Context: <span className="font-semibold text-[#15241E]">{pathname.replace('/', '') || 'portal'}</span>
            </span>
            <span className="text-[10px] bg-[#DDEBE3] text-[#153D32] px-1.5 py-0.5 rounded font-medium">
              Gemini 2.5
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FCFCFA]">
            {messages.map((m) => (
              <div 
                key={m.id}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div 
                  className={`max-w-[85%] rounded-[12px] px-3.5 py-2.5 text-xs leading-relaxed ${
                    m.role === "user" 
                      ? "bg-[#153D32] text-white rounded-br-xs" 
                      : "bg-white border border-[#E4E7E1] text-[#15241E] shadow-xs rounded-bl-xs"
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Text-to-speech button for assistant responses */}
                  {m.role === "assistant" && (
                    <div className="mt-2 pt-2 border-t border-[#F3F8F5] flex items-center justify-between gap-2">
                      <button 
                        onClick={() => playTTS(m.text)}
                        className="text-[11px] text-[#467060] hover:text-[#153D32] flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> Listen
                      </button>
                    </div>
                  )}

                  {/* Contextual Action Link */}
                  {m.suggestedAction && (
                    <a
                      href={m.suggestedAction.href}
                      className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#153D32] bg-[#DDEBE3] hover:bg-[#C2DCD0] px-2 py-1 rounded-[6px] transition-colors"
                    >
                      {m.suggestedAction.label}
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[#586660] bg-white border border-[#E4E7E1] px-3 py-2 rounded-[10px] w-fit">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#153D32]" />
                Checking official regulations...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 border-t border-[#E4E7E1] bg-white">
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={handleToggleRecord}
                className={`p-2 rounded-[8px] border transition-colors ${
                  isRecording 
                    ? "bg-[#FEF2F2] text-[#991B1B] border-[#FECACA] animate-pulse" 
                    : "bg-[#F7F7F2] text-[#586660] hover:text-[#153D32] border-[#E4E7E1]"
                }`}
                title="Speak question"
              >
                {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4 h-4" />}
              </button>

              <input 
                type="text"
                placeholder={isRecording ? "Listening..." : "Ask about any UAE service or rule..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-[#F7F7F2] border border-[#E4E7E1] rounded-[8px] px-3 py-2 text-xs outline-none focus:border-[#153D32] transition-colors text-[#15241E]"
              />

              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 rounded-[8px] bg-[#153D32] text-white disabled:opacity-40 hover:bg-[#1C4D40] transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-[#84928B] text-center mt-2">
              Provides verified official guidance. Always refer to official authority decrees.
            </p>
          </div>
        </div>
      )}

      {/* Floating Launcher Pill Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-3 bg-[#153D32] text-white hover:bg-[#1C4D40] rounded-full shadow-[0_4px_20px_rgba(21,61,50,0.25)] border border-[#256152] transition-all hover:scale-[1.02] cursor-pointer"
        aria-label="Toggle SANAD Assistant"
      >
        <div className="w-6 h-6 rounded-full bg-[#256152] flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-[#DDEBE3]" />
        </div>
        <span className="text-xs font-semibold tracking-wide">SANAD Assistant</span>
      </button>
    </div>
  );
}
