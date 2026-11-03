import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm space-y-8">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-teal-700 hover:text-teal-800 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        <div className="border-b border-gray-100 pb-6">
          <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mt-2">Effective Date: October 2026 • SANAD Worker Support Platform</p>
        </div>

        <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Our Commitment to Worker Dignity & Privacy</h2>
            <p>
              SANAD was built from the ground up to empower vulnerable and migrant workers. We collect only the information necessary to structure your employment situation, verify relevant documents, and connect you with authorized support services in the UAE.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. Information We Process</h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li><strong>Voice and Text Input:</strong> Audio recordings and transcriptions submitted during the intake process to extract legal facts.</li>
              <li><strong>Uploaded Documents:</strong> Employment contracts, salary slips, and Emirates ID images processed strictly for legal OCR analysis.</li>
              <li><strong>Verifiable Credentials:</strong> Cryptographic hashes issued to the Polygon blockchain. Your personal identity is never stored unencrypted on-chain.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Zero Forced Tracking & Data Sovereignty</h2>
            <p>
              You maintain sovereign control over your records. You can delete your uploaded documents, clear your voice recordings, and choose whether to present your verifiable credentials to legal clinics or support organizations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Third-Party Services & AI Processing</h2>
            <p>
              AI legal fact structuring is powered securely via Google Gemini API endpoints under enterprise zero-data-retention terms. Your data is not used to train public machine learning models.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
