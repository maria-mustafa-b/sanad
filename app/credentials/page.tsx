"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  QrCode, 
  Lock, 
  AlertTriangle 
} from "lucide-react";

export default function CredentialsPage() {
  const [copied, setCopied] = useState(false);
  // Deployed SANADCredential contract on Polygon Amoy.
  const realContractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x13798285e9fa1aCd15930e8D510A34BB983F1484";
  const sampleCredId = "SANAD-VC-00124";

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleCredId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* ================= HEADER ================= */}
      <div className="flex items-start gap-3 pb-2 border-b border-[#ECEFEA]">
        <div className="w-10 h-10 rounded-2xl bg-[#EBF5EF] text-[#153D32] flex items-center justify-center shrink-0 shadow-2xs">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#153D32] tracking-tight">
            My Credentials
          </h1>
          <p className="text-xs sm:text-sm text-[#68716D] mt-0.5">
            Your verifiable documents and digital records (Polygon Amoy Testnet).
          </p>
        </div>
      </div>

      {/* Clear Prototype Notice to Prevent Misleading Officials */}
      <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center gap-2.5">
        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700" />
        <span>
          <strong>Prototype Notice:</strong> Digital credentials displayed here are demo testnet credentials anchored to Polygon Amoy for prototype verification.
        </span>
      </div>

      {/* ================= UAE RESIDENCY DIGITAL CREDENTIAL CARD ================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ECEFEA] shadow-sm relative overflow-hidden space-y-6">
        
        <div className="absolute right-0 bottom-0 w-80 h-40 bg-gradient-to-t from-[#DDEBE3]/40 to-transparent pointer-events-none rounded-bl-full"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-4">
            
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#FAFBF9] border border-[#ECEFEA] flex items-center justify-center shrink-0 text-xl shadow-2xs">
                🦅
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-[#153D32]">
                  UAE Residency Attestation
                </h2>
                <p className="text-xs text-[#68716D]">
                  SANAD Verifiable Digital Credential (Testnet)
                </p>
              </div>
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF7EE] text-[#166534] border border-[#BBF7D0] text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified (Testnet Registry)</span>
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-[#5C6661] pt-1">
              <p>
                <span className="font-semibold text-[#202A27]">Credential ID:</span>{" "}
                <button 
                  onClick={handleCopy}
                  className="font-mono font-bold text-[#153D32] hover:underline inline-flex items-center gap-1"
                >
                  <span>{sampleCredId}</span>
                  {copied ? <Check className="w-3 h-3 text-[#166534]" /> : <Copy className="w-3 h-3 text-[#8C9691]" />}
                </button>
              </p>
              <p>
                <span className="font-semibold text-[#202A27]">Issuer Node:</span><br />
                SANAD UAE Gov AI Node (Polygon Amoy)
              </p>
              <p className="pt-0.5">
                <span className="font-semibold text-[#202A27]">Registry Contract:</span><br />
                <span className="font-mono text-[11px] text-[#153D32]">{realContractAddress}</span>
              </p>
            </div>

          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-[#FAFBF9] rounded-2xl border border-[#ECEFEA] shrink-0 self-center md:self-auto shadow-2xs">
            <div className="w-32 h-32 bg-white p-2 rounded-xl border border-[#DDE2D9] flex items-center justify-center shadow-2xs">
              <svg className="w-full h-full text-[#153D32]" viewBox="0 0 100 100" fill="currentColor">
                <rect x="10" y="10" width="25" height="25" rx="3" />
                <rect x="15" y="15" width="15" height="15" fill="#FAFBF9" />
                <rect x="18" y="18" width="9" height="9" />
                <rect x="65" y="10" width="25" height="25" rx="3" />
                <rect x="70" y="15" width="15" height="15" fill="#FAFBF9" />
                <rect x="73" y="18" width="9" height="9" />
                <rect x="10" y="65" width="25" height="25" rx="3" />
                <rect x="15" y="70" width="15" height="15" fill="#FAFBF9" />
                <rect x="18" y="73" width="9" height="9" />
                <rect x="42" y="12" width="6" height="6" />
                <rect x="52" y="20" width="6" height="6" />
                <rect x="42" y="32" width="6" height="6" />
                <rect x="42" y="45" width="16" height="16" />
                <rect x="65" y="45" width="8" height="8" />
                <rect x="80" y="55" width="10" height="10" />
                <rect x="65" y="75" width="12" height="12" />
                <rect x="42" y="75" width="8" height="8" />
              </svg>
            </div>
            <Link 
              href={`/verify?id=${sampleCredId}`}
              className="text-[11px] font-bold text-[#153D32] hover:underline mt-3 flex items-center gap-1"
            >
              <span>Scan to Verify</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-5 border-t border-[#F0F3EE] text-xs font-semibold text-[#5C6661] relative z-10">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#166534]" />
            <span>Zero Personal Data On-Chain</span>
          </div>

          <div className="flex items-center gap-2 text-[#7C3AED]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]"></span>
            <span className="font-bold">Polygon Amoy (Chain ID: 80002)</span>
          </div>
        </div>

      </div>

      <div className="flex justify-between items-center pt-2">
        <Link 
          href="/situation" 
          className="text-xs font-bold text-[#153D32] hover:underline"
        >
          ← Back to My Situation
        </Link>
        <Link 
          href={`/verify?id=${sampleCredId}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#153D32] hover:underline"
        >
          <span>Open Public Verifier</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}