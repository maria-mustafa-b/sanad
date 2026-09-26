"use client";

import { useState } from "react";
import { Search, CheckCircle, XCircle, Shield, Loader2 } from "lucide-react";

export default function VerifyPage() {
  const [hash, setHash] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hash.trim()) return;
    
    setIsVerifying(true);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hash })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ valid: false, error: "Network error" });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto px-4 pt-24 pb-12 flex flex-col items-center">
      <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
        <Shield className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Public Verification Portal</h1>
      <p className="text-gray-600 text-center mb-10 max-w-lg">
        Enter a cryptographic hash to instantly verify the authenticity of a SANAD claim credential on the Polygon blockchain.
      </p>

      <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
        <form onSubmit={handleVerify} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder="0x..."
              className="w-full bg-gray-50 border border-gray-300 rounded-xl py-4 pl-12 pr-4 font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <button 
            type="submit"
            disabled={isVerifying || !hash.trim()}
            className="px-8 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center min-w-[140px]"
          >
            {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify"}
          </button>
        </form>
      </div>

      {result && (
        <div className={`w-full p-6 rounded-2xl border ${result.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} transition-all duration-300 animate-in fade-in slide-in-from-bottom-4`}>
          <div className="flex items-start gap-4">
            {result.valid ? (
              <CheckCircle className="w-8 h-8 text-green-600 shrink-0 mt-1" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600 shrink-0 mt-1" />
            )}
            <div>
              <h2 className={`text-xl font-bold mb-2 ${result.valid ? 'text-green-900' : 'text-red-900'}`}>
                {result.valid ? "Credential is Valid" : "Verification Failed"}
              </h2>
              {result.valid ? (
                <div className="space-y-3 mt-4 text-sm">
                  <div className="flex justify-between border-b border-green-200 pb-2">
                    <span className="text-green-800/70 font-medium">Issuer</span>
                    <span className="font-mono font-semibold text-green-900 truncate max-w-[200px]">{result.issuer || "0x13798285e9fa1aCd15930e8D510A34BB983F1484"}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-200 pb-2">
                    <span className="text-green-800/70 font-medium">Timestamp</span>
                    <span className="font-semibold text-green-900">{result.timestamp ? new Date(result.timestamp).toLocaleString() : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-green-800/70 font-medium">Blockchain</span>
                    <span className="font-semibold text-green-900 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      Polygon Amoy
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-red-700">This hash does not exist on the blockchain or has been revoked.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
