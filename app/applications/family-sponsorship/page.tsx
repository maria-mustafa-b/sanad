"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Upload, 
  FileText, 
  Lock,
  ChevronRight,
  Eye,
  Check
} from "lucide-react";
import { useSituation } from "@/lib/context/SituationContext";

const DRAFT_KEY = "sanad_application_draft_family";

export default function ApplicationAssistancePage() {
  const router = useRouter();
  const { profile } = useSituation();

  // Suggest a value only from facts the user confirmed; otherwise leave the field empty.
  const fromFacts = (...words: string[]) => {
    const hit = Object.values(profile?.facts || {}).find(
      (f) => f.confirmed && words.some((w) => f.label.toLowerCase().includes(w))
    );
    return hit?.value || "";
  };
  const draft = (() => {
    if (typeof window === "undefined") return null;
    try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || "null"); } catch { return null; }
  })();

  const [step, setStep] = useState<number>(draft?.step || 1);
  const [fullName, setFullName] = useState<string>(draft?.fullName ?? fromFacts("name"));
  const [residencyStatus, setResidencyStatus] = useState<string>(draft?.residencyStatus ?? fromFacts("residen"));
  const [emiratesId, setEmiratesId] = useState<string>(draft?.emiratesId ?? fromFacts("emirates id", "id number"));
  const [employmentStatus, setEmploymentStatus] = useState<string>(draft?.employmentStatus ?? fromFacts("employ", "sector"));

  // Step 2: Family details
  const [sponsorTarget, setSponsorTarget] = useState<string>(draft?.sponsorTarget ?? fromFacts("sponsor"));
  const [fatherName, setFatherName] = useState<string>(draft?.fatherName ?? "");
  const [motherName, setMotherName] = useState<string>(draft?.motherName ?? "");

  // Step 3: Documents the user uploaded and confirmed in My Documents
  const [documentsAttached] = useState<{ name: string; status: string; ready: boolean }[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const docs = JSON.parse(localStorage.getItem("sanad_documents") || "[]");
      return docs.map((d: { name: string; status: string; extraction?: { documentType?: string } }) => ({
        name: d.extraction?.documentType || d.name,
        status: d.status === "CONFIRMED" ? "Confirmed by you" : "Needs review in My Documents",
        ready: d.status === "CONFIRMED",
      }));
    } catch { return []; }
  });

  // Progress is saved locally so the user can continue later.
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ step, fullName, residencyStatus, emiratesId, employmentStatus, sponsorTarget, fatherName, motherName }));
    } catch {}
  }, [step, fullName, residencyStatus, emiratesId, employmentStatus, sponsorTarget, fatherName, motherName]);

  // SANAD never submits. The final step hands the user to the official portal.
  const [isSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = () => setSubmitted(true);

  // The application follows the service SANAD matched in conversation, not a fixed visa.
  const service = profile?.services?.[0];
  const isFamily = !!service && /family|sponsor/i.test(service.title);
  const OFFICIAL_URL = service?.url || "";
  const authority = (() => { try { return new URL(OFFICIAL_URL).hostname; } catch { return ""; } })();

  const stepsList = [
    { num: 1, label: "Personal Details" },
    { num: 2, label: isFamily ? "Family Details" : "Details" },
    { num: 3, label: "Documents" },
    { num: 4, label: "Review & Submit" }
  ];

  if (!service) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl p-10 border border-[#ECEFEA] shadow-sm text-center space-y-4">
          <h1 className="text-2xl font-black text-[#153D32]">Application Assistance</h1>
          <p className="text-sm text-[#68716D] max-w-md mx-auto">
            Tell SANAD about your situation first. SANAD will find the right official service, then help you prepare that application.
          </p>
          <Link href="/chat" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#153D32] text-white text-xs font-bold">
            Talk to SANAD <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* ================= HEADER (Screen 6) ================= */}
      <div className="flex items-start gap-4 pb-2 border-b border-[#ECEFEA]">
        <div className="w-12 h-12 rounded-2xl bg-[#EBF5EF] text-[#153D32] flex items-center justify-center shrink-0 shadow-2xs">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#153D32] tracking-tight">
            Application Assistance
          </h1>
          <p className="text-xs sm:text-sm text-[#68716D] mt-0.5">
            Prepare your application for <b>{service.title}</b>. You submit it yourself on the official portal.
          </p>
        </div>
      </div>

      {/* ================= 4-STEP WIZARD PROGRESS BAR (Screen 6) ================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ECEFEA] shadow-sm">
        <div className="flex items-center justify-between relative max-w-2xl mx-auto">
          {/* Progress Connecting Line */}
          <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-[2px] bg-[#ECEFEA] -z-0"></div>
          <div 
            className="absolute top-1/2 left-6 -translate-y-1/2 h-[2px] bg-[#153D32] transition-all duration-300 -z-0"
            style={{ width: `${((step - 1) / (stepsList.length - 1)) * 100}%` }}
          ></div>

          {stepsList.map((s) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;

            return (
              <div key={s.num} className="flex flex-col items-center relative z-10">
                <button
                  type="button"
                  onClick={() => s.num < step && setStep(s.num)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition shadow-2xs ${
                    isCompleted
                      ? "bg-[#153D32] text-white"
                      : isCurrent
                      ? "bg-[#153D32] text-white ring-4 ring-[#EAF5EF]"
                      : "bg-[#FAFBF9] border border-[#DDE2D9] text-[#7B8580]"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                </button>
                <span className={`text-[11px] font-bold mt-2 whitespace-nowrap ${
                  isCurrent ? "text-[#153D32]" : "text-[#7B8580]"
                }`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= STEP 1: PERSONAL DETAILS (Exact Screen 6) ================= */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ECEFEA] shadow-sm space-y-6 animate-in fade-in duration-200">
          
          <div className="flex items-center justify-between pb-3 border-b border-[#F0F3EE]">
            <h3 className="font-extrabold text-base text-[#153D32]">
              Your Details (Auto-filled)
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-[#166534] bg-[#EBF7EE] border border-[#BBF7D0] px-3 py-1 rounded-full font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Retrieved from your profile</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#3A4540]">Full Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAFBF9] border border-[#E1E5DE] rounded-xl text-xs sm:text-sm text-[#1F2925] focus:outline-none focus:border-[#153D32]"
              />
            </div>

            {/* Residency Status */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#3A4540]">Residency Status</label>
              <input 
                type="text" 
                value={residencyStatus}
                onChange={(e) => setResidencyStatus(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAFBF9] border border-[#E1E5DE] rounded-xl text-xs sm:text-sm text-[#1F2925] focus:outline-none focus:border-[#153D32]"
              />
            </div>

            {/* Emirates ID */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#3A4540]">Emirates ID</label>
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={emiratesId}
                  onChange={(e) => setEmiratesId(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FAFBF9] border border-[#E1E5DE] rounded-xl text-xs sm:text-sm font-mono text-[#1F2925] focus:outline-none focus:border-[#153D32]"
                />
                <Eye className="w-4 h-4 text-[#8C9691] absolute right-3.5" />
              </div>
            </div>

            {/* Employment Status */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#3A4540]">Employment Status</label>
              <select 
                value={employmentStatus}
                onChange={(e) => setEmploymentStatus(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAFBF9] border border-[#E1E5DE] rounded-xl text-xs sm:text-sm text-[#1F2925] focus:outline-none focus:border-[#153D32]"
              >
                <option value="Employed">Employed (Private Sector)</option>
                <option value="Government">Government / Semi-Gov</option>
                <option value="Investor">Investor / Business Owner</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#F0F3EE]">
            <Link 
              href="/situation" 
              className="text-xs font-bold text-[#5C6661] hover:text-[#153D32] transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to My Situation</span>
            </Link>

            <button
              onClick={() => setStep(isFamily ? 2 : 3)}
              className="px-6 py-3 rounded-xl bg-[#153D32] hover:bg-[#103027] text-white text-xs font-bold transition shadow-sm flex items-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ================= STEP 2: FAMILY DETAILS ================= */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ECEFEA] shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="pb-3 border-b border-[#F0F3EE]">
            <h3 className="font-extrabold text-base text-[#153D32]">
              Family Member Details
            </h3>
            <p className="text-xs text-[#68716D]">
              Specify the family members you are sponsoring.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#3A4540]">Who would you like to sponsor?</label>
              <div className="grid grid-cols-3 gap-3">
                {["Both Parents", "Mother Only", "Father Only"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSponsorTarget(opt)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold transition border ${
                      sponsorTarget === opt 
                        ? "bg-[#153D32] text-white border-[#153D32]" 
                        : "bg-[#FAFBF9] border-[#E1E5DE] text-[#3A4540] hover:border-[#153D32]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#3A4540]">Father's Full Name (as in passport)</label>
                <input 
                  type="text" 
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FAFBF9] border border-[#E1E5DE] rounded-xl text-xs text-[#1F2925] focus:outline-none focus:border-[#153D32]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#3A4540]">Mother's Full Name (as in passport)</label>
                <input 
                  type="text" 
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FAFBF9] border border-[#E1E5DE] rounded-xl text-xs text-[#1F2925] focus:outline-none focus:border-[#153D32]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#F0F3EE]">
            <button
              onClick={() => setStep(1)}
              className="text-xs font-bold text-[#5C6661] hover:text-[#153D32] transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 rounded-xl bg-[#153D32] hover:bg-[#103027] text-white text-xs font-bold transition shadow-sm flex items-center gap-2"
            >
              <span>Continue to Documents</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: DOCUMENTS ================= */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ECEFEA] shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="pb-3 border-b border-[#F0F3EE]">
            <h3 className="font-extrabold text-base text-[#153D32]">
              Smart Document Vault Sync
            </h3>
            <p className="text-xs text-[#68716D]">
              Documents you uploaded in My Documents. Only ones you confirmed count as ready.
            </p>
          </div>

          <div className="space-y-3">
            {documentsAttached.length === 0 && (
              <p className="text-xs text-[#68716D]">
                No documents yet. <Link href="/documents" className="font-bold text-[#153D32] underline">Upload them in My Documents</Link>.
              </p>
            )}
            {documentsAttached.map((doc, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#ECEFEA] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E1E5DE] text-[#153D32] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#153D32]">{doc.name}</h4>
                    <span className="text-[11px] text-[#6E7873]">{doc.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${doc.ready ? "bg-[#EBF7EE] text-[#166534]" : "bg-amber-50 text-amber-800"}`}>
                    {doc.ready ? "Ready" : "Review needed"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#F0F3EE]">
            <button
              onClick={() => setStep(isFamily ? 2 : 1)}
              className="text-xs font-bold text-[#5C6661] hover:text-[#153D32] transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setStep(4)}
              className="px-6 py-3 rounded-xl bg-[#153D32] hover:bg-[#103027] text-white text-xs font-bold transition shadow-sm flex items-center gap-2"
            >
              <span>Review Application</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 4: REVIEW & SUBMIT ================= */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ECEFEA] shadow-sm space-y-6 animate-in fade-in duration-200">
          
          {submitted ? (
            <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-[#EBF7EE] text-[#166534] border border-[#BBF7D0] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-[#153D32]">Your application is prepared</h2>
              <p className="text-xs sm:text-sm text-[#5C6661] max-w-md mx-auto leading-relaxed">
                Nothing has been submitted. Your draft is saved in this browser. Submit it yourself on the official
                government portal, using the details you reviewed here.
              </p>
              <div className="pt-4 flex items-center justify-center gap-3">
                <a
                  href={OFFICIAL_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-xl bg-[#153D32] text-white text-xs font-bold hover:bg-[#103027] transition shadow-sm"
                >
                  Open the official portal
                </a>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 rounded-xl bg-white border border-[#DDE2D9] text-[#153D32] text-xs font-bold hover:bg-[#FAFBF9] transition"
                >
                  Back to review
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="pb-3 border-b border-[#F0F3EE]">
                <h3 className="font-extrabold text-base text-[#153D32]">
                  Final Review & Declaration
                </h3>
                <p className="text-xs text-[#68716D]">
                  Check every field. Empty fields were not provided by you and must be filled in.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#ECEFEA] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#6E7873]">Applicant Name:</span>
                    <span className="font-bold text-[#153D32]">{fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E7873]">Emirates ID:</span>
                    <span className="font-mono font-bold text-[#153D32]">{emiratesId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E7873]">Service:</span>
                    <span className="font-bold text-[#153D32]">{service.title}</span>
                  </div>
                  {isFamily && (
                    <div className="flex justify-between">
                      <span className="text-[#6E7873]">Sponsoring:</span>
                      <span className="font-bold text-[#153D32]">{[sponsorTarget, fatherName, motherName].filter(Boolean).join(", ") || "Not provided"}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#6E7873]">Authority:</span>
                    <span className="font-bold text-[#153D32]">{authority || "See official portal"}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-start gap-3">
                  <Lock className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#166534] leading-relaxed">
                    SANAD does not submit applications. Confirming marks this draft as reviewed and takes you to the official portal to submit it yourself.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#F0F3EE]">
                <button
                  onClick={() => setStep(3)}
                  className="text-xs font-bold text-[#5C6661] hover:text-[#153D32] transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-[#153D32] hover:bg-[#103027] text-white text-xs font-bold transition shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <span>Confirm review</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}

        </div>
      )}

    </div>
  );
}