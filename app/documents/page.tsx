"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FolderOpen, Upload, CheckCircle2, FileText, AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { useSituation } from "@/lib/context/SituationContext";
import { PageHeader } from "@/components/ui/page-header";

type Extraction = {
  documentType?: string;
  extractedText?: string;
  fields?: { label: string; value: string; certain?: boolean }[];
  unreadableFields?: string[];
  expiryDate?: string;
  flags?: string[];
  readable?: boolean;
  confidence?: number;
  source?: string;
};

type Doc = {
  id: string;
  name: string;
  uploadedAt: string;
  status: "ANALYZING" | "NEEDS_CONFIRMATION" | "CONFIRMED" | "FAILED";
  error?: string;
  extraction?: Extraction;
};

const STORAGE_KEY = "sanad_documents";
const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ["application/pdf", "image/jpeg", "image/png"];

export default function DocumentsPage() {
  const { profile, updateProfile } = useSituation();
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [consent, setConsent] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"ALL" | Doc["status"]>("ALL");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setDocuments(JSON.parse(saved));
    } catch {}
  }, []);

  const persist = (next: Doc[]) => {
    setDocuments(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  };
  const patch = (id: string, p: Partial<Doc>) =>
    setDocuments((prev) => {
      const next = prev.map((d) => (d.id === id ? { ...d, ...p } : d));
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const id = "doc-" + Date.now();
    const base: Doc = { id, name: file.name, uploadedAt: new Date().toLocaleString(), status: "ANALYZING" };

    if (!ACCEPTED.includes(file.type) || file.size > MAX_BYTES) {
      persist([{ ...base, status: "FAILED", error: "Only PDF, JPG or PNG files up to 10 MB are supported." }, ...documents]);
      return;
    }
    persist([base, ...documents]);

    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/documents", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) {
        patch(id, { status: "FAILED", error: json.message || json.error || "Analysis failed." });
        return;
      }
      const ex: Extraction = json.data;
      if (ex.source === "sample_fallback") {
        patch(id, { status: "FAILED", error: "The AI could not read this document right now. Nothing was extracted. Please try again." });
      } else if (ex.readable === false) {
        patch(id, { status: "FAILED", extraction: ex, error: "The document is unreadable or incomplete. Upload a clearer copy." });
      } else {
        patch(id, { status: "NEEDS_CONFIRMATION", extraction: ex });
      }
    } catch {
      patch(id, { status: "FAILED", error: "Network error during upload. Nothing was saved." });
    }
  };

  // Only after the user confirms do extracted details reach My Situation.
  const confirmDoc = (doc: Doc) => {
    const type = doc.extraction?.documentType || doc.name;
    const facts = { ...(profile?.facts || {}) };
    for (const f of (doc.extraction?.fields || []).filter((x) => x.certain !== false)) {
      facts[`doc_${doc.id}_${f.label}`] = { label: f.label, value: f.value, confirmed: true, source: `${type} (OCR)` };
    }
    updateProfile({
      facts,
      documents_ready: Array.from(new Set([...(profile?.documents_ready || []), type])),
    });
    patch(doc.id, { status: "CONFIRMED" });
  };

  const visible = documents.filter((d) => (filter === "ALL" || d.status === filter) &&
    `${d.name} ${d.extraction?.documentType || ""}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in duration-300">
      <PageHeader icon={FolderOpen} title="My Documents" subtitle="Upload a document, review what SANAD read, and confirm before it is used. The list is kept in this browser." />

      <div className="grid md:grid-cols-[1.6fr_1fr] gap-6 items-start">
      <div className="bg-white rounded-3xl p-6 border border-[#ECEFEA] shadow-sm space-y-4">
        <label className="flex items-start gap-2 text-xs text-[#3A4540]">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
          <span>I consent to SANAD sending this document to its AI provider to read it. Avoid uploading real identity documents unless needed.</span>
        </label>
        <label
          className={`flex flex-col items-center justify-center gap-2 p-8 rounded-2xl border-2 border-dashed text-center ${
            consent ? "border-[#C2DCD0] cursor-pointer hover:border-[#153D32]" : "border-[#E4E7E1] opacity-50 cursor-not-allowed"
          }`}
        >
          <img src="/ui/04_documents_forms_illustration.jpg" alt="" className="h-20 object-contain" />
          <span className="text-sm font-bold text-[#153D32]">Upload a Document</span>
          <span className="text-xs text-[#68716D]">PDF, JPG or PNG, up to 10 MB</span>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" disabled={!consent} onChange={handleFileUpload} />
        </label>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-[#ECEFEA] shadow-sm space-y-3">
        <h3 className="font-black text-base text-[#153D32]">Document Status</h3>
        {([
          ["Confirmed", "CONFIRMED"],
          ["Processing", "ANALYZING"],
          ["Review needed", "NEEDS_CONFIRMATION"],
          ["Failed", "FAILED"],
        ] as const).map(([label, st]) => (
          <div key={st} className="flex justify-between text-xs border-b border-[#F0F3EE] pb-2 last:border-0">
            <span className="text-[#3A4540]">{label}</span>
            <b className="text-[#153D32]">{documents.filter((d) => d.status === st).length}</b>
          </div>
        ))}
      </div>
      </div>

      {documents.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {([["All", "ALL"], ["Confirmed", "CONFIRMED"], ["Review needed", "NEEDS_CONFIRMATION"], ["Failed", "FAILED"]] as const).map(([label, st]) => (
            <button key={st} onClick={() => setFilter(st)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold ${filter === st ? "bg-[#153D32] text-white" : "bg-white border border-[#E3E7E0] text-[#5C6661]"}`}>
              {label} ({st === "ALL" ? documents.length : documents.filter((d) => d.status === st).length})
            </button>
          ))}
        </div>
      )}

      {documents.length > 0 && (
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documents..."
          className="w-full px-4 py-2.5 rounded-xl border border-[#DDE2D9] text-sm bg-white"
        />
      )}

      {documents.length === 0 ? (
        <p className="text-sm text-[#68716D] text-center py-8">No documents yet.</p>
      ) : (
        <div className="space-y-4">
          {visible.map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl p-5 border border-[#ECEFEA] shadow-sm space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-5 h-5 text-[#153D32] shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-[#153D32] truncate">{doc.extraction?.documentType || doc.name}</p>
                    <p className="text-[11px] text-[#68716D]">{doc.name} · {doc.uploadedAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={doc.status} />
                  <button
                    onClick={() => persist(documents.filter((d) => d.id !== doc.id))}
                    className="p-1.5 text-[#8C9691] hover:text-red-600"
                    aria-label={`Remove ${doc.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {doc.error && (
                <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {doc.error}
                </p>
              )}

              {doc.extraction && doc.status !== "ANALYZING" && (
                <div className="text-xs space-y-2">
                  {!!doc.extraction.fields?.length && (
                    <div className="grid sm:grid-cols-2 gap-2">
                      {doc.extraction.fields.map((f, i) => (
                        <div key={i} className={`p-2.5 rounded-lg border ${f.certain === false ? "bg-amber-50 border-amber-200" : "bg-[#FAFBF9] border-[#ECEFEA]"}`}>
                          <span className="text-[#68716D]">{f.label}</span>
                          <p className="font-bold text-[#202A27]">{f.value}</p>
                          {f.certain === false && <span className="text-[10px] font-bold text-amber-800">Uncertain: check against the original</span>}
                        </div>
                      ))}
                    </div>
                  )}
                  {doc.extraction.expiryDate && <p className="text-[#3A4540]">Expiry date: <b>{doc.extraction.expiryDate}</b></p>}
                  {!!doc.extraction.unreadableFields?.length && (
                    <p className="text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                      Unreadable or missing: {doc.extraction.unreadableFields.join(", ")}
                    </p>
                  )}
                  {!!doc.extraction.flags?.length && (
                    <p className="text-[#92400E]">Flags: {doc.extraction.flags.join("; ")}</p>
                  )}
                </div>
              )}

              {doc.status === "CONFIRMED" && (
                <div className="flex justify-end">
                  <Link href="/situation" className="px-4 py-2 rounded-xl bg-[#F3F8F5] border border-[#BCE1CA] text-xs font-bold text-[#153D32]">
                    Added to My Situation. View it →
                  </Link>
                </div>
              )}

              {doc.status === "NEEDS_CONFIRMATION" && (
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => persist(documents.filter((d) => d.id !== doc.id))}
                    className="px-4 py-2 rounded-xl border border-[#DDE2D9] text-xs font-bold text-[#153D32]"
                  >
                    Discard
                  </button>
                  <button onClick={() => confirmDoc(doc)} className="px-4 py-2 rounded-xl bg-[#153D32] text-white text-xs font-bold">
                    Confirm and add to My Situation
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center pt-2">
        <Link href="/situation" className="text-xs font-bold text-[#153D32] hover:underline">← My Situation</Link>
        <Link href="/chat" className="text-xs font-bold text-[#153D32] hover:underline">Ask SANAD →</Link>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Doc["status"] }) {
  const map = {
    ANALYZING: { cls: "bg-blue-50 text-blue-800", text: "Analyzing...", icon: <Loader2 className="w-3 h-3 animate-spin" /> },
    NEEDS_CONFIRMATION: { cls: "bg-amber-50 text-amber-800", text: "Needs your confirmation", icon: null },
    CONFIRMED: { cls: "bg-[#EBF7EE] text-[#166534]", text: "Confirmed by you", icon: <CheckCircle2 className="w-3 h-3" /> },
    FAILED: { cls: "bg-red-50 text-red-700", text: "Not extracted", icon: null },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${map.cls}`}>
      {map.icon}
      {map.text}
    </span>
  );
}
