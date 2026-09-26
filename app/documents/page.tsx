"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

export default function DocumentsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAnalysis(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

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
      }
    } catch (e) {
      console.error(e);
      alert("Failed to analyze document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 pt-24 pb-12 flex flex-col">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Secure Document Vault</h1>
        <p className="text-gray-600">
          Upload employment contracts, salary slips, or visas. SANAD's AI will automatically read and flag illegal clauses.
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
            className="cursor-pointer flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <span className="text-lg font-bold text-gray-900 mb-1">
              {file ? file.name : "Select a document to upload"}
            </span>
            <span className="text-sm text-gray-500">
              Supports JPEG, PNG, or PDF up to 5MB
            </span>
          </label>
        </div>

        {file && !analysis && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleUpload}
              disabled={loading}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Extract & Analyze
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {analysis && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Analysis Complete</h2>
              <p className="text-sm text-gray-500">Document Type: {analysis.documentType}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Extracted Details</h3>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-800 whitespace-pre-wrap">
                {analysis.extractedText}
              </div>
            </div>

            {analysis.flags && analysis.flags.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Automated Flags</h3>
                <div className="space-y-3">
                  {analysis.flags.map((flag: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 bg-orange-50 border border-orange-100 p-4 rounded-xl">
                      <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                      <p className="text-orange-900 text-sm font-medium">{flag}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
