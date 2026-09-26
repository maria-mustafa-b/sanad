"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FileText, CheckCircle2, Clock, Loader2, Bell, AlertTriangle, 
  ArrowRight, ShieldCheck, CheckCircle
} from "lucide-react";

export default function DashboardPage() {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/claims');
      const json = await res.json();
      if (json.data) setClaims(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const activeClaim = claims[0] || null;

  const journeySteps = [
    { name: "Understand Situation", status: "Completed" },
    { name: "Find Services", status: "Completed" },
    { name: "Prepare Documents", status: "In Progress" },
    { name: "Submit Application", status: "Pending" },
    { name: "Track Status", status: "Pending" },
  ];

  return (
    <div className="w-full flex flex-col space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Your Dashboard</h1>
        <p className="text-gray-500">Here's an overview of your journey with SANAD.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3 text-gray-500 font-semibold text-sm">
            <FileText className="w-4 h-4" /> Current Situation
          </div>
          <div className="font-bold text-gray-900 line-clamp-1">
            {activeClaim ? (activeClaim.structured_data?.category || "Employment issue") : "None active"}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3 text-gray-500 font-semibold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Credentials
          </div>
          <div className="font-bold text-emerald-700">1 Valid</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3 text-gray-500 font-semibold text-sm">
            <Clock className="w-4 h-4 text-amber-500" /> Applications
          </div>
          <div className="font-bold text-amber-700">1 Under Review</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3 text-gray-500 font-semibold text-sm">
            <Bell className="w-4 h-4 text-blue-500" /> Notifications
          </div>
          <div className="font-bold text-blue-700">2 New Updates</div>
        </div>
      </div>

      {/* Journey Stepper */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Your Journey Progress</h2>
        <div className="relative flex justify-between items-center w-full">
          {/* Connecting Line */}
          <div className="absolute top-4 left-0 right-0 h-[2px] bg-gray-100 -z-10" />
          
          {journeySteps.map((step, index) => {
            const isCompleted = step.status === "Completed";
            const isInProgress = step.status === "In Progress";
            
            return (
              <div key={index} className="flex flex-col items-center gap-3 w-1/5 bg-white">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 
                  isInProgress ? 'bg-white border-teal-600 text-teal-600' : 
                  'bg-white border-gray-200 text-gray-300'
                }`}>
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
                </div>
                <div className="text-center">
                  <p className={`text-xs md:text-sm font-bold ${isInProgress ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step.name}
                  </p>
                  <p className={`text-[10px] md:text-xs font-semibold uppercase tracking-wider ${
                    isCompleted ? 'text-emerald-600' : 
                    isInProgress ? 'text-amber-500' : 'text-gray-400'
                  }`}>
                    {step.status}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended Services */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recommended Services</h2>
          <Link href="/services" className="text-sm font-bold text-teal-700 hover:text-teal-800">
            View all
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: "Unpaid Wages Complaint", relevance: "High Relevance", color: "emerald" },
            { title: "Employment Support Assistance", relevance: "High Relevance", color: "emerald" },
            { title: "Financial Assistance Program", relevance: "Medium Relevance", color: "amber" }
          ].map((svc, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:border-teal-200 transition-colors group flex flex-col justify-between">
              <div>
                <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-3 ${
                  svc.color === 'emerald' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {svc.relevance}
                </span>
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-teal-700 transition-colors">{svc.title}</h3>
              </div>
              <div className="mt-4 flex items-center text-sm font-bold text-gray-400 group-hover:text-teal-600 transition-colors">
                View Details <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
