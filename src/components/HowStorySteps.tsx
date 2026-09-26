import React, { useEffect, useRef, useState } from 'react';
import { Reveal } from './Reveal';

export type HowStep = {
  num: string;
  title: string;
  body: string;
  icon: string;
};

type Props = {
  title: string;
  steps: HowStep[];
};

/**
 * "How SANAD preserves your story"
 * - Desktop (lg+) + no reduced-motion: sticky panel updated via IntersectionObserver
 * - Mobile / reduced-motion: stacked fade-up cards (predictable, cheap)
 */
export const HowStorySteps: React.FC<Props> = ({ title, steps }) => {
  const [active, setActive] = useState(0);
  const [useSticky, setUseSticky] = useState(false);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia(
      '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'
    );
    const sync = () => setUseSticky(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!useSticky) return;

    const markers = markerRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!markers.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top)
          );
        if (visible[0]) {
          const idx = Number((visible[0].target as HTMLElement).dataset.step);
          if (!Number.isNaN(idx)) setActive(idx);
        }
      },
      { rootMargin: '-35% 0px -35% 0px', threshold: 0 }
    );

    markers.forEach((m) => io.observe(m));
    return () => io.disconnect();
  }, [useSticky, steps.length]);

  const current = steps[active] || steps[0];

  if (!useSticky) {
    return (
      <section className="w-full bg-surface py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-10">
          <Reveal>
            <h2 className="font-headline font-bold text-3xl sm:text-4xl text-navy text-center leading-tight">
              {title}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <Reveal key={step.num} delayMs={i * 80}>
                <div className="hover-elevate flex flex-col gap-4 p-6 sm:p-8 rounded-xl bg-surface-container-lowest shadow-card min-h-[200px]">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-headline font-bold">
                      {step.num}
                    </span>
                    <span
                      className="material-symbols-outlined text-primary text-3xl"
                      style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'opsz' 48" }}
                    >
                      {step.icon}
                    </span>
                  </div>
                  <h3 className="font-headline font-bold text-xl text-navy">{step.title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-surface py-8">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal>
          <h2 className="font-headline font-bold text-3xl sm:text-4xl text-navy text-center leading-tight mb-10">
            {title}
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-12 items-start">
          <div className="sticky top-32 h-[calc(100vh-10rem)] flex items-center">
            <div className="w-full p-10 rounded-xl bg-navy text-white shadow-soft">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-accent font-headline font-bold text-sm tracking-widest uppercase">
                  Step {current.num}
                </span>
                <span
                  className="material-symbols-outlined text-accent text-4xl"
                  style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'opsz' 48" }}
                >
                  {current.icon}
                </span>
              </div>
              <h3 className="font-headline font-bold text-3xl lg:text-4xl leading-tight mb-4">
                {current.title}
              </h3>
              <p className="text-lg text-white/75 leading-relaxed max-w-md">{current.body}</p>

              <div className="flex gap-2 mt-10">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === active ? 'w-8 bg-accent' : 'w-3 bg-white/25'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 py-8">
            {steps.map((step, i) => (
              <div
                key={step.num}
                ref={(el) => {
                  markerRefs.current[i] = el;
                }}
                data-step={i}
                className={`min-h-[55vh] flex items-center p-8 rounded-xl border-2 transition-colors duration-300 ${
                  i === active
                    ? 'border-primary bg-primary/5'
                    : 'border-surface-container-high bg-surface-container-lowest'
                }`}
              >
                <div className="space-y-3">
                  <span className="font-headline font-bold text-primary text-sm tracking-wider uppercase">
                    {step.num}
                  </span>
                  <h4 className="font-headline font-bold text-2xl text-navy">{step.title}</h4>
                  <p className="text-on-surface-variant leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
