"use client";
import React from 'react';
import { BadgeTone } from '../../design/tokens';

const tones: Record<BadgeTone, string> = {
  success: 'bg-success-soft text-success-fg',
  warning: 'bg-warning-soft text-warning-fg',
  danger: 'bg-danger-soft text-danger-fg',
  info: 'bg-info-soft text-info-fg',
  brand: 'bg-brand-muted text-brand-dark',
  neutral: 'bg-surface-container text-ink-secondary',
};

/** Sharper radius on data badges â€” not the same soft pill as marketing chips */
export const Badge: React.FC<{
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
  icon?: string;
}> = ({ children, tone = 'neutral', className = '', icon }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide uppercase ${tones[tone]} ${className}`}
  >
    {icon && (
      <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'wght' 500" }}>
        {icon}
      </span>
    )}
    {children}
  </span>
);
