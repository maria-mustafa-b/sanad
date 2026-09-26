"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, ArrowRight, Loader2 } from "lucide-react";

export function ServicesPreview() {
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
    <section className="w-full py-24 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Verified Government & Legal Support</h2>
            <p className="text-xl text-gray-600">
              SANAD's ecosystem connects you directly with the exact UAE entities that resolve your specific disputes.
            </p>
          </div>
          <Link href="/services" className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl shrink-0">
            View All Services <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.slice(0, 4).map((service) => (
              <div key={service.id} className="bg-gray-50 p-8 rounded-3xl border border-gray-200 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="inline-block px-3 py-1 bg-gray-200/50 text-gray-700 text-xs font-bold rounded-full mb-4 w-fit">
                  {service.category || "Legal Support"}
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors">
                  {service.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                  {service.description}
                </p>
                <Link href="/services" className="text-sm font-bold text-gray-900 flex items-center gap-1 group-hover:text-emerald-600 transition-colors mt-auto">
                  Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
