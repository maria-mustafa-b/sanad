import React from 'react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { t, navigate } = useApp();

  return (
    <footer className="w-full bg-surface-container-low border-t border-surface-container-high/60 mt-20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-headline font-bold text-lg">
                سـ
              </div>
              <span className="font-headline font-bold text-xl text-on-surface">
                SANAD (سَنَد)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-md leading-relaxed">
              An accessible multilingual humanitarian and labor rights gateway providing immediate voice assistance, contract clarity, legal sanctuary, and dignity support for every worker.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-primary">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Independent Sovereign Trust Architecture</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li>
                <button onClick={() => navigate('/')} className="hover:text-primary transition-colors cursor-pointer">
                  Services &amp; Claims (المطالبات)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/tell-sanad')} className="hover:text-primary transition-colors cursor-pointer">
                  Voice Assistant (المساعد الصوتي)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/document-reader')} className="hover:text-primary transition-colors cursor-pointer">
                  Document Reader (قارئ الوثائق)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/worker-rights')} className="hover:text-primary transition-colors cursor-pointer">
                  Worker Rights (حقوق العمال)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/verify')} className="hover:text-primary transition-colors cursor-pointer">
                  Public Verification (التحقق العام)
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
              Emergency &amp; Support
            </h4>
            <p className="text-xs text-on-surface-variant mb-1">Toll-Free 24/7 Dispatch</p>
            <p className="text-xl font-headline font-bold text-on-surface mb-3 text-primary">
              800-SANAD-SOS
            </p>
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-[18px]">lock</span>
              <span>End-to-End Encrypted Grievance Records</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-surface-container-high/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <div>
            © 2026 SANAD Worker Support &amp; Dignity Platform. Concept Prototype.
          </div>
          <div className="flex items-center gap-4">
            <span>Confidential &amp; Secure</span>
            <span>•</span>
            <span>Zero Data Leakage Guarantee</span>
            <span>•</span>
            <span>Universal Mother Tongue Access</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
