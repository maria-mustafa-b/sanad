import Link from "next/link";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "Which languages can I use?",
    a: "Arabic, English, Hindi, Urdu, Malayalam, Bengali and mixed languages like Hinglish. SANAD detects your language automatically and replies in it.",
  },
  {
    q: "Is SANAD a government service?",
    a: "No. SANAD is a prototype guidance assistant. It points you to official UAE government services and links, but it does not make official decisions or submit applications for you.",
  },
  {
    q: "Where do service recommendations come from?",
    a: "Only from SANAD's catalogue of official UAE government service pages. Always confirm fees, salary thresholds and processing times on the official link.",
  },
  {
    q: "What happens to documents I upload?",
    a: "With your consent, the file is sent to SANAD's AI provider to read it. You review the extracted details and nothing is used until you confirm it. The document list is kept in your browser.",
  },
  {
    q: "What are SANAD credentials?",
    a: "Prototype credentials anchored on the Polygon Amoy testnet. They prove a record existed and was not changed. They are not government-issued documents.",
  },
];

export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-start gap-3 pb-2 border-b border-[#ECEFEA]">
        <div className="w-10 h-10 rounded-2xl bg-[#EBF5EF] text-[#153D32] flex items-center justify-center shrink-0">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#153D32] tracking-tight">Help &amp; Support</h1>
          <p className="text-xs sm:text-sm text-[#68716D] mt-0.5">Answers to common questions about using SANAD.</p>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="bg-white rounded-2xl p-5 border border-[#ECEFEA] shadow-sm">
            <summary className="font-bold text-sm text-[#153D32] cursor-pointer">{f.q}</summary>
            <p className="text-xs sm:text-sm text-[#5C6661] mt-2 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 border border-[#ECEFEA] shadow-sm text-xs sm:text-sm text-[#3A4540] space-y-2">
        <p className="font-bold text-[#153D32]">Still need help?</p>
        <p>
          Ask the assistant in <Link href="/chat" className="font-bold text-[#153D32] underline">Ask SANAD</Link>, or report an issue on the
          project&apos;s{" "}
          <a href="https://github.com/maria-mustafa-b/sanad/issues" target="_blank" rel="noreferrer" className="font-bold text-[#153D32] underline">
            GitHub issue tracker
          </a>
          .
        </p>
      </div>
    </div>
  );
}
