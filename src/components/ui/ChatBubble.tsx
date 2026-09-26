"use client";
import React from 'react';

export const ChatBubble: React.FC<{
  role: 'user' | 'assistant' | 'system';
  children: React.ReactNode;
  time?: string;
}> = ({ role, children, time }) => {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[85%] sm:max-w-[70%] px-4 py-3 text-[14px] leading-relaxed transition-shadow ${
          isUser
            ? 'bg-brand text-white rounded-2xl rounded-br-md shadow-btn'
            : role === 'system'
            ? 'bg-warning-soft text-warning-fg border border-warning/20 rounded-xl'
            : 'bg-white border border-border text-ink rounded-2xl rounded-bl-md shadow-card'
        }`}
      >
        {children}
        {time && (
          <div className={`text-[10px] mt-1.5 ${isUser ? 'text-white/70' : 'text-ink-muted'}`}>
            {time}
          </div>
        )}
      </div>
    </div>
  );
};

export const Tabs: React.FC<{
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}> = ({ tabs, active, onChange, className = '' }) => (
  <div
    role="tablist"
    className={`flex gap-0.5 p-1 bg-surface-container rounded-lg overflow-x-auto scrollbar-none ${className}`}
  >
    {tabs.map((t) => (
      <button
        key={t.id}
        role="tab"
        aria-selected={active === t.id}
        onClick={() => onChange(t.id)}
        className={`px-3.5 py-2 rounded-md text-[13px] font-semibold whitespace-nowrap min-h-[40px] transition-all duration-200 ease-out cursor-pointer ${
          active === t.id
            ? 'bg-white text-brand-dark shadow-card'
            : 'text-ink-muted hover:text-ink hover:bg-white/50'
        }`}
      >
        {t.label}
      </button>
    ))}
  </div>
);
