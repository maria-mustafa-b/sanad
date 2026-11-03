"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Home, Users, Briefcase, GraduationCap, ExternalLink, Lock } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

// Deployed SANADCredential contract on Polygon Amoy.
const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x13798285e9fa1aCd15930e8D510A34BB983F1484";

// SANAD issues testnet proofs of user-confirmed records, never government documents.
// Nothing is shown as issued until a real issuance exists.
const types = [
  { icon: Home, title: "Residency record" },
  { icon: Users, title: "Family sponsorship record" },
  { icon: Briefcase, title: "Employment record" },
  { icon: GraduationCap, title: "Education record" },
];

export default function CredentialsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in duration-300">
      <PageHeader
        icon={ShieldCheck}
        title="My Credentials"
        subtitle="Tamper-proof records of details you confirmed, anchored on the Polygon Amoy testnet."
      />

      <div className="grid md:grid-cols-[1.6fr_1fr] gap-6">
        <div className="bg-white rounded-3xl p-8 border border-[#ECEFEA] shadow-sm text-center space-y-3">
          <img src="/ui/05_digital_credentials_illustration.jpg" alt="" className="h-32 mx-auto object-contain" />
          <h2 className="text-lg font-black text-[#153D32]">No credentials issued yet</h2>
          <p className="text-xs sm:text-sm text-[#68716D] max-w-md mx-auto">
            Once you confirm your situation, SANAD can anchor a SHA-256 commitment of that record on Polygon Amoy.
            It proves the record existed and has not changed. It does not prove the record is true, and it is not a
            government-issued document.
          </p>
          <Link href="/situation" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#153D32] text-white text-xs font-bold">
            Review My Situation
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#ECEFEA] shadow-sm space-y-3 text-xs">
          <h3 className="font-black text-base text-[#153D32]">How verification works</h3>
          <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#ECEFEA]">
            <span className="text-[#68716D]">Network</span>
            <p className="font-bold text-[#7C3AED]">Polygon Amoy (testnet, chain 80002)</p>
          </div>
          <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#ECEFEA]">
            <span className="text-[#68716D]">Registry contract</span>
            <p className="font-mono text-[11px] text-[#153D32] break-all">{CONTRACT}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#ECEFEA] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#166534]" />
            <span className="font-bold text-[#166534]">Zero personal data on-chain</span>
          </div>
          <div className="flex flex-col gap-2 pt-1">
            <a href={`https://amoy.polygonscan.com/address/${CONTRACT}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-[#153D32] hover:underline">
              View contract on Polygonscan <ExternalLink className="w-3 h-3" />
            </a>
            <Link href="/verify" className="inline-flex items-center gap-1 font-bold text-[#153D32] hover:underline">
              Open public verifier <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-black text-base text-[#153D32]">Your Credentials</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {types.map((t) => (
            <div key={t.title} className="bg-white rounded-2xl p-5 border border-[#ECEFEA] text-center space-y-2">
              <t.icon className="w-6 h-6 text-[#153D32] mx-auto" />
              <p className="text-xs font-bold text-[#153D32]">{t.title}</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F4F6F2] text-[#68716D] text-[10px] font-bold">Not issued</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
