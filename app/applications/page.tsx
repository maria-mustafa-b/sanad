"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, ArrowRight, ExternalLink } from "lucide-react";
import { useSituation, sponsorshipService } from "@/lib/context/SituationContext";
import { PageHeader } from "@/components/ui/page-header";

// Application status is only shown when it comes from an official integration.
// SANAD has none connected yet, so this page never invents IDs or statuses.
export default function MyApplicationsPage() {
  const { profile } = useSituation();
  const services = profile?.services || [];
  const [prepared, setPrepared] = useState<{ id: string; title: string; url: string; preparedAt: string }[]>([]);

  useEffect(() => {
    try {
      setPrepared(JSON.parse(localStorage.getItem("sanad_applications") || "[]"));
    } catch {}
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      <PageHeader icon={FileText} title="My Applications" subtitle="Prepare applications with SANAD, then submit them on the official government portal." />

      {prepared.map((a) => (
        <div key={a.id} className="bg-white rounded-3xl p-6 border border-[#ECEFEA] shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-black text-base text-[#153D32]">{a.title}</h2>
              <p className="text-xs text-[#68716D]">Prepared {a.preparedAt}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold shrink-0">
              Prepared, not yet submitted
            </span>
          </div>
          <p className="text-xs text-[#5C6661]">
            Submit it yourself on the official portal. Official status appears here only once a government integration is connected.
          </p>
          <div className="flex flex-wrap gap-2">
            <a href={a.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#153D32] text-white text-xs font-bold">
              Open official portal <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <Link href="/applications/family-sponsorship" className="px-4 py-2 rounded-xl border border-[#DDE2D9] text-xs font-bold text-[#153D32]">
              Review details
            </Link>
          </div>
        </div>
      ))}

      {prepared.length === 0 && (
      <div className="bg-white rounded-3xl p-8 border border-[#ECEFEA] shadow-sm text-center space-y-3">
        <img src="/ui/03_family_sponsorship_illustration.jpg" alt="" className="h-32 mx-auto object-contain" />
        <h2 className="text-lg font-black text-[#153D32]">No submitted applications</h2>
        <p className="text-xs sm:text-sm text-[#68716D] max-w-lg mx-auto">
          SANAD never submits on your behalf. Reference numbers and official statuses will appear here only once an
          authorised government integration is connected.
        </p>
        <Link
          href={sponsorshipService(profile) ? "/applications/family-sponsorship" : "/chat"}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#153D32] text-white text-xs font-bold"
        >
          {sponsorshipService(profile) ? "Prepare your application" : "Talk to SANAD"} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      )}

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
