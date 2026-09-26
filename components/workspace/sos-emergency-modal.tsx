"use client";
import { useState } from "react";
import { AlertTriangle, Phone, Home, Flag, X } from "lucide-react";

export function SosEmergencyModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
        aria-label="High Urgency Emergency Protocol"
      >
        <AlertTriangle size={15} />
        <span>SOS Emergency</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-red-200 space-y-6 relative text-slate-900">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <X size={22} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle size={28} />
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                  High Urgency Protocol
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  Immediate Emergency Assistance
                </h2>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              If you are facing immediate danger, wage theft distress, eviction risk, or require urgent consular intervention, access 24/7 priority support below.
            </p>

            <div className="space-y-3 pt-2">
              <a
                href="tel:80072623"
                className="w-full py-4 px-6 rounded-xl bg-red-600 text-white font-bold text-base flex items-center justify-center gap-3 shadow-md hover:bg-red-700 active:scale-98 transition-all no-underline"
              >
                <Phone size={22} />
                <span>Call 24/7 Crisis Helpline (800-SANAD)</span>
              </a>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Home className="text-blue-600 shrink-0" size={24} />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">Safe Crisis Accommodation</span>
                    <span className="text-slate-500">Confidential locations with 24/7 security &amp; emergency support</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-600 shrink-0">Open 24/7</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Flag className="text-amber-600 shrink-0" size={24} />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">Consular Emergency Outreach</span>
                    <span className="text-slate-500">Emergency outpass &amp; diplomatic liaison</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-600 shrink-0">Active</span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline cursor-pointer"
              >
                Close Protocol Window
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
