"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, CheckCircle2, FileText, ExternalLink, Info, ShieldCheck, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";

export default function ServiceDetailsPage() {
  const params = useParams();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real scenario, fetch specific service. 
    // Here we fetch all and find, or just mock it for the UI design.
    const fetchService = async () => {
      try {
        const res = await fetch('/api/services');
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          // just pick the first one or match ID
          const match = json.data.find((s:any) => s.id === params.id) || json.data[0];
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
    return <div className="p-20 text-center text-teal-600 font-bold animate-pulse">Loading service details...</div>;
  }

  if (!service) {
    return <div className="p-20 text-center text-gray-500">Service not found.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col pb-20 animate-in fade-in duration-500">
      
      <Link href="/services" className="inline-flex items-center text-gray-500 hover:text-gray-900 font-semibold mb-8 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
      </Link>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        
        {/* Header */}
        <div className="p-8 md:p-10 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-lg">
              High Relevance
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Verified Source
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">{service.name}</h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
            {service.description}
          </p>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          
          <div className="md:col-span-2 p-8 md:p-10 space-y-10">
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-teal-600" /> Overview
              </h2>
              <div className="prose text-gray-600 leading-relaxed">
                <p>This service is officially provided by the UAE Government to resolve disputes concerning {service.name.toLowerCase()}. By initiating this process through SANAD, your cryptographic evidence will be attached securely to your formal request.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-600" /> Eligibility
              </h2>
              <ul className="space-y-3">
                {["Private sector employee", "Valid Emirates ID", "Active or recently cancelled visa", "Dispute occurred within the last 12 months"].map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" /> Documents
              </h2>
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Employment Contract</p>
                      <p className="text-xs text-gray-500">Required</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> In Vault
                  </span>
                </div>
                <div className="flex items-center justify-between opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Salary Slip</p>
                      <p className="text-xs text-gray-500">Optional</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-400">Missing</span>
                </div>
              </div>
            </section>

          </div>

          <div className="p-8 md:p-10 bg-gray-50 flex flex-col justify-between">
            
            <div>
              <h3 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">How to Apply</h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-3.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                {[
                  { title: "Review", desc: "Check requirements" },
                  { title: "Attach Credential", desc: "SANAD auto-fills" },
                  { title: "Submit", desc: "Send to authority" }
                ].map((step, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white bg-gray-200 text-gray-500 font-bold text-xs shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      {i + 1}
                    </div>
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                      <h4 className="font-bold text-gray-900 text-sm">{step.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 space-y-4">
              <button className="w-full py-4 bg-teal-700 text-white rounded-2xl font-bold text-lg hover:bg-teal-800 transition shadow-lg shadow-teal-700/20 flex items-center justify-center gap-2">
                Start Application <ChevronRight className="w-5 h-5" />
              </button>
              {service.official_url && (
                <a 
                  href={service.official_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  Official Portal <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
