import { Sparkles, ShieldCheck, Mic, Globe2, FileSearch, Lock } from 'lucide-react'

export function Features() {
    return (
        <section className="py-12 md:py-20 bg-slate-900">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className="text-balance text-4xl font-extrabold lg:text-5xl text-white">The foundation for secure worker protection</h2>
                    <p className="text-gray-400 text-lg">SANAD is evolving to be more than just an AI chatbot. It supports an entire ecosystem helping vulnerable workers and government entities resolve disputes efficiently.</p>
                </div>

                <div className="relative mx-auto grid max-w-2xl lg:max-w-4xl divide-x divide-y divide-slate-800 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 *:p-12 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-3 bg-slate-900/50 hover:bg-slate-800/80 transition-colors">
                        <div className="flex items-center gap-2 text-emerald-400">
                            <Mic className="size-5" />
                            <h3 className="text-base font-bold text-white">Voice Intake</h3>
                        </div>
                        <p className="text-sm text-gray-400">Speak naturally. Our AI translates and structures your situation into a formal legal claim instantly.</p>
                    </div>
                    <div className="space-y-3 bg-slate-900/50 hover:bg-slate-800/80 transition-colors">
                        <div className="flex items-center gap-2 text-emerald-400">
                            <ShieldCheck className="size-5" />
                            <h3 className="text-base font-bold text-white">Cryptographic Proof</h3>
                        </div>
                        <p className="text-sm text-gray-400">We seal your claim and evidence on the Polygon blockchain as a tamper-proof Verifiable Credential.</p>
                    </div>
                    <div className="space-y-3 bg-slate-900/50 hover:bg-slate-800/80 transition-colors">
                        <div className="flex items-center gap-2 text-emerald-400">
                            <FileSearch className="size-5" />
                            <h3 className="text-base font-bold text-white">Service Matching</h3>
                        </div>
                        <p className="text-sm text-gray-400">Automatically match your situation with the exact UAE government services that can help.</p>
                    </div>
                    <div className="space-y-3 bg-slate-900/50 hover:bg-slate-800/80 transition-colors">
                        <div className="flex items-center gap-2 text-emerald-400">
                            <Globe2 className="size-5" />
                            <h3 className="text-base font-bold text-white">Multilingual</h3>
                        </div>
                        <p className="text-sm text-gray-400">Full support for Urdu, Hindi, Arabic, Bengali, and English for accessible justice.</p>
                    </div>
                    <div className="space-y-3 bg-slate-900/50 hover:bg-slate-800/80 transition-colors">
                        <div className="flex items-center gap-2 text-emerald-400">
                            <Sparkles className="size-5" />
                            <h3 className="text-base font-bold text-white">Built for AI</h3>
                        </div>
                        <p className="text-sm text-gray-400">Powered by Gemini for advanced OCR, situation understanding, and semantic matching.</p>
                    </div>
                    <div className="space-y-3 bg-slate-900/50 hover:bg-slate-800/80 transition-colors">
                        <div className="flex items-center gap-2 text-emerald-400">
                            <Lock className="size-5" />
                            <h3 className="text-base font-bold text-white">Data Privacy</h3>
                        </div>
                        <p className="text-sm text-gray-400">Your documents remain secure and verifiable without exposing raw sensitive data.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
