"use client";
import React from 'react';
import { useApp } from '../context/AppContext';

interface StepTrackerProps {
  currentStepIndex: number; // 1 to 6
}

export const StepTracker: React.FC<StepTrackerProps> = ({ currentStepIndex }) => {
  const { navigate, activeDossier } = useApp();

  const steps = [
    { num: 1, title: 'Tell SANAD', desc: 'Voice & Speech capture', path: '/tell-sanad' },
    { num: 2, title: 'Confirm Situation', desc: 'Structured summary', path: '/confirm-situation' },
    { num: 3, title: 'Proof Created', desc: 'Verifiable credential', path: '/my-proof' },
    { num: 4, title: 'Find Support', desc: 'NGOs & legal aid', path: '/evidence-application' },
    { num: 5, title: 'Evidence & Apply', desc: 'Direct submissions', path: '/evidence-application' },
    { num: 6, title: 'Track & Verify', desc: 'Smart receipt tracker', path: '/applications' },
  ];

  return (
    <div className="w-full bg-surface-container rounded-2xl p-4 sm:p-5 shadow-sm mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          <span>Worker Rights Dossier â€” Process Flow</span>
        </div>
        <div className="text-xs text-on-surface-variant font-medium">
          Dossier ID: <span className="font-mono text-primary font-bold">{activeDossier.id}</span>
        </div>
      </div>

      {/* Stepper track */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {steps.map((s) => {
          const isDone = s.num < currentStepIndex;
          const isActive = s.num === currentStepIndex;

          return (
            <button
              key={s.num}
              onClick={() => navigate(s.path)}
              className={`text-left flex flex-col gap-1 p-2.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary-container text-on-surface shadow-xs ring-2 ring-primary/40'
                  : isDone
                  ? 'bg-primary-fixed/40 text-on-surface hover:bg-primary-fixed/60'
                  : 'bg-surface-container-high/60 text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    isDone
                      ? 'bg-primary text-on-primary'
                      : isActive
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-variant text-on-surface-variant'
                  }`}
                >
                  {isDone ? 'âœ“' : s.num}
                </span>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider ${
                    isActive ? 'text-primary' : isDone ? 'text-primary' : 'text-secondary'
                  }`}
                >
                  {isActive ? 'Active' : isDone ? 'Done' : `Step ${s.num}`}
                </span>
              </div>
              <span
                className={`text-xs leading-tight mt-1 font-bold ${
                  isActive ? 'text-primary' : 'text-on-surface'
                }`}
              >
                {s.title}
              </span>
              <span className="text-[10px] text-on-surface-variant truncate">
                {s.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
