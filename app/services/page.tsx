"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Building2, 
  ExternalLink, 
  Loader2, 
  Filter, 
  ArrowRight, 
  ShieldCheck, 
  FileText,
  Clock,
  Sparkles,
  MapPin,
  UserCheck,
  CheckCircle2
} from "lucide-react";
import { Card, Badge, Button } from "@/components/ui/Primitives";
import { useSituation } from "@/lib/context/SituationContext";
import { PageHeader } from "@/components/ui/page-header";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedEmirate, setSelectedEmirate] = useState("ALL");
  const [selectedApplicant, setSelectedApplicant] = useState("ALL");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setServices(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const categories = ["ALL", "Labour", "Residency", "Housing", "Commercial"];
  const emirates = ["ALL", "Federal", "Dubai", "Abu Dhabi", "Sharjah"];
  const applicants = ["ALL", "Citizen", "Resident", "Business"];

  const filtered = services.filter((s) => {
    const matchesSearch = 
      (s.name || s.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
      (s.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCat = selectedCategory === "ALL" || (s.category && s.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    const matchesEmirate = selectedEmirate === "ALL" || (s.emirate && s.emirate.toLowerCase() === selectedEmirate.toLowerCase());
    const matchesApplicant = selectedApplicant === "ALL" || (s.applicant_type && (s.applicant_type === "All" || s.applicant_type.toLowerCase() === selectedApplicant.toLowerCase()));

    return matchesSearch && matchesCat && matchesEmirate && matchesApplicant;
  });

  const { profile } = useSituation();
  const recommended = profile?.services || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in duration-300">
      <PageHeader
        icon={Search}
        title="Government Services"
        subtitle="Official UAE services in SANAD's verified catalogue. Each one links to its government source."
      />

      {/* Recommended for You: from the user's conversation with SANAD */}
      {recommended.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-black text-base text-[#153D32]">Recommended for you</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {recommended.map((s) => (
              <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="block p-5 rounded-3xl bg-[#F3F8F5] border border-[#BCE1CA] hover:border-[#153D32] text-xs shadow-sm">
                <span className="font-mono text-[#467060] mr-2">{s.id}</span>
                <span className="font-bold text-[#153D32]">{s.title}</span>
                {s.why && <span className="block text-[#3A4540] mt-1">Why: {s.why}</span>}
                <span className="block text-[#68716D] mt-1">Official source: {s.url}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#84928B]" />
          <input 
            type="text" 
            placeholder="Search by keyword, authority, or life event (e.g. 'golden visa', 'ejari', 'unpaid salary')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E4E7E1] rounded-2xl py-3.5 pl-11 pr-4 text-sm text-[#15241E] outline-none focus:border-[#153D32] focus:ring-1 focus:ring-[#153D32] shadow-xs transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-3xl border border-[#ECEFEA] shadow-sm">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#586660]">Category:</span>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#153D32] text-white"
                      : "bg-[#F7F7F2] text-[#586660] hover:bg-[#E4E7E1]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="h-4 w-px bg-[#E4E7E1] hidden sm:block"></div>

          {/* Emirate Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#586660]">Jurisdiction:</span>
            <div className="flex flex-wrap gap-1.5">
              {emirates.map((em) => (
                <button
                  key={em}
                  onClick={() => setSelectedEmirate(em)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    selectedEmirate === em
                      ? "bg-[#153D32] text-white"
                      : "bg-[#F7F7F2] text-[#586660] hover:bg-[#E4E7E1]"
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#586660]">
          <Loader2 className="w-8 h-8 animate-spin text-[#153D32] mb-3" />
          <p className="text-sm">Matching verified services...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((svc) => (
            <Card key={svc.id || svc.name} className="flex flex-col justify-between rounded-3xl border-[#ECEFEA] shadow-sm hover:border-[#153D32] transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="info">
                    {svc.category || "Federal Service"}
                  </Badge>
                  <span className="text-[11px] font-semibold text-[#586660] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#84928B]" />
                    {svc.emirate || "UAE Unified"}
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#15241E] leading-snug line-clamp-2">
                  {svc.name || svc.title}
                </h3>

                <p className="text-xs text-[#586660] line-clamp-3 leading-relaxed">
                  {svc.description}
                </p>

                {/* Eligibility Check Pill */}
                {svc.eligibility && (
                  <div className="p-2.5 rounded-[8px] bg-[#F3F8F5] border border-[#DDEBE3] text-[11px] text-[#153D32] flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#166534] mt-0.5" />
                    <span>{svc.eligibility}</span>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-[#ECEEEA] space-y-3">
                <p className="flex items-center gap-1 text-[11px] text-[#586660]">
                  <Clock className="w-3.5 h-3.5 text-[#84928B]" />
                  Fees and processing times: confirm on the official source.
                </p>

                <div className="flex items-center gap-2">
                  <Link href={`/services/${svc.id || 'mohre-complaint'}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Service Details
                    </Button>
                  </Link>
                  <a href={svc.official_url || svc.url || "#"} target="_blank" rel="noreferrer" className="flex-1">
                    <Button variant="primary" size="sm" className="w-full gap-1">
                      Official portal
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
}
