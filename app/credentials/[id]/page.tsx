"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, QrCode, Download, ExternalLink, FileText, History, FileCheck } from "lucide-react";
import { useParams } from "next/navigation";

export default function CredentialDetailsPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("CLAIM");

  const credential = {
    id: params.id || "SANAD-VC-00124",
    situation: "Employment Situation: Unpaid Wages",
    issueDate: "2026-09-26",
    issuer: "SANAD",
    blockchain: "Polygon Amoy",
    status: "Valid",
    txHash: "0x8f2a...4b9c",
    claimData: {
      category: "Employment issue",
      status: "Lost job",
      issue: "Unpaid wages",
      period: "August 2026",
      employer: "Not specified"
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col pb-20 animate-in fade-in duration-500">
      
      <Link href="/credentials" className="inline-flex items-center text-gray-500 hover:text-gray-900 font-semibold mb-8 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Wallet
      </Link>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        
        {/* Header Section */}
        <div className="p-8 md:p-10 border-b border-gray-100 flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider mb-4 bg-emerald-50 text-emerald-700 uppercase">
              <CheckCircle2 className="w-3.5 h-3.5" /> {credential.status}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">{credential.situation}</h1>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Credential ID</p>
                <p className="font-mono text-sm font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded w-fit">{credential.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Issue Date</p>
                <p className="font-bold text-gray-900">{credential.issueDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Issuer</p>
                <p className="font-bold text-gray-900 flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-teal-600"/> {credential.issuer}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Blockchain</p>
                <p className="font-bold text-gray-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span> {credential.blockchain}
                </p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Transaction</p>
                <a href={`https://amoy.polygonscan.com/tx/${credential.txHash}`} target="_blank" className="font-mono text-sm font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1 w-fit">
                  {credential.txHash} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center bg-gray-50 p-6 rounded-2xl border border-gray-100 shrink-0">
            <div className="w-40 h-40 bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-4 flex items-center justify-center">
              <QrCode className="w-full h-full text-gray-900 opacity-80" />
            </div>
            <p className="font-bold text-sm text-gray-900">Scan to Verify</p>
            <div className="flex gap-2 mt-4 w-full">
              <button className="flex-1 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1.5 transition-colors">
                <Download className="w-4 h-4" /> JSON
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div>
          <div className="flex border-b border-gray-100 px-8">
            {[
              { id: 'CLAIM', label: 'Claim Information', icon: FileCheck },
              { id: 'HISTORY', label: 'Verification History', icon: History },
              { id: 'DOCS', label: 'Documents', icon: FileText }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors border-b-2 ${
                  activeTab === tab.id ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8 md:p-10 bg-gray-50/50 min-h-[300px]">
            {activeTab === 'CLAIM' && (
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
                {Object.entries(credential.claimData).map(([key, value], i) => (
                  <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{key.replace('_', ' ')}</p>
                    <p className="font-bold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'HISTORY' && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center text-gray-500">
                <History className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No verifications recorded yet.</p>
                <p className="text-sm mt-1">When this credential is verified by an entity, it will appear here.</p>
              </div>
            )}

            {activeTab === 'DOCS' && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Employment Contract</p>
                    <p className="text-xs text-gray-500">Hash: 0x9a8b...2c1d</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified OCR
                </span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
