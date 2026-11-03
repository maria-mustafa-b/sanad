"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Search, 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Loader2, 
  ExternalLink,
  Copy,
  Check,
  Building2,
  Lock,
  AlertTriangle
} from "lucide-react";
import { Card, Badge, Button } from "@/components/ui/Primitives";

export default function PublicVerificationPage() {
  const [credId, setCredId] = useState("");
  const [state, setState] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'NOT_FOUND'>('IDLE');
  const [verifiedData, setVerifiedData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Pre-fill from /verify?id=... (QR codes and credential links).
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) setCredId(id);
  }, []);

  // Deployed SANADCredential contract on Polygon Amoy.
  const realContractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x13798285e9fa1aCd15930e8D510A34BB983F1484";

  const handleVerify = async () => {
    const query = credId.trim();
    if (!query) return;
    setState('LOADING');
    setVerifiedData(null);

    try {
      const res = await fetch(`/api/credentials/verify?id=${encodeURIComponent(query)}`);
      const json = await res.json();

      // Only succeed if it's genuinely found in DB or registered prototype IDs
      if (res.ok && json.verified && json.credential) {
        setVerifiedData({
          ...json.credential,
          contractAddress: realContractAddress
        });
        setState('SUCCESS');
      } else {
        // Genuine NOT FOUND state (NO FAKE APPROVALS)
        setState('NOT_FOUND');
      }
    } catch {
      // A network failure is not a verification result.
      setState('NOT_FOUND');
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#F7F7F2] min-h-screen">
      
      {/* Top Bar for Public Route */}
      <header className="bg-white border-b border-[#E4E7E1] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#153D32] flex items-center justify-center text-white font-bold text-sm">
              س
            </div>
            <div>
              <span className="font-bold text-base text-[#153D32] tracking-tight">SANAD</span>
              <span className="text-[10px] text-[#586660] font-medium block leading-none">Public Verifier Portal</span>
            </div>
          </Link>

          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              Citizen Portal
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full px-6 py-12 flex-1 flex flex-col items-center">
        
        {/* Banner */}
        <div className="text-center max-w-xl mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF7EE] text-[#166534] border border-[#BBF7D0] text-xs font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Polygon Amoy On-Chain Verification</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#15241E] tracking-tight">
            Verify SANAD Digital Credential
          </h1>
          <p className="text-sm text-[#586660]">
            Enter a credential ID or hash to check its validity on the Polygon Amoy blockchain registry.
          </p>
        </div>

        {/* Search Card */}
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-[#ECEFEA] shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-[#8C9691] absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={credId}
                onChange={(e) => setCredId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                placeholder="Enter a credential ID"
                className="w-full pl-12 pr-4 py-3.5 bg-[#FAFBF9] border border-[#DDE2D9] rounded-2xl text-xs sm:text-sm text-[#202A27] placeholder:text-[#8C9691] focus:outline-none focus:border-[#153D32]"
              />
            </div>
            <button
              onClick={handleVerify}
              disabled={state === 'LOADING' || !credId.trim()}
              className="px-8 py-3.5 bg-[#153D32] hover:bg-[#103027] text-white font-bold text-xs sm:text-sm rounded-2xl transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {state === 'LOADING' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify Credential</span>
              )}
            </button>
          </div>

          <p className="mt-3 text-xs text-[#68716D]">
            Only credentials that exist in the SANAD registry verify. Unknown IDs are reported as not found.
          </p>
        </div>

        {/* Result: NOT FOUND (Genuine & Honest) */}
        {state === 'NOT_FOUND' && (
          <div className="w-full bg-white rounded-3xl p-8 border border-red-200 shadow-sm text-center space-y-3 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <XCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-red-900">Credential Not Found</h3>
            <p className="text-xs sm:text-sm text-[#68716D] max-w-md mx-auto">
              No registered credential or blockchain record matches ID <span className="font-mono font-bold text-red-700">"{credId}"</span> on the Polygon Amoy registry.
            </p>
            <p className="text-[11px] text-[#8C9691]">
              Contract: {realContractAddress}
            </p>
          </div>
        )}

        {/* Result: SUCCESS */}
        {state === 'SUCCESS' && verifiedData && (
          <div className="w-full bg-white rounded-3xl p-8 border border-[#BCE1CA] shadow-sm space-y-6 animate-in fade-in duration-200">
            
            <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-[#F0F3EE]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EBF7EE] text-[#166534] flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-[#153D32]">
                      Authentic Credential Verified
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EBF7EE] text-[#166534] text-[10px] font-bold">
                      Valid & Sealed
                    </span>
                  </div>
                  <p className="text-xs text-[#68716D] mt-0.5">
                    Verified on Polygon Amoy Smart Contract
                  </p>
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="text-[#8C9691]">Smart Contract:</span>
                <p className="font-mono font-bold text-[#153D32]">{realContractAddress.slice(0, 10)}...{realContractAddress.slice(-6)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#ECEFEA] space-y-1">
                <span className="text-[#8C9691]">Credential ID</span>
                <p className="font-mono font-bold text-[#202A27]">{verifiedData.id}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#ECEFEA] space-y-1">
                <span className="text-[#8C9691]">Issuer Authority</span>
                <p className="font-bold text-[#202A27]">{verifiedData.issuer || "SANAD (Testnet Node)"}</p>
              </div>
            </div>

            {verifiedData.isSample && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span><strong>Demonstration Record:</strong> This verification is anchored on Polygon Amoy Testnet for prototype evaluation.</span>
              </div>
            )}

          </div>
        )}

      </main>

    </div>
  );
}