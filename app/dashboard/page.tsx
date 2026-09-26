"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderOpen, FileText, CheckCircle2, Clock, Loader2, RefreshCw } from "lucide-react";

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

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 pt-24 pb-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Track your claims, credentials, and applications.</p>
        </div>
        <button onClick={fetchDashboard} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">Active Claims</div>
            <div className="text-3xl font-black text-gray-900">{loading ? '-' : claims.length}</div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">Credentials</div>
            <div className="text-3xl font-black text-gray-900">0</div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">Applications</div>
            <div className="text-3xl font-black text-gray-900">0</div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Claims</h2>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : claims.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden text-center py-16 px-4">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No active claims</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-8">
            You haven't reported any workplace situations yet. Get started by talking to SANAD.
          </p>
          <Link href="/chat" className="inline-flex items-center justify-center px-6 py-3 bg-emerald-700 text-white rounded-xl font-semibold hover:bg-emerald-800 transition shadow-sm">
            Start a New Claim
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {claims.map((claim) => (
            <div key={claim.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                  {claim.status}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(claim.created_at).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                {claim.structured_data?.category || "Reported Situation"}
              </h3>
              <p className="text-gray-600 line-clamp-2">
                {claim.structured_data?.summary || claim.original_statement}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
