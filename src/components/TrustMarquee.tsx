"use client";
import React, { useEffect, useState } from 'react';
import { languageMeta, extendedLanguages } from '../locales';
import { LanguageCode } from '../types';

const CORE: LanguageCode[] = ['en', 'ar', 'hi', 'ur', 'bn'];

/** Infinite CSS marquee of language marks â€” no JS animation loop. */
export const TrustMarquee: React.FC<{ label?: string }> = ({ label }) => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const items = [
    ...CORE.map((code) => ({
      key: code,
      primary: languageMeta[code].nativeLabel,
      secondary: languageMeta[code].label,
    })),
    ...extendedLanguages.slice(0, 8).map((el) => ({
      key: el.code,
      primary: el.script,
      secondary: el.name.split('/')[0].trim(),
    })),
  ];

  const track = reduceMotion ? items : [...items, ...items];

  return (
    <div className="w-full bg-surface-container-low border-y border-surface-container-high/60 py-5 overflow-hidden">
      {label && (
        <p className="text-center text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4 px-4">
          {label}
        </p>
      )}
      <div className="marquee-mask relative" role="presentation">
        <div
          className={`marquee-track flex gap-10 sm:gap-14 items-center ${
            reduceMotion ? 'w-full max-w-6xl mx-auto flex-wrap justify-center px-4' : 'w-max'
          }`}
          aria-hidden="true"
        >
          {track.map((item, i) => (
            <div
              key={`${item.key}-${i}`}
              className="flex flex-col items-center justify-center min-w-[5.5rem] shrink-0 opacity-70"
            >
              <span className="font-headline font-bold text-xl sm:text-2xl text-navy leading-none">
                {item.primary}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-on-surface-variant mt-1 uppercase tracking-wide">
                {item.secondary}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
