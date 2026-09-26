import { Cpu, Fingerprint, Pencil, Settings2, Sparkles, Zap, ShieldCheck, Mic, Scale, Globe2, FileSearch, Lock } from 'lucide-react'

export function Features() {
    return (
        <section className="py-12 md:py-20 bg-white">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className="text-balance text-4xl font-extrabold lg:text-5xl text-gray-900">The foundation for secure worker protection</h2>
                    <p className="text-gray-600 text-lg">SANAD is evolving to be more than just an AI chatbot. It supports an entire ecosystem helping vulnerable workers and government entities resolve disputes efficiently.</p>
                </div>

                <div className="relative mx-auto grid max-w-2xl lg:max-w-4xl divide-x divide-y border border-gray-200 rounded-3xl overflow-hidden bg-gray-50/50 shadow-sm *:p-12 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-3 bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2 text-teal-600">
                            <Mic className="size-5" />
                            <h3 className="text-base font-bold text-gray-900">Voice Intake</h3>
                        </div>
                        <p className="text-sm text-gray-600">Speak naturally. Our AI translates and structures your situation into a formal legal claim instantly.</p>
                    </div>
                    <div className="space-y-3 bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2 text-teal-600">
                            <ShieldCheck className="size-5" />
                            <h3 className="text-base font-bold text-gray-900">Cryptographic Proof</h3>
                        </div>
                        <p className="text-sm text-gray-600">We seal your claim and evidence on the Polygon blockchain as a tamper-proof Verifiable Credential.</p>
                    </div>
                    <div className="space-y-3 bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2 text-teal-600">
                            <FileSearch className="size-5" />
                            <h3 className="text-base font-bold text-gray-900">Service Matching</h3>
                        </div>
                        <p className="text-sm text-gray-600">Automatically match your situation with the exact UAE government services that can help.</p>
                    </div>
                    <div className="space-y-3 bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2 text-teal-600">
                            <Globe2 className="size-5" />
                            <h3 className="text-base font-bold text-gray-900">Multilingual</h3>
                        </div>
                        <p className="text-sm text-gray-600">Full support for Urdu, Hindi, Arabic, Bengali, and English for accessible justice.</p>
                    </div>
                    <div className="space-y-3 bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2 text-teal-600">
                            <Sparkles className="size-5" />
                            <h3 className="text-base font-bold text-gray-900">Built for AI</h3>
                        </div>
                        <p className="text-sm text-gray-600">Powered by Gemini for advanced OCR, situation understanding, and semantic matching.</p>
                    </div>
                    <div className="space-y-3 bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2 text-teal-600">
                            <Lock className="size-5" />
                            <h3 className="text-base font-bold text-gray-900">Data Privacy</h3>
                        </div>
                        <p className="text-sm text-gray-600">Your documents remain secure and verifiable without exposing raw sensitive data.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
