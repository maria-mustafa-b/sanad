"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Check, 
  Upload, 
  Sparkles, 
  Mic, 
  Send, 
  Volume2, 
  Paperclip, 
  FileText,
  ArrowRight
} from "lucide-react";
import { Card, Button } from "@/components/ui/Primitives";

export default function GuidedApplicationPage() {
  const params = useParams();
  const [currentStep, setCurrentStep] = useState(2);
  const [monthlySalary, setMonthlySalary] = useState("14000");
  const [copilotInput, setCopilotInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "u1",
      role: "user",
      text: "What should I enter for monthly salary?"
    },
    {
      id: "a1",
      role: "assistant",
      text: "Enter your monthly salary as stated in your employment contract. The minimum salary may vary based on the emirate and current regulations.",
      hasExtractAction: true
    }
  ]);

  const applicationSteps = [
    { num: 1, title: "Applicant Details", completed: true },
    { num: 2, title: "Sponsor Information", current: true },
    { num: 3, title: "Family Member Details" },
    { num: 4, title: "Document Upload" },
    { num: 5, title: "Review & Submit" },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      
      {/* Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#68716D] mb-1">
            <Link href="/applications" className="hover:text-[#153D32]">Applications</Link>
            <span>&gt;</span>
            <span className="text-[#202A27] font-semibold">Family Sponsorship</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#202A27]">
            Family Sponsorship Application
          </h1>
        </div>

        {/* Step Progress Indicator (Step 2 of 5, 40%) */}
        <div className="text-right space-y-1">
          <div className="flex items-center gap-2 justify-end text-xs font-bold text-[#202A27]">
            <span>Step 2 of 5</span>
            <span className="text-[#153D32]">40%</span>
          </div>
          <div className="w-32 bg-[#E4E7E1] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#153D32] h-full w-[40%] rounded-full"></div>
          </div>
        </div>
      </div>

      {/* ================= SCREEN 4 SPLIT-SCREEN WORKSPACE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form Panel (7 Cols): Multi-step Form & Steps */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E4E7E1] shadow-2xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
            
            {/* Left Steps Column */}
            <div className="sm:col-span-5 space-y-3 sm:border-r sm:border-[#ECEEEA] sm:pr-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#68716D]">
                Application Steps
              </span>

              <div className="space-y-2 pt-2">
                {applicationSteps.map((step) => (
                  <div 
                    key={step.num}
                    onClick={() => setCurrentStep(step.num)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      step.current 
                        ? "bg-[#DDEBE3] text-[#153D32] font-bold" 
                        : step.completed 
                        ? "text-[#166534]" 
                        : "text-[#68716D] hover:bg-[#F7F7F2]"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      step.current 
                        ? "bg-[#153D32] text-white" 
                        : step.completed 
                        ? "bg-[#EBF7EE] text-[#166534] border border-[#BBF7D0]" 
                        : "bg-[#F7F7F2] text-[#68716D] border border-[#E4E7E1]"
                    }`}>
                      {step.completed ? <Check className="w-3 h-3" /> : step.num}
                    </div>
                    <span>{step.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Fields Column */}
            <div className="sm:col-span-7 space-y-5">
              <h2 className="text-sm font-bold text-[#202A27]">
                Sponsor Information
              </h2>

              <div className="space-y-2 text-xs">
                <label className="font-semibold text-[#202A27] block">
                  Monthly Salary (AED) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={monthlySalary}
                  onChange={(e) => setMonthlySalary(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E4E7E1] bg-white text-xs text-[#202A27] font-semibold outline-none focus:border-[#153D32] shadow-2xs"
                />
              </div>

              <div className="space-y-2 text-xs">
                <label className="font-semibold text-[#202A27] block">
                  Employment Contract <span className="text-red-500">*</span>
                </label>
                
                <div className="p-6 border-2 border-dashed border-[#DDEBE3] rounded-2xl bg-[#FCFCFA] text-center space-y-2 cursor-pointer hover:border-[#153D32] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#DDEBE3] text-[#153D32] flex items-center justify-center mx-auto">
                    <Upload className="w-4 h-4" />
                  </div>
                  <p className="font-bold text-[#202A27]">Upload Document</p>
                  <p className="text-[10px] text-[#68716D]">PDF, JPG or PNG (Max 10 MB)</p>
                </div>
              </div>

              {/* Form Navigation Controls */}
              <div className="pt-4 flex items-center justify-between">
                <button 
                  type="button" 
                  className="text-xs font-semibold text-[#68716D] hover:text-[#153D32]"
                >
                  Save Draft
                </button>

                <div className="flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                    className="px-3.5 py-2 rounded-[10px] bg-white border border-[#E4E7E1] text-[#202A27] text-xs font-semibold hover:bg-[#F7F7F2]"
                  >
                    Previous
                  </button>

                  <button 
                    type="button" 
                    onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
                    className="px-4 py-2 rounded-[10px] bg-[#153D32] hover:bg-[#1C4D40] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Copilot Panel (5 Cols): Persistent SANAD Copilot */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E4E7E1] shadow-2xs overflow-hidden flex flex-col h-[520px]">
          
          {/* Header */}
          <div className="p-4 border-b border-[#ECEEEA] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[8px] bg-[#153D32] text-white flex items-center justify-center">
                <FileText className="w-4 h-4 text-[#DDEBE3]" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-[#202A27] leading-tight">SANAD Copilot</h3>
                <p className="text-[10px] text-[#68716D]">Family Sponsorship • Step 2 of 5</p>
              </div>
            </div>
          </div>

          {/* Chat Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FCFCFA] text-xs">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`p-3 rounded-2xl max-w-[88%] leading-relaxed ${
                  m.role === "user" 
                    ? "bg-white border border-[#E4E7E1] text-[#202A27] shadow-2xs" 
                    : "bg-white border border-[#E4E7E1] text-[#202A27] shadow-2xs space-y-3"
                }`}>
                  <p>{m.text}</p>

                  {/* Extract from Document Pill Action */}
                  {m.hasExtractAction && (
                    <div className="pt-1">
                      <button 
                        onClick={() => setMonthlySalary("14000")}
                        className="w-full py-2 px-3 rounded-[10px] bg-[#F7F7F2] hover:bg-[#DDEBE3] text-[#153D32] font-semibold text-xs border border-[#E4E7E1] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Extract from Document</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Audio Wave & Input Bar */}
          <div className="p-3 border-t border-[#ECEEEA] bg-white space-y-2">
            
            {/* Audio Wave Player */}
            <div className="p-2 rounded-xl bg-[#F7F7F2] border border-[#E4E7E1] flex items-center justify-between text-xs text-[#153D32]">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                <div className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 h-2 bg-[#153D32] rounded-full"></span>
                  <span className="w-0.5 h-3.5 bg-[#153D32] rounded-full"></span>
                  <span className="w-0.5 h-1.5 bg-[#153D32] rounded-full"></span>
                  <span className="w-0.5 h-3 bg-[#153D32] rounded-full"></span>
                  <span className="w-0.5 h-2 bg-[#153D32] rounded-full"></span>
                </div>
              </div>
              <span className="text-[10px] text-[#68716D] font-mono">0:14 / 0:32</span>
            </div>

            {/* Input Row */}
            <div className="flex items-center gap-2">
              <button className="p-2 text-[#68716D] hover:text-[#153D32]">
                <Paperclip className="w-4 h-4" />
              </button>

              <input 
                type="text" 
                placeholder="Ask about this field..."
                value={copilotInput}
                onChange={(e) => setCopilotInput(e.target.value)}
                className="flex-1 bg-[#F7F7F2] border border-[#E4E7E1] rounded-xl px-3 py-2 text-xs text-[#202A27] outline-none"
              />

              <button className="p-2 text-[#68716D] hover:text-[#153D32]">
                <Mic className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
