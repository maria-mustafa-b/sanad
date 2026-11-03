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
        } else {
          // Comprehensive UAE Government catalog fallback matching the challenge brief
          setServices([
            {
              id: "mohre-complaint",
              name: "Private-Sector Labour Complaint & Dispute Resolution",
              category: "Labour",
              emirate: "Federal",
              applicant_type: "Resident",
              description: "Register formal wage disputes, unpaid gratuity, or arbitrary termination claims through the Ministry of Human Resources and Emiratisation.",
              sla: "2 business days",
              fee: "Free of charge",
              eligibility: "Active or cancelled MOHRE private sector labour contract within 1 year.",
              official_url: "https://mohre.gov.ae"
            },
            {
              id: "golden-visa-investor",
              name: "UAE Golden Visa Nomination (Real Estate & Investors)",
              category: "Residency",
              emirate: "Federal",
              applicant_type: "Resident",
              description: "Long-term 10-year residency visa for real estate investors with property equity of AED 2,000,000 or more without sponsor requirements.",
              sla: "3 business days",
              fee: "AED 2,850",
              eligibility: "Title deed with minimum AED 2M valuation + health insurance.",
              official_url: "https://icp.gov.ae"
            },
            {
              id: "ejari-registration",
              name: "Ejari Tenancy Contract Registration & Attestation",
              category: "Housing",
              emirate: "Dubai",
              applicant_type: "All",
              description: "Mandatory official authentication of residential and commercial lease contracts under Dubai Land Department (DLD) regulations.",
              sla: "Instant (Digital)",
              fee: "AED 175 + VAT",
              eligibility: "Valid tenancy contract signed by tenant & landlord, DEWA premise number, Emirates ID.",
              official_url: "https://dubailand.gov.ae"
            },
            {
              id: "family-sponsorship",
              name: "Family & Dependent Residency Visa Issuance",
              category: "Residency",
              emirate: "Federal",
              applicant_type: "Resident",
              description: "Sponsor spouse, children, or dependent parents for UAE residency under GDRFA or ICP unified channels.",
              sla: "48 hours",
              fee: "AED 1,150",
              eligibility: "Valid UAE residence visa, monthly salary of AED 4,000 or AED 3,000 plus accommodation, attested tenancy contract.",
              official_url: "https://gdrfad.gov.ae"
            },
            {
              id: "instant-trade-license",
              name: "Instant Commercial Trade License (DED)",
              category: "Commercial",
              emirate: "Dubai",
              applicant_type: "Business",
              description: "Establish a mainland LLC or sole establishment in one single step without initial lease or MOA requirements for year one.",
              sla: "10 minutes",
              fee: "AED 12,500 (approx)",
              eligibility: "UAE National or resident with valid Emirates ID; applicable activities only.",
              official_url: "https://ded.ae"
            },
            {
              id: "unemployment-insurance",
              name: "Involuntary Loss of Employment (ILOE) Claim",
              category: "Labour",
              emirate: "Federal",
              applicant_type: "Resident",
              description: "Submit monthly compensation claim for private and federal government workers who lost their jobs due to non-disciplinary reasons.",
              sla: "2 weeks",
              fee: "Included in policy",
              eligibility: "Subscribed to ILOE for at least 12 consecutive months; non-disciplinary job loss.",
              official_url: "https://iloe.ae"
            }
          ]);
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
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="border-b border-[#E4E7E1] pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#84928B]">
            UAE Unified Service Catalog
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#166534]"></span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#15241E] tracking-tight">
          Government Service Discovery
        </h1>
        <p className="text-sm text-[#586660]">
          Search, evaluate eligibility, and launch guided applications across federal ministries and local departments.
        </p>
      </div>

      {/* Recommended for You: from the user's conversation with SANAD */}
      {recommended.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-[#153D32]">Recommended for you</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {recommended.map((s) => (
              <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="block p-4 rounded-2xl bg-white border border-[#BCE1CA] hover:border-[#153D32] text-xs">
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
            className="w-full bg-white border border-[#E4E7E1] rounded-[10px] py-3.5 pl-11 pr-4 text-sm text-[#15241E] outline-none focus:border-[#153D32] focus:ring-1 focus:ring-[#153D32] shadow-xs transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-[12px] border border-[#E4E7E1]">
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
            <Card key={svc.id || svc.name} className="flex flex-col justify-between hover:border-[#153D32] transition-colors">
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
                <div className="flex items-center justify-between text-xs text-[#586660]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#84928B]" />
                    {svc.sla || "2-3 days"}
                  </span>
                  <span className="font-semibold text-[#15241E]">
                    {svc.fee || "Free"}
                  </span>
                </div>

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
