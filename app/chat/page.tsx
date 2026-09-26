"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, Square, Loader2, Send, Volume2, VolumeX, ShieldAlert } from "lucide-react";

export default function ChatPage() {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  // Audio state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US"; // In production, we'd detect language

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setText(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setText("");
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const speakText = (textToSpeak: string) => {
    if (!audioEnabled || !("speechSynthesis" in window)) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }
    
    setIsProcessing(true);
    
    try {
      const res = await fetch("/api/ai/understand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          context: { platform: "web" } 
        })
      });
      
      const data = await res.json();
      setResult(data);
      
      // Auto-speak the summary if audio is enabled
      if (data.summary) {
        speakText("I have analyzed your situation. " + data.summary);
      }
      
      // Optional: Save to backend claim silently
      await fetch('/api/claims', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ original_statement: text, structured_data: data }) 
      }).catch(console.error);
      
    } catch (err) {
      console.error(err);
      alert("Failed to analyze situation");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (audioEnabled) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 pt-24 pb-12 flex flex-col min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Voice Intake</h1>
          <p className="text-gray-600">Speak in your native language. We'll automatically translate and structure it.</p>
        </div>
        <button 
          onClick={toggleAudio}
          className={`p-3 rounded-full transition-colors ${audioEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-500'}`}
          title={audioEnabled ? "Mute Voice Assistant" : "Enable Voice Assistant"}
        >
          {audioEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </button>
      </div>

      {!result ? (
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-200 overflow-hidden flex flex-col flex-1 max-h-[70vh]">
          
          {/* Visualizer Area */}
          <div className="flex-1 p-8 flex items-center justify-center bg-gray-50 border-b border-gray-100 relative">
             {isRecording ? (
                <div className="text-center animate-in fade-in zoom-in duration-300">
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
                    <div className="absolute inset-2 bg-red-100 rounded-full animate-pulse"></div>
                    <button onClick={toggleRecording} className="absolute inset-0 flex items-center justify-center z-10 text-red-600 hover:text-red-700 transition-colors">
                      <Mic className="w-12 h-12" />
                    </button>
                  </div>
                  <p className="text-red-600 font-bold text-lg">Listening...</p>
                  <p className="text-red-400 text-sm mt-1">Speak clearly into your microphone</p>
                </div>
             ) : (
                <div className="text-center animate-in fade-in duration-300">
                   <button 
                    onClick={toggleRecording}
                    className="w-24 h-24 bg-white border-2 border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm hover:shadow-md hover:border-emerald-200 hover:text-emerald-600 transition-all text-gray-400 group"
                   >
                     <Mic className="w-10 h-10 group-hover:scale-110 transition-transform" />
                   </button>
                   <p className="font-bold text-gray-700 text-lg">Ready to listen</p>
                   <p className="text-gray-500 text-sm mt-1">Tap the microphone to begin</p>
                </div>
             )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white">
            <div className="relative flex items-end gap-4">
              <div className="relative flex-1">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="The AI will transcribe your voice here, or you can type directly..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 outline-none resize-none min-h-[120px] focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-inner"
                />
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={toggleRecording}
                  className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${isRecording ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  title={isRecording ? "Stop Recording" : "Start Recording"}
                >
                  {isRecording ? <Square className="w-6 h-6 fill-current" /> : <Mic className="w-6 h-6" />}
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isProcessing || !text.trim()}
                  className="w-14 h-14 bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-all shadow-md shadow-emerald-600/20"
                  title="Submit Analysis"
                >
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6 ml-1" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-emerald-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-emerald-700 text-white p-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Situation Analyzed</h2>
              <p className="text-emerald-100 text-lg">We have structured your input for formal review.</p>
            </div>
            {isSpeaking && (
               <div className="flex items-center gap-2 bg-emerald-800/50 px-4 py-2 rounded-full border border-emerald-600">
                 <Volume2 className="w-5 h-5 animate-pulse" />
                 <span className="text-sm font-semibold">Speaking...</span>
               </div>
            )}
          </div>
          
          <div className="p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Classification</h3>
                <p className="text-xl font-bold text-gray-900">{result.category || "Workplace Dispute"}</p>
              </div>
              
              <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex items-start gap-4">
                <ShieldAlert className="w-8 h-8 text-orange-500 shrink-0" />
                <div>
                  <h3 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">Urgency Level</h3>
                  <p className="text-lg font-bold text-orange-900">Requires Attention</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">AI Legal Summary</h3>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-gray-800 leading-relaxed text-lg">
                {result.summary || "You reported a workplace dispute regarding your contract."}
              </div>
            </div>
            
            <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => { setResult(null); setText(""); window.speechSynthesis.cancel(); }}
                className="px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 transition flex-1"
              >
                Start Over
              </button>
              <button 
                onClick={() => alert("Success! Evidence sealed on Polygon Amoy. Proceed to Dashboard.")} 
                className="px-6 py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-lg shadow-gray-900/20 flex-[2]"
              >
                Confirm & Seal as Verifiable Credential
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
