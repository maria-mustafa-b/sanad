"use client";

import Link from "next/link";
import { Clock, CheckCircle2, ChevronRight, FileText, ArrowRight } from "lucide-react";

export default function ApplicationTrackingPage() {
  const application = {
    id: "APP-MOHRE-9942",
    service: "Unpaid Wages Complaint Service",
    status: "Under Review",
    date: "2026-09-26",
    timeline: [
      { step: "Application created", completed: true, date: "Sep 26, 09:12 AM" },
      { step: "Documents uploaded", completed: true, date: "Sep 26, 09:15 AM" },
      { step: "Application submitted", completed: true, date: "Sep 26, 09:20 AM" },
      { step: "Under review", completed: false, current: true },
      { step: "Completed", completed: false, current: false }
    ]
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col pb-20 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">My Applications</h1>
          <p className="text-gray-500">Track the status of your formal requests.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: App Details */}
        <div className="p-8 md:p-10 flex-1 border-b md:border-b-0 md:border-r border-gray-100">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider mb-6 bg-amber-50 text-amber-700 uppercase">
            <Clock className="w-3.5 h-3.5" /> {application.status}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{application.service}</h2>
          
          <div className="flex items-center gap-2 mb-8">
            <span className="text-sm text-gray-500">Application ID:</span>
            <span className="font-mono font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded">{application.id}</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-teal-600" />
                <span className="font-bold text-gray-900 text-sm">Attached Documents</span>
              </div>
              <span className="text-sm font-bold text-gray-500">1 File</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                <span className="font-bold text-gray-900 text-sm">SANAD Credential</span>
              </div>
              <span className="text-sm font-bold text-gray-500">Valid</span>
            </div>
          </div>
        </div>

        {/* Right Side: Timeline */}
        <div className="p-8 md:p-10 w-full md:w-80 bg-gray-50/50 shrink-0">
          <h3 className="font-bold text-gray-900 mb-8">Tracking Timeline</h3>
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-3 before:-translate-x-px before:h-full before:w-0.5 before:bg-gray-200">
            {application.timeline.map((item, i) => (
              <div key={i} className="relative flex items-start gap-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 bg-white z-10 ${
                  item.completed ? 'border-emerald-500 text-emerald-500' : 
                  item.current ? 'border-amber-500 border-4 shadow-sm' : 'border-gray-200'
                }`}>
                  {item.completed && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </div>
                <div>
                  <p className={`text-sm font-bold ${
                    item.completed || item.current ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {item.step}
                  </p>
                  {item.date && <p className="text-xs text-gray-500 mt-1">{item.date}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
