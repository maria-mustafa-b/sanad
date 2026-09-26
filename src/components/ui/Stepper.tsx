"use client";
import React from 'react';

export type StepItem = { id: string; label: string };

export const Stepper: React.FC<{
  steps: StepItem[];
  current: number;
  className?: string;
}> = ({ steps, current, className = '' }) => (
  <nav aria-label="Progress" className={`w-full ${className}`}>
    <ol className="flex items-center gap-0 overflow-x-auto scrollbar-none">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={step.id} className="flex items-center min-w-0 flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2 min-w-[4.5rem]">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ease-out ${
                  done
                    ? 'bg-brand border-brand text-white scale-100'
                    : active
                    ? 'bg-white border-brand text-brand shadow-focus scale-105'
                    : 'bg-white border-border text-ink-muted scale-100'
                }`}
              >
                {done ? (
                  <span className="material-symbols-outlined text-[16px] animate-fade-in">check</span>
                ) : (
                  i + 1
                )}
              </span>
              <span
                className={`text-[11px] font-medium text-center leading-tight transition-colors duration-300 ${
                  active || done ? 'text-brand-dark' : 'text-ink-muted'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="h-0.5 flex-1 mx-1 mb-6 rounded-full bg-border overflow-hidden">
                <div
                  className={`h-full bg-brand transition-all duration-500 ease-out ${
                    done ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);
