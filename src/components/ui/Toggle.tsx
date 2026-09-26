"use client";
import React from 'react';

export const Toggle: React.FC<{
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}> = ({ checked, onChange, label, description, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`w-full flex items-center justify-between gap-4 py-3 text-left disabled:opacity-50 cursor-pointer`}
  >
    <span className="min-w-0">
      <span className="block text-sm font-medium text-ink">{label}</span>
      {description && (
        <span className="block text-xs text-ink-muted mt-0.5">{description}</span>
      )}
    </span>
    <span
      className={`relative shrink-0 w-11 h-6 rounded-full transition-colors ${
        checked ? 'bg-brand' : 'bg-border-strong'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </span>
  </button>
);
