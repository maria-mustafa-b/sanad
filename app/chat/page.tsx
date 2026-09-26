"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, Square, Loader2, Send, X, CheckCircle2, ChevronRight, AlertCircle, Edit2 } from "lucide-react";

type IntakeState = 'IDLE' | 'RECORDING' | 'PROCESSING' | 'REVIEW';

export default function ChatPage() {
  const [text, setText] = useState("");
  const [state, setState] = useState<IntakeState>('IDLE');
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'VOICE' | 'CHAT'>('VOICE');
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setText(currentTranscript);
        };

        recognition.onend = () => {
          if (state === 'RECORDING') setState('IDLE');
        };

        recognitionRef.current = recognition;
      }
    }
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [state]);

  const toggleRecording = () => {
    if (state === 'RECORDING') {
      recognitionRef.current?.stop();
      setState('IDLE');
    } else {
      setText("");
      recognitionRef.current?.start();
      setState('RECORDING');
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    
    if (state === 'RECORDING') {
      recognitionRef.current?.stop();
    }
    
    setState('PROCESSING');
    
    try {
      const res = await fetch("/api/ai/understand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      
      const data = await res.json();
      setResult(data);
      setState('REVIEW');
      
    } catch (err) {
      console.error(err);
      alert("Failed to analyze situation");
      setState('IDLE');
    }
  };

  const exampleMessages = [
    "Mer job chali gayi hai aur August ki salary nahi mili",
    "I haven't received my salary for 3 months",
    "Visa cancellation issue",
    "Housing eviction problem"
  ];

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col min-h-[80vh] animate-in fade-in duration-500">
      
      {state !== 'REVIEW' ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Tell us about your situation</h1>
            <p className="text-gray-500">Speak naturally in your native language. We will legally structure your claim.</p>
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-xl w-fit mb-8">
            <button 
              onClick={() => setActiveTab('VOICE')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'VOICE' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Voice Input
            </button>
            <button 
              onClick={() => setActiveTab('CHAT')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'CHAT' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Chat
            </button>
          </div>

          <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden flex flex-col">
            
            {activeTab === 'VOICE' ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-[400px]">
                {state === 'RECORDING' ? (
                  <div className="flex flex-col items-center animate-in zoom-in duration-300">
                    <div className="relative w-32 h-32 flex items-center justify-center mb-8">
                      <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75"></div>
                      <div className="absolute inset-4 bg-red-50 rounded-full"></div>
                      <Mic className="w-10 h-10 text-red-600 relative z-10 animate-pulse" />
                    </div>
                    <div className="text-gray-900 font-bold text-xl mb-4 max-w-md text-center line-clamp-3">
                      "{text || 'Listening...'}"
                    </div>
                    <p className="text-red-500 font-semibold mb-8">Listening...</p>
                    <div className="flex gap-4">
                      <button onClick={() => {setState('IDLE'); setText(''); recognitionRef.current?.stop();}} className="px-6 py-3 rounded-full font-bold text-gray-600 bg-gray-100 hover:bg-gray-200">
                        Cancel
                      </button>
                      <button onClick={handleSubmit} disabled={!text} className="px-6 py-3 rounded-full font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2">
                        Continue <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : state === 'PROCESSING' ? (
                  <div className="flex flex-col items-center text-teal-700">
                    <Loader2 className="w-12 h-12 animate-spin mb-4" />
                    <h3 className="text-xl font-bold">Structuring your situation...</h3>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <button 
                      onClick={toggleRecording}
                      className="w-24 h-24 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mb-6 transition-all hover:scale-105"
                    >
                      <Mic className="w-10 h-10" />
                    </button>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Tap to speak</h3>
                    <p className="text-gray-500 mb-8">or choose an example below</p>
                    
                    <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                      {exampleMessages.map((msg, i) => (
                        <button key={i} onClick={() => setText(msg)} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                          "{msg}"
                        </button>
                      ))}
                    </div>
                    {text && (
                      <div className="mt-8">
                        <button onClick={handleSubmit} className="px-8 py-3 bg-teal-600 text-white font-bold rounded-full hover:bg-teal-700 shadow-md">
                          Continue with text
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col p-6 min-h-[400px]">
                <div className="flex-1 overflow-y-auto mb-4">
                  {/* Chat history would go here */}
                </div>
                <div className="relative">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 pr-16 resize-none outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    rows={3}
                  />
                  <button 
                    onClick={handleSubmit}
                    disabled={!text || state === 'PROCESSING'}
                    className="absolute bottom-4 right-4 p-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:opacity-50 transition-colors"
                  >
                    {state === 'PROCESSING' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        /* SITUATION UNDERSTANDING (REVIEW STATE) */
        <div className="animate-in slide-in-from-right-8 duration-500">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Here's what I understood</h1>
            <p className="text-gray-500">Please review the structured information before we proceed.</p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden mb-8">
            <div className="p-8">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Structured Facts</h3>
              
              <div className="grid md:grid-cols-2 gap-y-6 gap-x-12">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Situation type</p>
                  <p className="font-bold text-gray-900">{result?.category || 'Employment issue'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Employment status</p>
                  <p className="font-bold text-gray-900">{result?.facts?.employment_status || 'Lost job'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Issue</p>
                  <p className="font-bold text-gray-900">{result?.facts?.issue || 'Unpaid wages'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Salary period</p>
                  <p className="font-bold text-gray-900">{result?.facts?.salary_period || 'August 2026'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Employer</p>
                  <p className="font-bold text-gray-900">{result?.facts?.employer || 'Not specified'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50/50 p-8 border-t border-amber-100/50">
              <h3 className="flex items-center gap-2 text-sm font-bold text-amber-700 uppercase tracking-widest mb-4">
                <AlertCircle className="w-4 h-4" /> Information still needed
              </h3>
              <ul className="list-disc list-inside text-amber-900 space-y-2">
                <li>Employment end date</li>
                <li>Location (Emirate)</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setState('IDLE')}
              className="px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition flex-1"
            >
              <Edit2 className="w-5 h-5 text-gray-400" /> Edit
            </button>
            <button 
              onClick={async () => {
                const res = await fetch('/api/blockchain/issue', { 
                  method: 'POST', 
                  body: JSON.stringify({ claimId: 'SANAD-VC-' + Date.now(), claimDataHash: '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b=>b.toString(16).padStart(2,'0')).join('') }) 
                }); 
                const data = await res.json(); 
                if(data.success) { 
                  alert('Success! Credential sealed on Polygon Amoy.\\nTx: ' + data.transactionHash); 
                  window.location.href = '/dashboard'; 
                }
              }}
              className="px-8 py-4 bg-teal-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-teal-800 transition shadow-lg shadow-teal-700/20 flex-[2]"
            >
              Confirm and Continue <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
