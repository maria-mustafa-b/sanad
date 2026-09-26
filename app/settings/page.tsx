"use client";

import { useState, useEffect } from "react";
import { Settings, Save, Volume2, Eye, Type, Contrast, Orbit, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState({
    voiceAssistance: true,
    screenReader: false,
    largerText: false,
    highContrast: false,
    reducedMotion: false,
  });

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("sanad_accessibility");
    if (stored) {
      setPrefs(JSON.parse(stored));
    }
  }, []);

  const handleToggle = (key: keyof typeof prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem("sanad_accessibility", JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    
    // In a real app, this might dispatch a global context update
    // or toggle CSS variables on the document root
  };

  if (!mounted) return null;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col pb-20 animate-in fade-in duration-500">
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Accessibility Settings</h1>
        <p className="text-gray-500">Customize SANAD to work perfectly for your needs.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Controls */}
        <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-8 md:p-10">
          <div className="space-y-6">
            
            <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center shrink-0">
                  <Volume2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Voice Assistance</h3>
                  <p className="text-sm text-gray-500">Read out AI summaries and chat responses automatically.</p>
                </div>
              </div>
              <button 
                onClick={() => handleToggle('voiceAssistance')}
                className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 shrink-0 ${prefs.voiceAssistance ? 'bg-teal-600' : 'bg-gray-200'}`}
              >
                <div className={`w-6 h-6 rounded-full bg-white transition-transform ${prefs.voiceAssistance ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center shrink-0">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Screen Reader Optimized</h3>
                  <p className="text-sm text-gray-500">Simplify complex layouts into highly semantic text lists.</p>
                </div>
              </div>
              <button 
                onClick={() => handleToggle('screenReader')}
                className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 shrink-0 ${prefs.screenReader ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <div className={`w-6 h-6 rounded-full bg-white transition-transform ${prefs.screenReader ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-700 rounded-xl flex items-center justify-center shrink-0">
                  <Type className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Larger Text</h3>
                  <p className="text-sm text-gray-500">Increase global typography size across the app.</p>
                </div>
              </div>
              <button 
                onClick={() => handleToggle('largerText')}
                className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 shrink-0 ${prefs.largerText ? 'bg-purple-600' : 'bg-gray-200'}`}
              >
                <div className={`w-6 h-6 rounded-full bg-white transition-transform ${prefs.largerText ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center shrink-0">
                  <Contrast className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">High Contrast</h3>
                  <p className="text-sm text-gray-500">Use stark colors and sharper borders to improve readability.</p>
                </div>
              </div>
              <button 
                onClick={() => handleToggle('highContrast')}
                className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 shrink-0 ${prefs.highContrast ? 'bg-amber-600' : 'bg-gray-200'}`}
              >
                <div className={`w-6 h-6 rounded-full bg-white transition-transform ${prefs.highContrast ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
                  <Orbit className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Reduced Motion</h3>
                  <p className="text-sm text-gray-500">Disable transitions, zooms, and decorative animations.</p>
                </div>
              </div>
              <button 
                onClick={() => handleToggle('reducedMotion')}
                className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 shrink-0 ${prefs.reducedMotion ? 'bg-emerald-600' : 'bg-gray-200'}`}
              >
                <div className={`w-6 h-6 rounded-full bg-white transition-transform ${prefs.reducedMotion ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-400">Settings are saved locally to your device.</span>
            <button 
              onClick={handleSave}
              className="px-8 py-4 bg-teal-700 text-white rounded-2xl font-bold hover:bg-teal-800 transition flex items-center gap-2 shadow-lg shadow-teal-700/20"
            >
              {saved ? (
                <><CheckCircle2 className="w-5 h-5" /> Saved Successfully</>
              ) : (
                <><Save className="w-5 h-5" /> Save Settings</>
              )}
            </button>
          </div>
        </div>

        {/* Live Preview Area */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4 px-2">Live Preview</h3>
            <div className={`
              border rounded-3xl p-6 transition-all duration-500
              ${prefs.highContrast ? 'bg-black border-black text-white shadow-none' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}
            `}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${prefs.highContrast ? 'bg-white text-black' : 'bg-teal-100 text-teal-700'}`}>S</div>
                <div className={prefs.largerText ? 'text-xl' : 'text-sm'}>
                  <p className="font-bold">Sanmeet Singh</p>
                  <p className={prefs.highContrast ? 'text-gray-300' : 'text-gray-500'}>Worker Profile</p>
                </div>
              </div>

              <div className={`rounded-xl p-4 mb-4 ${prefs.highContrast ? 'border-2 border-white' : 'bg-gray-50 border border-gray-100'}`}>
                <h4 className={`font-bold mb-2 ${prefs.largerText ? 'text-lg' : 'text-sm'}`}>Example Claim</h4>
                <p className={`${prefs.largerText ? 'text-base' : 'text-xs'} ${prefs.highContrast ? 'text-gray-200' : 'text-gray-600'} leading-relaxed`}>
                  You have successfully submitted your unpaid wages dispute. We are matching you with a representative.
                </p>
              </div>

              {!prefs.reducedMotion && (
                <div className="w-full h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full animate-pulse mt-4"></div>
              )}
            </div>
        </div>
        </div>

      </div>
    </div>
  );
}
