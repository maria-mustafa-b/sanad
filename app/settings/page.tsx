"use client";

import { useState } from "react";
import { 
  Globe, 
  Bell, 
  ShieldCheck, 
  Lock, 
  Check, 
  Save, 
  UserCheck, 
  Sparkles,
  Smartphone,
  FileSearch,
  ExternalLink,
  ChevronRight
} from "lucide-react";

export default function SettingsPage() {
  const [language, setLanguage] = useState("en");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [autoOcr, setAutoOcr] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const languages = [
    { code: "en", label: "English (Official UAE Standard)", native: "English" },
    { code: "ar", label: "العربية (Arabic - UAE Formal & Gulf Dialect)", native: "العربية" },
    { code: "ur", label: "اردو (Urdu)", native: "اردو" },
    { code: "hi", label: "हिंदी (Hindi)", native: "हिंदी" },
    { code: "tl", label: "Tagalog (Filipino)", native: "Tagalog" },
    { code: "bn", label: "বাংলা (Bengali)", native: "বাংলা" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ECEFEA] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-extrabold text-[#166534]">
              Account Preferences
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#166534]"></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#153D32] tracking-tight">
            Settings & Identity Preferences
          </h1>
          <p className="text-xs sm:text-sm text-[#68716D] mt-0.5">
            Manage language, UAE PASS sync, notification channels, and privacy controls.
          </p>
        </div>

        <button 
          onClick={handleSave} 
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#153D32] hover:bg-[#103027] text-white text-xs font-bold transition shadow-sm cursor-pointer"
        >
          {saved ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
          <span>{saved ? "Saved" : "Save Changes"}</span>
        </button>
      </div>

      {/* ================= SECTION 1: UAE PASS VERIFIED IDENTITY ================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#ECEFEA] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#000000] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
            <span className="tracking-tighter font-mono">UAE</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-[#153D32]">
                UAE PASS Verified Identity
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#EBF7EE] text-[#166534] border border-[#BBF7D0] text-[10px] font-bold">
                Active & Synced
              </span>
            </div>
            <p className="text-xs text-[#68716D] mt-0.5">
              UID: 784-1994-1234567-1 • High Assurance Level (SOP3)
            </p>
          </div>
        </div>

        <button 
          type="button"
          onClick={() => alert("UAE PASS Authentication active and verified.")}
          className="px-4 py-2 rounded-xl bg-[#FAFBF9] border border-[#DDE2D9] text-xs font-bold text-[#153D32] hover:bg-white transition shadow-2xs shrink-0 cursor-pointer"
        >
          Re-authenticate
        </button>
      </div>

      {/* ================= SECTION 2: LANGUAGE & DIALECT SELECTION ================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ECEFEA] shadow-sm space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-[#F0F3EE]">
          <div className="w-9 h-9 rounded-xl bg-[#EBF5EF] text-[#153D32] flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-[#153D32]">
              Language & Dialect Selection
            </h3>
            <p className="text-xs text-[#68716D]">
              Select your preferred language for voice intake, AI guidance, and official document summaries.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {languages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <label 
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-4 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                  isSelected 
                    ? "bg-[#FAFDFB] border-[#153D32] ring-1 ring-[#153D32] shadow-2xs" 
                    : "bg-[#FAFBF9] border-[#ECEFEA] hover:border-[#DDE2D9]"
                }`}
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-[#202A27]">{lang.label}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  isSelected ? "border-[#153D32] bg-[#153D32]" : "border-[#C6CCC6] bg-white"
                }`}>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* ================= SECTION 3: NOTIFICATION CHANNELS & VAULT ================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ECEFEA] shadow-sm space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-[#F0F3EE]">
          <div className="w-9 h-9 rounded-xl bg-[#EBF5EF] text-[#153D32] flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-[#153D32]">
              Notification Channels & Automation
            </h3>
            <p className="text-xs text-[#68716D]">
              Choose how you receive proactive compliance warnings and application milestones.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {/* SMS */}
          <label className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#ECEFEA] flex items-center justify-between cursor-pointer hover:border-[#DDE2D9] transition">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[#202A27]">SMS & WhatsApp Expiration Alerts</span>
              <p className="text-[11px] text-[#6E7873]">Receive alerts 60, 30, and 15 days before visa or tenancy expiration.</p>
            </div>
            <input 
              type="checkbox" 
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="w-4 h-4 rounded border-[#C6CCC6] text-[#153D32] focus:ring-[#153D32] cursor-pointer"
            />
          </label>

          {/* Automated OCR */}
          <label className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#ECEFEA] flex items-center justify-between cursor-pointer hover:border-[#DDE2D9] transition">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[#202A27]">Automated Document Vault OCR</span>
              <p className="text-[11px] text-[#6E7873]">Automatically parse and extract key data upon document upload.</p>
            </div>
            <input 
              type="checkbox" 
              checked={autoOcr}
              onChange={(e) => setAutoOcr(e.target.checked)}
              className="w-4 h-4 rounded border-[#C6CCC6] text-[#153D32] focus:ring-[#153D32] cursor-pointer"
            />
          </label>
        </div>
      </div>

    </div>
  );
}
