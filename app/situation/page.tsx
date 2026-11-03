"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Users, Sparkles, Mic, Home, Briefcase, Heart, ShieldCheck, Target, ArrowRight, FileText } from "lucide-react";
import { useSituation, type SituationProfile } from "@/lib/context/SituationContext";

// Find a stated fact by keywords in its key or label (EN/AR/HI labels all work).
function pick(profile: SituationProfile, words: string[]) {
  const hit = Object.entries(profile.facts || {}).find(([k, f]) =>
    words.some((w) => k.toLowerCase().includes(w) || f.label.toLowerCase().includes(w))
  );
  return hit?.[1];
}

function PageHeader({ updated }: { updated?: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#ECEFEA] bg-gradient-to-r from-white via-white to-[#FBF3EA]">
      <div className="absolute inset-y-0 right-0 w-1/2 opacity-60 pointer-events-none">
        <Image src="/ui/01_header_skyline_banner.jpg" alt="" fill className="object-cover object-bottom [mask-image:linear-gradient(to_right,transparent,black_60%)]" />
      </div>
      <div className="relative flex items-center gap-4 p-6 sm:p-8">
        <div className="w-14 h-14 rounded-2xl bg-[#EBF5EF] text-[#153D32] flex items-center justify-center shrink-0">
          <Users className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#153D32] tracking-tight">My Situation</h1>
          <p className="text-xs sm:text-sm text-[#5C6661] mt-1 max-w-md">
            Your current circumstances and goals, kept up to date through your conversations with SANAD.
            {updated && <span className="block text-[11px] text-[#8C9691] mt-1">Last updated: {updated}</span>}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MySituationPage() {
  const { profile, updateProfile } = useSituation();
  const hasData = !!profile && (!!profile.summary || Object.keys(profile.facts || {}).length > 0);

  if (!hasData) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in duration-300">
        <PageHeader />
        <div className="bg-white rounded-3xl p-10 border border-[#ECEFEA] shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#EBF5EF] text-[#153D32] flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-[#153D32]">No situation recorded yet</h2>
          <p className="text-sm text-[#68716D] max-w-md mx-auto">
            Tell SANAD about your situation in any language. Your details appear here for you to review and confirm.
          </p>
          <Link href="/chat" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#153D32] text-white text-xs font-bold">
            <Mic className="w-4 h-4" /> Talk to SANAD
          </Link>
        </div>
      </div>
    );
  }

  const p = profile!;
  const tiles = [
    { icon: Home, title: "Residency", fact: pick(p, ["residen", "emirate", "إقامة", "إمارة"]) },
    { icon: Briefcase, title: "Employment", fact: pick(p, ["employ", "sector", "job", "عمل"]) },
    { icon: Heart, title: "Family", fact: pick(p, ["depend", "sponsor", "parent", "family", "والد"]) },
    { icon: Home, title: "Accommodation", fact: pick(p, ["housing", "accommodat", "tenancy", "rent", "سكن", "إيجار"]) },
  ];
  const goal = pick(p, ["goal", "intent", "هدف"])?.value || p.target_service;
  const services = p.services || [];
  const confirmed = Object.values(p.facts || {}).filter((f) => f.confirmed).length;
  const total = Object.keys(p.facts || {}).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in duration-300">
      <PageHeader updated={p.last_updated} />

      {/* Summary */}
      <div className="bg-white rounded-3xl p-6 border border-[#ECEFEA] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <Sparkles className="w-7 h-7 text-[#153D32] shrink-0" />
          <div>
            <h2 className="font-black text-lg text-[#153D32]">Your Situation Summary</h2>
            <p className="text-sm text-[#5C6661] mt-1">
              {p.summary || `SANAD has recorded ${total} detail${total === 1 ? "" : "s"} from your conversation. ${confirmed} confirmed by you.`}
            </p>
          </div>
        </div>
        <Link href="/chat" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#BCE1CA] bg-[#F3F8F5] text-xs font-bold text-[#153D32] shrink-0">
          <Mic className="w-4 h-4" /> Update with SANAD
        </Link>
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
        {/* Key details */}
        <div className="bg-white rounded-3xl p-6 border border-[#ECEFEA] shadow-sm">
          <h3 className="font-black text-base text-[#153D32] mb-4">Key Details</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {tiles.map((t) => (
              <div key={t.title} className="rounded-2xl border border-[#ECEFEA] bg-[#FAFBF9] p-4 text-center">
                <t.icon className="w-6 h-6 text-[#153D32] mx-auto" />
                <p className="mt-2 text-xs font-bold text-[#153D32]">{t.title}</p>
                <p className={`text-[11px] mt-0.5 ${t.fact ? "text-[#3A4540]" : "text-[#8C9691] italic"}`}>
                  {t.fact?.value || "Not provided"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Goal */}
        <div className="relative overflow-hidden rounded-3xl border border-[#ECEFEA] bg-white shadow-sm min-h-[180px]">
          <Image src="/ui/02_family_support_photo.jpg" alt="" fill className="object-cover object-bottom opacity-90" />
          <div className="relative p-6">
            <h3 className="font-black text-base text-[#153D32] flex items-center gap-2"><Target className="w-5 h-5" /> Your Goal</h3>
            <p className="mt-3 inline-block px-4 py-2 rounded-xl bg-white/90 border border-[#ECEFEA] text-sm font-bold text-[#153D32]">
              {goal || "Tell SANAD what you want to achieve"}
            </p>
          </div>
        </div>
      </div>

      {/* Suggested for you */}
      {services.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-[#ECEFEA] shadow-sm space-y-4">
          <div>
            <h3 className="font-black text-base text-[#153D32]">Suggested for You</h3>
            <p className="text-xs text-[#68716D]">Official services from the SANAD catalogue, matched to what you told SANAD.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {services.slice(0, 2).map((s, i) => (
              <a key={s.id} href={s.url} target="_blank" rel="noreferrer"
                className={`rounded-2xl border p-4 text-xs hover:border-[#153D32] ${i === 0 ? "bg-[#F3F8F5] border-[#BCE1CA]" : "bg-white border-[#ECEFEA]"}`}>
                <p className="font-bold text-sm text-[#153D32]">{s.title}</p>
                {s.why && <p className="text-[#5C6661] mt-1">{s.why}</p>}
                <span className="inline-flex items-center gap-1 mt-2 font-bold text-[#153D32]">Official source <ArrowRight className="w-3 h-3" /></span>
              </a>
            ))}
            <Link href="/applications/family-sponsorship" className="rounded-2xl border border-[#ECEFEA] bg-white p-4 text-xs hover:border-[#153D32]">
              <img src="/ui/06_application_progress_illustration.jpg" alt="" className="w-full h-20 object-contain mb-1" />
              <p className="font-bold text-sm text-[#153D32] mt-1">Prepare application</p>
              <p className="text-[#5C6661] mt-1">Fill the form with your confirmed details.</p>
            </Link>
          </div>
        </div>
      )}

      {/* All details with source + confirmation */}
      <div className="bg-white rounded-3xl p-6 border border-[#ECEFEA] shadow-sm space-y-2">
        <h3 className="font-black text-base text-[#153D32] flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Your Details</h3>
        <FactsEditor profile={p} updateProfile={updateProfile} />
      </div>
    </div>
  );
}

type Facts = NonNullable<SituationProfile["facts"]>;

// Only facts the user stated in conversation. Nothing here is verified by an authority.
function FactsEditor({
  profile,
  updateProfile,
}: {
  profile: SituationProfile;
  updateProfile: (u: Partial<SituationProfile>) => void;
}) {
  const facts: Facts = profile.facts || {};
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const save = (key: string, patch: Partial<Facts[string]>) =>
    updateProfile({ facts: { ...facts, [key]: { ...facts[key], ...patch } } });

  const entries = Object.entries(facts);
  return (
    <div className="space-y-3 pt-2">
      <p className="text-[11px] text-[#68716D]">
        Labels: <b>AI extracted</b> (not yet checked by you) · <b>User confirmed</b> (you checked it). Nothing here is verified by a government authority.
      </p>
      {entries.length === 0 && (
        <p className="text-xs text-[#68716D]">No details recorded yet. Tell SANAD about your situation in the chat.</p>
      )}
      {entries.map(([key, f]) => (
        <div key={key} className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#ECEFEA] flex items-center justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#153D32]">{f.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${f.confirmed ? "bg-[#EBF7EE] text-[#166534]" : "bg-amber-50 text-amber-800"}`}>
                {f.confirmed ? "User confirmed" : "AI extracted · needs confirmation"}
              </span>
              <span className="text-[10px] text-[#68716D]">Source: {f.source || "Conversation"}</span>
            </div>
            {editing === key ? (
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-[#DDE2D9] text-xs"
                aria-label={`Edit ${f.label}`}
                autoFocus
              />
            ) : (
              <p className="text-[12px] text-[#3A4540]">{f.value}</p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            {editing === key ? (
              <button
                onClick={() => { save(key, { value: draft.trim() || f.value, confirmed: true }); setEditing(null); }}
                className="px-3 py-1.5 rounded-lg bg-[#153D32] text-white text-[11px] font-bold"
              >
                Save
              </button>
            ) : (
              <>
                <button
                  onClick={() => { setEditing(key); setDraft(f.value); }}
                  className="px-3 py-1.5 rounded-lg border border-[#DDE2D9] text-[11px] font-bold text-[#153D32]"
                >
                  Edit
                </button>
                {!f.confirmed && (
                  <button
                    onClick={() => save(key, { confirmed: true })}
                    className="px-3 py-1.5 rounded-lg bg-[#153D32] text-white text-[11px] font-bold"
                  >
                    Confirm
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      ))}
      {!!profile.missing_info?.length && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
          <p className="font-bold">Still needed for accurate guidance</p>
          {profile.missing_info.map((m, i) => <p key={i}>• {m}</p>)}
        </div>
      )}
      {!!profile.services?.length && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-[#153D32]">Official services matched from the SANAD catalogue</p>
          {profile.services.map((s) => (
            <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="block p-3 rounded-xl border border-[#ECEFEA] bg-white text-xs hover:border-[#153D32]">
              <span className="font-mono text-[#467060] mr-2">{s.id}</span>
              <span className="font-bold text-[#153D32]">{s.title}</span>
              {s.why && <span className="block text-[11px] text-[#3A4540] mt-0.5">Why: {s.why}</span>}
              <span className="block text-[11px] text-[#68716D] mt-0.5">{s.url}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
