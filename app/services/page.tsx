"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, Building2, ExternalLink, Loader2 } from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const json = await res.json();
        if (json.data) setServices(json.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 pt-24 pb-12">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Support Services</h1>
        <p className="text-gray-600 text-lg">
          Discover verified government and legal support services matched to your situation.
        </p>
      </div>

      <div className="relative mb-10 max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search for a service..."
          className="w-full bg-white border border-gray-300 shadow-sm rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500 transition"
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        </div>
      ) : services.length === 0 ? (
        <div className="text-center p-20 bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-500">No services found in the database yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition group">
              <div className="flex justify-between items-start mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                  <Building2 className="w-3.5 h-3.5" />
                  {service.category || "General"}
                </div>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                {service.name}
              </h3>
              <p className="text-gray-600 mb-6 line-clamp-3">
                {service.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto">
                {service.official_url ? (
                  <a href={service.official_url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    Official Portal <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <button className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                    Check Eligibility
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
