import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm space-y-8">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-teal-700 hover:text-teal-800 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        <div className="border-b border-gray-100 pb-6">
          <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Terms of Service</h1>
          <p className="text-sm text-gray-500 mt-2">Effective Date: October 2026 • SANAD Worker Support Platform</p>
        </div>

        <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Nature of the Platform</h2>
            <p>
              SANAD is an AI-assisted support guide designed to help workers understand their employment rights, organize dispute evidence, and discover appropriate UAE government services (such as MOHRE labor grievance pathways).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. Not Formal Legal Representation</h2>
            <p>
              While SANAD structures claims according to UAE Labor Law (Federal Decree Law No. 33 of 2021), automated assessments provided by the platform do not constitute binding legal advice or formal court representation. Final decisions rest with competent UAE judicial authorities.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Verifiable Credentials & Blockchain Integrity</h2>
            <p>
              Credentials issued via SANAD verify the cryptographic integrity and timestamp of the recorded claim on the Polygon blockchain. Issuance of a credential certifies the record's untampered state, not the underlying truth of dispute claims.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. User Responsibilities</h2>
            <p>
              Users agree to provide accurate information and valid documentation to the best of their knowledge during intake and document verification.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
