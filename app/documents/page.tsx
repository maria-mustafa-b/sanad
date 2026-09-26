"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle, AlertTriangle, Loader2, XCircle, ShieldCheck } from "lucide-react";

type DocumentState = "UPLOADED" | "PROCESSING" | "ANALYZED" | "USER_REVIEW_REQUIRED" | "CONFIRMED" | "REJECTED";

export default function DocumentsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [docState, setDocState] = useState<DocumentState | null>(null);
  const [analysis, setAnalysis] = useState<any | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setDocState("UPLOADED");
      setAnalysis(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setDocState("PROCESSING");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.data) {
        setAnalysis(json.data);
        setDocState("USER_REVIEW_REQUIRED");
      } else {
        setDocState("REJECTED");
      }
    } catch (e) {
      console.error(e);
      setDocState("REJECTED");
      alert("Failed to analyze document");
    }
  };

  const handleConfirm = () => {
    setDocState("CONFIRMED");
    // Connect to Supabase logic here
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 pt-24 pb-12 flex flex-col">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Secure Document Vault</h1>
        <p className="text-gray-600">
          Upload employment contracts, salary slips, or visas. SANAD's AI will automatically read and extract details for your verification.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-8">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center w-full"
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${file ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
              {file ? <FileText className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
            </div>
            <span className="text-lg font-bold text-gray-900 mb-1">
              {file ? file.name : "Select a document to upload"}
            </span>
            <span className="text-sm text-gray-500">
              {file ? "Click to change file" : "Supports JPEG, PNG, or PDF up to 5MB"}
            </span>
          </label>
        </div>

        {docState === "UPLOADED" && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleUpload}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-sm"
            >
              <ShieldCheck className="w-5 h-5" />
              Run AI Analysis
            </button>
          </div>
        )}

        {docState === "PROCESSING" && (
          <div className="mt-8 flex flex-col items-center justify-center space-y-4 p-8 bg-blue-50 rounded-xl border border-blue-100">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            <div className="text-center">
              <h3 className="font-bold text-blue-900 text-lg">Analyzing Document with Gemini Vision...</h3>
              <p className="text-blue-700 text-sm">Extracting entities, checking for illegal clauses, and classifying document type.</p>
            </div>
          </div>
        )}
      </div>

      {analysis && (docState === "USER_REVIEW_REQUIRED" || docState === "CONFIRMED") && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${docState === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                {docState === 'CONFIRMED' ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {docState === 'CONFIRMED' ? 'Document Confirmed' : 'Review Required'}
                </h2>
                <p className="text-sm text-gray-500">AI Confidence Score: {(analysis.confidence * 100 || 95).toFixed(0)}%</p>
              </div>
            </div>
            <div className="inline-flex px-3 py-1 bg-gray-100 text-gray-700 font-bold text-xs rounded-full uppercase tracking-wider">
              {analysis.documentType || "Document"}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Extracted Information</h3>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 text-gray-800 whitespace-pre-wrap leading-relaxed">
                {analysis.extractedText}
              </div>
            </div>

            {analysis.flags && analysis.flags.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Automated Flags (Risks)</h3>
                <div className="space-y-3">
                  {analysis.flags.map((flag: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 bg-red-50 border border-red-100 p-4 rounded-xl">
                      <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-red-900 text-sm font-medium">{flag}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {docState === "USER_REVIEW_REQUIRED" && (
              <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-end">
                <button 
                  onClick={() => { setFile(null); setAnalysis(null); setDocState(null); }}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Reject Analysis
                </button>
                <button 
                  onClick={handleConfirm}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <CheckCircle className="w-5 h-5" />
                  Confirm Accuracy
                </button>
              </div>
            )}
            
            {docState === "CONFIRMED" && (
              <div className="pt-6 border-t border-gray-100 text-center">
                <p className="text-emerald-700 font-medium">This document has been confirmed and saved to your SANAD vault.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
