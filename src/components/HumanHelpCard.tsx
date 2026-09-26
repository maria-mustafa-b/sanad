"use client";
import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

/** Always-visible path to a human â€” SANAD is a guide, not the final authority */
export const HumanHelpCard: React.FC<{
  className?: string;
  compact?: boolean;
}> = ({ className = '', compact }) => (
  <Card
    tone="soft"
    padding={compact ? 'md' : 'lg'}
    className={`border border-brand/15 ${className}`}
  >
    <div className={`flex ${compact ? 'flex-row items-center gap-4' : 'flex-col sm:flex-row sm:items-center gap-4'}`}>
      <div className="w-12 h-12 rounded-xl bg-brand text-white flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-[26px]">support_agent</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-ink tracking-[-0.02em]">
          Need a person to talk to?
        </h3>
        {!compact && (
          <p className="text-sm text-ink-secondary mt-1 leading-relaxed">
            <span className="font-semibold text-brand-dark">SANAD</span> is a guide.
            A human advisor can explain options in your language â€” we do not decide legal eligibility.
          </p>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-2 shrink-0">
        <Button variant="secondary" size="sm" leftIcon="call" onClick={() => window.open('tel:8007262376')}>
          Call help
        </Button>
        <Button variant="outline" size="sm" leftIcon="chat" onClick={() => {}}>
          Message advisor
        </Button>
      </div>
    </div>
  </Card>
);
