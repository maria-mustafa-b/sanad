"use client";

import React from "react";
import Link from "next/link";
import { FileText, ArrowRight, ExternalLink } from "lucide-react";
import { useSituation } from "@/lib/context/SituationContext";

// Application status is only shown when it comes from an official integration.
// SANAD has none connected yet, so this page never invents IDs or statuses.
export default function MyApplicationsPage() {
  const { profile } = useSituation();
  const services = profile?.services || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      <div className="flex items-start gap-3 pb-2 border-b border-[#ECEFEA]">
        <div className="w-10 h-10 rounded-2xl bg-[#EBF5EF] text-[#153D32] flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#153D32] tracking-tight">My Applications</h1>
          <p className="text-xs sm:text-sm text-[#68716D] mt-0.5">
            Prepare applications with SANAD, then submit them on the official government portal.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-[#ECEFEA] shadow-sm text-center space-y-3">
        <h2 className="text-lg font-black text-[#153D32]">No submitted applications</h2>
        <p className="text-xs sm:text-sm text-[#68716D] max-w-lg mx-auto">
          SANAD never submits on your behalf. Reference numbers and official statuses will appear here only once an
          authorised government integration is connected.
        </p>
        <Link
          href="/applications/family-sponsorship"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#153D32] text-white text-xs font-bold"
        >
          Prepare an application with SANAD <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {services.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-black text-[#153D32]">Official portals for services SANAD matched to your situation</h3>
          {services.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#ECEFEA] hover:border-[#153D32] text-xs"
            >
              <span>
                <span className="font-bold text-[#153D32]">{s.title}</span>
                {s.why && <span className="block text-[#68716D] mt-0.5">{s.why}</span>}
              </span>
              <ExternalLink className="w-4 h-4 text-[#153D32] shrink-0" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
