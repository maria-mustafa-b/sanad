"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShieldCheck, QrCode, CheckCircle2, ChevronRight, XCircle, ArrowLeft } from "lucide-react";
 // Use existing Navbar for public verification

export default function PublicVerificationPage() {
  const [credId, setCredId] = useState("");
  const [state, setState] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'FAILED'>('IDLE');

  const handleVerify = () => {
    if (!credId) return;
    setState('LOADING');
    setTimeout(() => {
      // Mocking the verification
      if (credId.startsWith("SANAD")) {
        setState('SUCCESS');
      } else {
        setState('FAILED');
      }
    }, 1500);
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-gray-50 min-h-screen">
      
      <div className="max-w-3xl mx-auto w-full px-4 pt-32 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 font-semibold mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Verify a SANAD Credential</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Enter a Credential ID below or scan a QR code to instantly verify cryptographic proof on the Polygon blockchain.
          </p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="e.g. SANAD-VC-00124"
                value={credId}
                onChange={(e) => setCredId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:bg-white transition-all font-mono text-gray-900 placeholder:font-sans"
              />
            </div>
            <button className="p-4 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-colors shrink-0 tooltip-trigger" title="Scan QR Code">
              <QrCode className="w-6 h-6" />
            </button>
            <button 
              onClick={handleVerify}
              disabled={!credId || state === 'LOADING'}
              className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-teal-700 disabled:opacity-50 transition-all shrink-0 flex items-center justify-center shadow-lg shadow-gray-900/10"
            >
              {state === 'LOADING' ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </div>

        {state === 'SUCCESS' && (
          <div className="bg-emerald-50 rounded-3xl border border-emerald-100 p-8 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-emerald-950">Valid Credential</h2>
                <p className="text-emerald-700 font-medium">Cryptographic proof verified successfully.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-emerald-100/50 p-6 shadow-sm">
              <div className="grid md:grid-cols-2 gap-y-6 gap-x-12">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Credential ID</p>
                  <p className="font-mono font-bold text-gray-900">{credId.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Credential Type</p>
                  <p className="font-bold text-gray-900">Employment Claim</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Issuer</p>
                  <p className="font-bold text-gray-900 flex items-center gap-1">SANAD <ShieldCheck className="w-4 h-4 text-emerald-600"/></p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Issue Date</p>
                  <p className="font-bold text-gray-900">2026-09-26</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Blockchain Status</p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <p className="font-bold text-gray-900">Confirmed on Polygon Amoy (Tx: 0x8f2a...4b9c)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {state === 'FAILED' && (
          <div className="bg-red-50 rounded-3xl border border-red-100 p-8 md:p-10 text-center animate-in fade-in zoom-in-95 duration-300">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-extrabold text-red-950 mb-2">Invalid Credential</h2>
            <p className="text-red-700 font-medium">We could not verify this credential ID on the blockchain. It may be revoked, expired, or invalid.</p>
          </div>
        )}

      </div>
    </div>
  );
}
