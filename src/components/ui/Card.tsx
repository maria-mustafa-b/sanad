import React from 'react';

type CardTone = 'default' | 'soft' | 'elevated' | 'flat' | 'inset';

export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'tight';
  hover?: boolean;
  onClick?: () => void;
  tone?: CardTone;
}> = ({ children, className = '', padding = 'md', hover, onClick, tone = 'default' }) => {
  const pad = {
    none: '',
    tight: 'p-3 sm:p-4',
    sm: 'p-4',
    md: 'px-5 py-4 sm:px-6 sm:py-5',
    lg: 'px-6 py-6 sm:px-8 sm:py-7',
  }[padding];

  const tones: Record<CardTone, string> = {
    default: 'bg-card border border-border rounded-xl shadow-card',
    soft: 'bg-card border border-border/80 rounded-2xl shadow-soft',
    elevated: 'bg-card border border-border/60 rounded-2xl shadow-elev',
    flat: 'bg-card border border-border rounded-md shadow-none',
    inset: 'bg-surface-container-low border border-transparent rounded-xl shadow-none',
  };

  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp
      onClick={onClick}
      className={`${tones[tone]} text-left ${pad} ${
        hover || onClick ? 'hover-elevate cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </Comp>
  );
};

export const CardHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({
  title,
  subtitle,
  action,
}) => (
  <div className="flex items-start justify-between gap-3 mb-5">
    <div className="min-w-0">
      <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-ink">{title}</h3>
      {subtitle && <p className="text-[13px] text-ink-muted mt-1 leading-snug">{subtitle}</p>}
    </div>
    {action}
  </div>
);

/** Icon with soft brand-tinted well — not a bare outline on white */
export const IconWell: React.FC<{
  icon: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ icon, size = 'md', className = '' }) => {
  const box = { sm: 'w-9 h-9', md: 'w-11 h-11', lg: 'w-14 h-14' }[size];
  const glyph = { sm: 'text-[20px]', md: 'text-[24px]', lg: 'text-[28px]' }[size];
  return (
    <span
      className={`${box} rounded-xl bg-gradient-to-br from-brand-muted to-brand-soft text-brand flex items-center justify-center shrink-0 ring-1 ring-brand/10 ${className}`}
    >
      <span
        className={`material-symbols-outlined ${glyph}`}
        style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
      >
        {icon}
      </span>
    </span>
  );
};
