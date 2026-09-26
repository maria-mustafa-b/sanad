"use client";
import React from 'react';

type LogoVariant = 'light' | 'dark' | 'inverse' | 'mark';
type LogoSize = 'sm' | 'md' | 'lg';

/**
 * Provided SANAD assets only â€” never redrawn.
 * - light: icon + wordmark for light nav (full mark has a dark plate)
 * - dark / inverse / mark: full logo file (designed for dark surfaces)
 */
export const Logo: React.FC<{
  variant?: LogoVariant;
  size?: LogoSize;
  onClick?: () => void;
  className?: string;
  /** Show "SANAD" wordmark next to icon on light surfaces */
  wordmark?: boolean;
}> = ({ variant = 'light', size = 'md', onClick, className = '', wordmark = true }) => {
  const useFull = variant === 'dark' || variant === 'inverse' || variant === 'mark';

  const src = useFull
    ? '/sanad-logo-full-transparent.png'
    : size === 'lg'
    ? '/sanad-icon-192.png'
    : '/sanad-icon-64.png';

  const heights: Record<LogoSize, string> = useFull
    ? { sm: 'h-10', md: 'h-12', lg: 'h-16' }
    : { sm: 'h-8', md: 'h-9', lg: 'h-12' };

  const wordSizes: Record<LogoSize, string> = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const content = (
    <span className={`inline-flex items-center gap-2.5 shrink-0 ${className}`}>
      <img
        src={src}
        alt={useFull || !wordmark ? 'SANAD' : ''}
        className={`${heights[size]} w-auto max-w-[160px] object-contain object-left select-none`}
        draggable={false}
        decoding="async"
      />
      {!useFull && wordmark && (
        <span
          className={`${wordSizes[size]} font-extrabold tracking-[-0.04em] text-brand-dark leading-none`}
          aria-hidden={false}
        >
          SANAD
        </span>
      )}
    </span>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center py-1.5 pr-2 cursor-pointer shrink-0 focus-visible:rounded-lg"
        aria-label="SANAD home"
      >
        {content}
      </button>
    );
  }

  return <div className="inline-flex items-center shrink-0 py-1.5">{content}</div>;
};
