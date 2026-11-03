"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, AlertTriangle, ArrowRight } from "lucide-react";
import { useSituation } from "@/lib/context/SituationContext";

type Reminder = { id: string; title: string; message: string; href: string; label: string };

// Reminders are derived from the user's own data only: nothing here is invented.
export default function NotificationsPage() {
  const { profile } = useSituation();
  const [docs, setDocs] = useState<{ id: string; name: string; status: string; extraction?: { documentType?: string; expiryDate?: string } }[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sanad_documents");
      if (saved) setDocs(JSON.parse(saved));
    } catch {}
  }, []);

  const reminders: Reminder[] = [];
  for (const d of docs) {
    const name = d.extraction?.documentType || d.name;
    if (d.status === "NEEDS_CONFIRMATION") {
      reminders.push({ id: `c-${d.id}`, title: `Review ${name}`, message: "SANAD read this document. Confirm the extracted details before they are used.", href: "/documents", label: "Review document" });
    }
    const exp = d.extraction?.expiryDate ? new Date(d.extraction.expiryDate) : null;
    if (exp && !isNaN(exp.getTime())) {
      const days = Math.ceil((exp.getTime() - Date.now()) / 86400000);
      if (days <= 180) {
        reminders.push({ id: `e-${d.id}`, title: `${name} ${days < 0 ? "has expired" : `expires in ${days} days`}`, message: `Expiry date read from your upload: ${d.extraction!.expiryDate}. Confirm on the original document.`, href: "/documents", label: "View document" });
      }
    }
  }
  const unconfirmed = Object.values(profile?.facts || {}).filter((f) => !f.confirmed).length;
  if (unconfirmed) {
    reminders.push({ id: "facts", title: `${unconfirmed} detail${unconfirmed > 1 ? "s" : ""} need your confirmation`, message: "Check what SANAD understood from your conversation.", href: "/situation", label: "Open My Situation" });
  }
  for (const [i, m] of (profile?.missing_info || []).entries()) {
    reminders.push({ id: `m-${i}`, title: "Missing information", message: m, href: "/chat", label: "Tell SANAD" });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in duration-300">
      <div className="flex items-start gap-3 pb-2 border-b border-[#ECEFEA]">
        <div className="w-10 h-10 rounded-2xl bg-[#EBF5EF] text-[#153D32] flex items-center justify-center shrink-0">
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#153D32] tracking-tight">Notifications</h1>
          <p className="text-xs sm:text-sm text-[#68716D] mt-0.5">Reminders built from your own documents and situation.</p>
        </div>
      </div>

      {reminders.length === 0 ? (
        <p className="text-sm text-[#68716D] text-center py-12">You&apos;re all caught up. No reminders right now.</p>
      ) : (
        <div className="space-y-3">
          {reminders.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl p-5 border border-[#ECEFEA] shadow-sm flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-[#153D32]">{r.title}</p>
                  <p className="text-xs text-[#5C6661] mt-0.5">{r.message}</p>
                </div>
              </div>
              <Link href={r.href} className="inline-flex items-center gap-1 text-xs font-bold text-[#153D32] shrink-0 hover:underline">
                {r.label} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
