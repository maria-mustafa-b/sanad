"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ShieldCheck, Download, QrCode, ArrowRight, CheckCircle2, Clock, XCircle } from "lucide-react";

export default function CredentialsPage() {
  const [activeTab, setActiveTab] = useState('ALL');

  const credentials = [
    {
      id: "SANAD-VC-00124",
      situation: "Employment Situation: Unpaid Wages",
      issueDate: "2026-09-26",
      issuer: "SANAD",
      blockchain: "Polygon Amoy",
      status: "Valid"
    }
  ];

  const filtered = activeTab === 'ALL' 
    ? credentials 
    : credentials.filter(c => c.status.toUpperCase() === activeTab);

  return (
    <div className="w-full flex flex-col animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">My Credentials</h1>
          <p className="text-gray-500">Manage your cryptographic proofs and verifiable claims.</p>
        </div>
        <Link href="/chat" className="flex items-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-xl font-bold hover:bg-teal-800 transition shadow-lg shadow-teal-700/20 shrink-0">
          <Plus className="w-5 h-5" /> Create New
        </Link>
      </div>

      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit mb-8 overflow-x-auto">
        {['All', 'Valid', 'Revoked', 'Expired'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab.toUpperCase())}
            className={`px-6 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.toUpperCase() 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-20 flex flex-col items-center justify-center text-center shadow-sm">
          <ShieldCheck className="w-16 h-16 text-gray-200 mb-4" />
          <p className="text-xl font-bold text-gray-900 mb-2">No credentials found</p>
          <p className="text-gray-500 max-w-sm">You haven't issued any credentials in this category yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((cred) => (
            <div key={cred.id} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_4px_25px_rgb(0,0,0,0.06)] transition-all duration-300 flex flex-col">
              
              <div className="flex justify-between items-start mb-8 gap-4 border-b border-gray-100 pb-6">
                <div>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider mb-4 ${
                    cred.status === 'Valid' ? 'bg-emerald-50 text-emerald-700' : 
                    cred.status === 'Revoked' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {cred.status === 'Valid' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {cred.status === 'Revoked' && <XCircle className="w-3.5 h-3.5" />}
                    {cred.status === 'Expired' && <Clock className="w-3.5 h-3.5" />}
                    {cred.status.toUpperCase()}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 leading-snug">{cred.situation}</h3>
                </div>
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100">
                  <ShieldCheck className="w-6 h-6 text-teal-600" />
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Credential ID</span>
                  <span className="font-bold text-gray-900 font-mono bg-gray-50 px-2 py-0.5 rounded">{cred.id}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Issue Date</span>
                  <span className="font-semibold text-gray-900">{cred.issueDate}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Issuer</span>
                  <span className="font-semibold text-gray-900">{cred.issuer}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Blockchain</span>
                  <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div> {cred.blockchain}
                  </span>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-100 flex items-center justify-between mt-auto gap-4">
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors tooltip-trigger" title="Download JSON">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors" title="Show QR">
                    <QrCode className="w-5 h-5" />
                  </button>
                </div>
                
                <Link href={`/credentials/${cred.id}`} className="text-teal-700 font-bold flex items-center gap-1.5 hover:text-teal-800 transition-colors group">
                  View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
