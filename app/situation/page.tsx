"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Upload, 
  ShieldCheck, 
  RefreshCw,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  Clock,
  Briefcase,
  Mic
} from "lucide-react";
import { useSituation, type SituationProfile } from "@/lib/context/SituationContext";

export default function MySituationPage() {
  const { profile, updateProfile } = useSituation();
  const [activeTab, setActiveTab] = useState<"overview" | "eligibility" | "requirements" | "next_steps">("overview");

  // ================= IF NO SITUATION RECORDED YET (FRESH USER STATE) =================
  if (!profile || (!profile.summary && !Object.keys(profile.facts || {}).length)) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#ECEFEA]">
          <div className="w-10 h-10 rounded-2xl bg-[#EBF5EF] text-[#153D32] flex items-center justify-center shadow-2xs">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#153D32] tracking-tight">
              My Situation
            </h1>
            <p className="text-xs text-[#68716D] mt-0.5">
              Your confirmed details and personalised guidance.
            </p>
          </div>
        </div>

        {/* Empty State Banner (No Hardcoded Mock Data) */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#ECEFEA] shadow-sm text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#EBF5EF] text-[#153D32] flex items-center justify-center shadow-2xs">
            <Sparkles className="w-8 h-8" />
          </div>
          
          <div className="space-y-1 max-w-md">
            <h2 className="text-xl font-black text-[#153D32]">
              No Situation Recorded Yet
            </h2>
            <p className="text-xs sm:text-sm text-[#68716D] leading-relaxed">
              SANAD personalizes this overview based on what you share in conversation. Speak or chat with SANAD to build your customized situation profile, eligibility analysis, and checklist.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#153D32] hover:bg-[#103027] text-white text-xs font-bold transition shadow-sm"
            >
              <Mic className="w-4 h-4" />
              <span>Speak to SANAD Now</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ================= POPULATED STATE (REAL CONVERSATION EXTRACTED DATA) =================
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#ECEFEA]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EBF5EF] text-[#153D32] flex items-center justify-center shadow-2xs">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#153D32] tracking-tight">
              My Situation
            </h1>
            <p className="text-xs text-[#68716D] mt-0.5">
              Your confirmed details and personalised guidance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#68716D]">
          <span>Last updated: {profile.last_updated || "Just now"}</span>
          <CheckCircle2 className="w-4 h-4 text-[#166534]" />
        </div>
      </div>

      {/* A. SITUATION SUMMARY */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ECEFEA] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F4F6F2] text-[#153D32] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-base text-[#153D32]">
              Your Situation Summary
            </h3>
            <p className="text-sm text-[#5C6661] leading-relaxed max-w-2xl">
              {profile.summary || "Built only from what you told SANAD. Review, edit and confirm each detail below."}
            </p>
          </div>
        </div>

        <Link
          href="/chat"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAFBF9] border border-[#DDE2D9] text-xs font-bold text-[#153D32] hover:bg-[#153D32] hover:text-white transition shadow-2xs shrink-0 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Update with SANAD</span>
        </Link>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "overview", label: "Overview" },
          { id: "eligibility", label: "Eligibility" },
          { id: "requirements", label: "Requirements" },
          { id: "next_steps", label: "Next Steps" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2 rounded-full text-xs font-bold transition shadow-2xs cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#153D32] text-white shadow-xs"
                : "bg-white border border-[#E3E7E0] text-[#5C6661] hover:border-[#153D32]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ECEFEA] shadow-sm space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-[#F0F3EE]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EBF5EF] text-[#153D32] flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#153D32]">
                    {profile.target_service || "Identified Government Service"}
                  </h2>
                  <p className="text-xs text-[#68716D] mt-0.5">
                    Recommended based on your recent conversation.
                  </p>
                </div>
              </div>

              <span className="px-3.5 py-1 rounded-full bg-[#EBF7EE] text-[#166534] border border-[#BBF7D0] text-xs font-bold">
                Recommended
              </span>
            </div>

            {/* Your Eligibility Callout */}
            <div className="bg-[#FAFBF9] rounded-2xl p-5 border border-[#ECEFEA] space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-[#153D32] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#166534]" />
                <span>Your Eligibility Assessment</span>
              </div>

              <div className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-[#BCE1CA]">
                <CheckCircle2 className="w-5 h-5 text-[#166534] shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#153D32]">
                    You are eligible based on your stated information.
                  </p>
                  <p className="text-[11px] text-[#6E7873]">
                    Official authority review applies upon formal filing.
                  </p>
                </div>
              </div>

              {profile.reasons && profile.reasons.length > 0 && (
                <div className="pt-2 space-y-2">
                  <p className="text-xs font-bold text-[#153D32]">Why this is recommended for you:</p>
                  <div className="space-y-1.5 text-xs text-[#5C6661]">
                    {profile.reasons.map((r, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#166534] shrink-0" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href="/applications/family-sponsorship"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#153D32] hover:bg-[#103027] text-white text-xs font-bold transition shadow-sm"
              >
                <span>Continue to Application Assistance</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ELIGIBILITY */}
      {activeTab === "eligibility" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ECEFEA] shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF5EF] text-[#166534] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-[#153D32]">Your Details</h3>
              <p className="text-xs text-[#68716D]">What you told SANAD. Not verified by any authority; confirm official requirements on the linked service.</p>
            </div>
          </div>

          <FactsEditor profile={profile} updateProfile={updateProfile} />
        </div>
      )}

      {/* TAB 3: REQUIREMENTS */}
      {activeTab === "requirements" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ECEFEA] shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0F3EE]">
            <div>
              <h3 className="font-black text-lg text-[#153D32]">Document Requirements Checklist</h3>
              <p className="text-xs text-[#68716D]">Vault sync for your specific service</p>
            </div>
            <Link
              href="/documents"
              className="px-4 py-2 rounded-xl bg-[#153D32] text-white text-xs font-bold hover:bg-[#103027] transition"
            >
              Document Vault
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-[#166534] uppercase tracking-wider">Already Available</h4>
              {(profile.documents_ready || []).map((d, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-[#FAFBF9] border border-[#BCE1CA] flex items-center justify-between text-xs">
                  <span className="font-bold text-[#153D32]">{d}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#EBF7EE] text-[#166534] font-bold text-[10px]">Ready</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-amber-700 uppercase tracking-wider">Action Needed</h4>
              {(profile.documents_needed || []).map((d, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-[#FAFBF9] border border-amber-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#202A27]">{d}</span>
                  <Link href="/documents" className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold text-[10px] hover:bg-amber-200 transition">
                    Upload
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: NEXT STEPS */}
      {activeTab === "next_steps" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ECEFEA] shadow-sm space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="font-black text-lg text-[#153D32]">Recommended Sequence of Actions</h3>
            <p className="text-xs text-[#68716D]">Step-by-step path forward</p>
          </div>

          <div className="space-y-3">
            {(profile.next_steps || [
              "Confirm your extracted details",
              "Upload remaining required files",
              "Complete ministerial application assistance"
            ]).map((step, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#ECEFEA] flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-[#153D32] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#153D32]">{step}</h4>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <Link
              href="/applications/family-sponsorship"
              className="px-6 py-3 rounded-xl bg-[#153D32] hover:bg-[#103027] text-white text-xs font-bold transition shadow-sm inline-flex items-center gap-2"
            >
              <span>Start Application</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

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
