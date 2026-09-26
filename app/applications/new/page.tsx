"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, FileText, ShieldCheck, User, Building2, ChevronRight, Check } from "lucide-react";

export default function ApplicationSubmissionPage() {
  const [step, setStep] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const steps = [
    { num: 1, title: "Review", icon: User },
    { num: 2, title: "Documents", icon: FileText },
    { num: 3, title: "Credentials", icon: ShieldCheck },
    { num: 4, title: "Submit", icon: CheckCircle2 }
  ];

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto pt-20 animate-in zoom-in-95 duration-500 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Application Submitted</h1>
        <p className="text-gray-600 text-lg mb-8">
          Your request for the <span className="font-bold text-gray-900">Unpaid Wages Complaint Service</span> has been successfully transmitted to the authority.
        </p>
        <Link href="/applications" className="inline-flex px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-teal-700 transition shadow-lg shadow-gray-900/10">
          Track Application Progress
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col pb-20 animate-in fade-in duration-500">
      
      <Link href="/services" className="inline-flex items-center text-gray-500 hover:text-gray-900 font-semibold mb-8 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Submit Application</h1>
        <p className="text-gray-500 font-medium flex items-center gap-2">
          <Building2 className="w-5 h-5 text-gray-400" /> Unpaid Wages Complaint Service
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-gray-100 -z-10 rounded-full">
          <div className="h-full bg-teal-600 rounded-full transition-all duration-500" style={{ width: \`\${((step - 1) / 3) * 100}%\` }} />
        </div>
        
        {steps.map((s) => {
          const isActive = step === s.num;
          const isPast = step > s.num;
          return (
            <div key={s.num} className="flex flex-col items-center bg-gray-50 w-24">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 border-[3px] transition-colors duration-300 ${
                isActive ? 'bg-white border-teal-600 text-teal-600 shadow-md' : 
                isPast ? 'bg-teal-600 border-teal-600 text-white' : 
                'bg-white border-gray-200 text-gray-300'
              }`}>
                {isPast ? <Check className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
              </div>
              <span className={`text-xs font-bold ${isActive || isPast ? 'text-gray-900' : 'text-gray-400'}`}>
                {s.title}
              </span>
            </div>
          )
        })}
      </div>

      {/* Form Content Container */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-8 md:p-10 mb-8 min-h-[300px]">
        
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Review Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                <input type="text" disabled value="Sanmeet Singh" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Emirates ID</label>
                <input type="text" disabled value="784-1990-1234567-1" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
                <input type="text" disabled value="+971 50 123 4567" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                <input type="text" disabled value="sanmeet@example.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Attached Documents</h2>
            <p className="text-gray-500 mb-6">These verified documents will be transmitted with your application.</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl border border-emerald-100 bg-emerald-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Employment Contract</p>
                    <p className="text-xs text-gray-500">Verified by OCR</p>
                  </div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-2">SANAD Credential</h2>
            <p className="text-gray-500 mb-6">Your cryptographic proof will act as your official claim statement.</p>
            
            <div className="p-6 rounded-2xl border border-teal-100 bg-teal-50/30">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider mb-2 bg-teal-100 text-teal-800 uppercase">
                    <ShieldCheck className="w-3.5 h-3.5" /> Attached
                  </div>
                  <h3 className="font-bold text-gray-900">Employment Situation: Unpaid Wages</h3>
                </div>
                <div className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-mono font-bold text-gray-600 shadow-sm">
                  SANAD-VC-00124
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm bg-white p-4 rounded-xl border border-gray-100">
                <div><span className="text-gray-500">Blockchain:</span> <span className="font-bold text-gray-900">Polygon Amoy</span></div>
                <div><span className="text-gray-500">Issuer:</span> <span className="font-bold text-gray-900">SANAD</span></div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Final Confirmation</h2>
            
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
              <h3 className="font-bold text-gray-900 mb-4">Summary</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex justify-between border-b border-gray-200 pb-2"><span>Service</span> <span className="font-bold text-gray-900">Unpaid Wages Complaint</span></li>
                <li className="flex justify-between border-b border-gray-200 pb-2"><span>Applicant</span> <span className="font-bold text-gray-900">Sanmeet Singh</span></li>
                <li className="flex justify-between border-b border-gray-200 pb-2"><span>Documents</span> <span className="font-bold text-gray-900">1 Verified Document</span></li>
                <li className="flex justify-between pb-2"><span>Credential</span> <span className="font-bold text-gray-900">SANAD-VC-00124</span></li>
              </ul>
            </div>

            <label className="flex items-start gap-4 cursor-pointer p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
              <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                <input 
                  type="checkbox" 
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-lg checked:bg-teal-600 checked:border-teal-600 transition-colors"
                />
                <Check className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
              </div>
              <span className="text-gray-700 font-medium leading-relaxed">
                I confirm that the information provided is correct to the best of my knowledge, and I authorize SANAD to transmit this data to the relevant authority.
              </span>
            </label>
          </div>
        )}

      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setStep(Math.max(1, step - 1))}
          className={`px-8 py-4 font-bold rounded-2xl transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Back
        </button>

        {step < 4 ? (
          <button 
            onClick={() => setStep(Math.min(4, step + 1))}
            className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-teal-700 transition flex items-center gap-2 shadow-lg shadow-gray-900/10"
          >
            Continue <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button 
            onClick={() => setSubmitted(true)}
            disabled={!confirmed}
            className="px-8 py-4 bg-teal-700 text-white rounded-2xl font-bold hover:bg-teal-800 disabled:opacity-50 disabled:hover:bg-teal-700 transition flex items-center gap-2 shadow-lg shadow-teal-700/20"
          >
            Submit Application <CheckCircle2 className="w-5 h-5" />
          </button>
        )}
      </div>

    </div>
  );
}
