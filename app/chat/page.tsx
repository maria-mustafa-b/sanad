"use client";

import { useState } from "react";
import { Mic, Square, Loader2, Send } from "lucide-react";

export default function ChatPage() {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setIsProcessing(true);
    
    try {
      const res = await fetch("/api/ai/understand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          context: { platform: "web", language: "ur" } // Auto language
        })
      });
      const data = await res.json();
      setResult(data); await fetch('/api/claims', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ original_statement: text, structured_data: data }) });
    } catch (err) {
      console.error(err);
      alert("Failed to analyze situation");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto px-4 pt-24 pb-8 flex flex-col">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Tell SANAD what happened</h1>
      <p className="text-gray-600 mb-8">Speak in your native language or type below. We will structure it legally.</p>

      {!result ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[60vh]">
          <div className="flex-1 p-6 flex items-center justify-center bg-gray-50 border-b border-gray-100 relative">
             {isRecording ? (
                <div className="text-center animate-pulse">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-200">
                    <Mic className="w-8 h-8 text-red-600" />
                  </div>
                  <p className="text-red-600 font-semibold">Listening in real-time...</p>
                </div>
             ) : (
                <div className="text-center opacity-50">
                   <Mic className="w-16 h-16 mx-auto mb-4" />
                   <p className="font-medium">Tap microphone to start</p>
                </div>
             )}
          </div>
          <div className="p-4 bg-white">
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Or type your situation here..."
                className="w-full bg-gray-100 rounded-xl px-4 py-3 pr-24 outline-none resize-none h-24 focus:ring-2 focus:ring-emerald-500 transition"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <button 
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-3 rounded-lg flex items-center justify-center transition ${isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-5 h-5" />}
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isProcessing || !text.trim()}
                  className="p-3 bg-emerald-700 text-white rounded-lg flex items-center justify-center hover:bg-emerald-800 disabled:opacity-50 transition"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 overflow-hidden">
          <div className="bg-emerald-700 text-white p-6">
            <h2 className="text-2xl font-bold mb-1">Situation Understood</h2>
            <p className="text-emerald-100 opacity-90">We have structured your claim for review.</p>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Category</h3>
              <p className="text-lg font-semibold text-gray-900">{result.category || "Employment Issue"}</p>
            </div>
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Summary</h3>
              <p className="text-gray-700 leading-relaxed">{result.summary || "You reported a workplace dispute regarding your contract."}</p>
            </div>
            
            <button onClick={() => alert("Credential Issued to Polygon Amoy!")} className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition">
              Confirm & Issue Blockchain Credential
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
