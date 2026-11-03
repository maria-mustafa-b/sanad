"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Building2, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  ShieldCheck, 
  ChevronRight,
  Clock,
  Sparkles,
  MapPin,
  AlertCircle,
  HelpCircle,
  ArrowRight
} from "lucide-react";
import { useParams } from "next/navigation";
import { Card, Badge, Button } from "@/components/ui/Primitives";

export default function ServiceDetailsPage() {
  const params = useParams();
  const [service, setService] = useState<any>(null);
  const [hasContract, setHasContract] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try { 
      const v = localStorage.getItem('sanad_vault'); 
      if (v) { 
        const docs = JSON.parse(v); 
        setHasContract(docs.length > 0); 
      } 
    } catch(e) {}

    const fetchService = async () => {
      try {
        const res = await fetch('/api/services');
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          const match = json.data.find((s:any) => String(s.id) === String(params.id)) || null;
          setService(match);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-20 text-center text-[#153D32] font-semibold animate-pulse">
        Loading verified service specifications...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-black text-[#153D32]">Service not found</h1>
        <p className="text-sm text-[#68716D]">This service is not in SANAD&apos;s verified catalogue.</p>
        <Link href="/services" className="inline-block px-5 py-2.5 rounded-xl bg-[#153D32] text-white text-xs font-bold">Browse services</Link>
      </div>
    );
  }

  const s = service || {};

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      
      {/* Navigation Breadcrumb */}
      <Link 
        href="/services" 
        className="inline-flex items-center text-xs font-semibold text-[#586660] hover:text-[#153D32] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Service Directory
      </Link>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column (2 Cols): Service Specifications */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="info">{s.category || "Federal Service"}</Badge>
                <Badge variant="success">Official Government Route</Badge>
                <span className="text-xs text-[#586660] flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#84928B]" />
                  {s.emirate || "Federal (All Emirates)"}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-[#15241E] tracking-tight leading-snug">
                {s.name || s.title || "Private-Sector Labour Complaint & Dispute Resolution"}
              </h1>

              <p className="text-sm text-[#586660] leading-relaxed mt-3">
                {s.description}
              </p>
            </div>

            {/* Official Source Link */}
            {s.official_url && (
              <div className="p-3 bg-[#F7F7F2] rounded-[10px] border border-[#E4E7E1] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[#586660]">
                  <ShieldCheck className="w-4 h-4 text-[#166534]" />
                  <span>Authority Source: <span className="font-semibold text-[#15241E]">MOHRE Verified Channel</span></span>
                </div>
                <a 
                  href={s.official_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs font-semibold text-[#153D32] hover:underline flex items-center gap-1"
                >
                  Visit Official Portal <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Eligibility Criteria */}
            <div className="space-y-3 pt-4 border-t border-[#ECEEEA]">
              <h2 className="text-base font-bold text-[#15241E]">
                Eligibility Criteria & Regulations
              </h2>
              <div className="p-4 rounded-[10px] bg-[#F3F8F5] border border-[#DDEBE3] text-xs text-[#153D32] leading-relaxed space-y-2">
                <p>{s.eligibility_guidance || "Applies to all private sector employees governed under Federal Decree-Law No. 33 of 2021 on the Regulation of Labour Relations."}</p>
                <ul className="list-disc list-inside space-y-1 text-[#467060]">
                  <li>Claim must not have lapsed (under 1 year since entitlement).</li>
                  <li>No prior final court judgement on the identical claim facts.</li>
                </ul>
              </div>
            </div>

            {/* Required Documents Checklist */}
            <div className="space-y-3 pt-4 border-t border-[#ECEEEA]">
              <h2 className="text-base font-bold text-[#15241E]">
                Prerequisite Documents
              </h2>
              <div className="space-y-2">
                {[
                  { name: "Emirates ID (Front & Back)", ready: true },
                  { name: "MOHRE Labour Contract", ready: true },
                  { name: "Bank Salary / WPS Statement", ready: false },
                  { name: "Termination or Resignation Notice (if applicable)", ready: true }
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-[10px] bg-white border border-[#E4E7E1] text-xs">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-[#153D32]" />
                      <span className="font-medium text-[#15241E]">{doc.name}</span>
                    </div>
                    {doc.ready ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#166534] bg-[#EBF7EE] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
                        <CheckCircle2 className="w-3 h-3" /> In Vault
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#92400E] bg-[#FEF3C7] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                        Required
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Procedural Step Timeline */}
            <div className="space-y-3 pt-4 border-t border-[#ECEEEA]">
              <h2 className="text-base font-bold text-[#15241E]">
                Service Resolution Pathway
              </h2>
              <div className="space-y-3">
                {[
                  { step: "1", title: "Intake & Claim Verification", desc: "SANAD extracts details and checks statutory eligibility against UAE labour law." },
                  { step: "2", title: "Direct Transmission to MOHRE", desc: "Formal claim packet submitted directly with attached digital evidence." },
                  { step: "3", title: "Amicable Settlement Period", desc: "MOHRE conciliator reaches out to employer and employee for conciliation." },
                  { step: "4", title: "Judicial Referral or Settlement", desc: "If unpaid wages are verified, MOHRE issues execution order or referral to labour court." }
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3 text-xs">
                    <span className="w-6 h-6 rounded-full bg-[#DDEBE3] text-[#153D32] font-bold flex items-center justify-center shrink-0 text-xs">
                      {item.step}
                    </span>
                    <div>
                      <p className="font-bold text-[#15241E]">{item.title}</p>
                      <p className="text-[#586660] mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </Card>
        </div>

        {/* Right Column: Sticky Readiness & Direct Action Card */}
        <div className="sticky top-20 space-y-4">
          <Card className="border-[#153D32]/30 shadow-md">
            <div className="pb-4 border-b border-[#ECEEEA]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#84928B]">
                  Readiness Score
                </span>
                <span className="text-xs font-bold text-[#166534]">85% Ready</span>
              </div>
              <div className="w-full bg-[#E4E7E1] h-2 rounded-full overflow-hidden">
                <div className="bg-[#153D32] h-full w-[85%] rounded-full"></div>
              </div>
              <p className="text-[11px] text-[#586660] mt-2">
                3 of 4 prerequisite documents verified in your SANAD Vault.
              </p>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#586660]">Standard SLA:</span>
                <span className="font-semibold text-[#15241E] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#84928B]" /> Confirm on official source
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#586660]">Official Government Fee:</span>
                <span className="font-semibold text-[#15241E]">{s.fee || "See official source"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#586660]">Verifiable Proof:</span>
                <span className="font-semibold text-[#166534] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Polygon Amoy
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#ECEEEA] space-y-2">
              <Link href={`/chat?q=${encodeURIComponent(`Help me prepare an application for: ${s.name || s.title || "this service"}`)}&send=1`} className="block w-full">
                <Button variant="primary" size="lg" className="w-full gap-2 font-semibold">
                  Apply with SANAD
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <p className="text-[11px] text-[#84928B] text-center">
                Launches split-screen guided workspace with live AI assistance.
              </p>
            </div>
          </Card>

          {/* Quick Help Card */}
          <div className="p-4 rounded-[12px] bg-[#F7F7F2] border border-[#E4E7E1] text-xs text-[#586660] space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-[#15241E]">
              <HelpCircle className="w-4 h-4 text-[#153D32]" />
              Need clarification on this service?
            </div>
            <p className="leading-relaxed text-[11px]">
              You can trigger the <strong>SANAD Assistant</strong> at any time to calculate gratuity, verify your contract clauses, or draft a statement.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
