"use client";
import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PublicHeader } from '../layouts/PublicHeader';
import { Button } from '../components/ui/Button';
import { Card, IconWell } from '../components/ui/Card';
import { Logo } from '../components/ui/Logo';

const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({
  children,
  className = '',
  delay = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible');
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('is-visible');
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal-on-scroll ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      {/* Asymmetric hero â€” copy + visual weight */}
      <section className="relative overflow-hidden bg-brand-dark text-white">
        <div className="absolute inset-0 glow-brand-strong pointer-events-none" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(115deg, rgba(11,61,58,0.95) 0%, rgba(14,74,69,0.72) 48%, rgba(11,61,58,0.88) 100%), url(https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=60)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-22 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              <p className="text-label text-white/55">Worker support & digital credentials</p>
              <h1 className="text-display text-4xl sm:text-5xl lg:text-[3.75rem] text-white text-balance max-w-xl">
                <span className="block text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.05em] text-white">
                  SANAD
                </span>
                <span className="block mt-3 text-[0.55em] sm:text-[0.5em] font-semibold tracking-[-0.02em] text-white/90 leading-snug">
                  Tell me what happened. I&apos;ll help you know what to do next.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-white/75 max-w-md leading-relaxed font-normal tracking-normal">
                Voice-first support for migrant and domestic workers â€” speak naturally, confirm what we understood, carry portable proof.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Button
                  size="lg"
                  variant="inverse"
                  leftIcon="mic"
                  onClick={() => navigate('/chat')}
                >
                  Try SANAD
                </Button>
                <Button
                  size="lg"
                  variant="outlineInverse"
                  onClick={() => navigate('/auth/signup')}
                >
                  Get Started
                </Button>
              </div>
            </div>

            {/* Layered product mock â€” visual weight, not centered icon stack */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-8 glow-brand pointer-events-none blur-2xl opacity-80" />
              <div className="relative rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-5 sm:p-6 shadow-elev">
                <div className="flex items-center gap-3 mb-5">
                  <img src="/sanad-icon-64.png" alt="" className="h-9 w-9 object-contain" />
                  <div>
                    <div className="text-sm font-semibold tracking-tight">Situation sealed</div>
                    <div className="text-[11px] text-white/55">Credential ready to share</div>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {[
                    { k: 'Claim', v: 'Unpaid wages Â· Augâ€“Sep' },
                    { k: 'Status', v: 'Valid attestation' },
                    { k: 'Control', v: 'You choose who sees it' },
                  ].map((row) => (
                    <div
                      key={row.k}
                      className="flex justify-between gap-3 rounded-lg bg-brand-dark/40 px-3.5 py-2.5 text-[13px] border border-white/5"
                    >
                      <span className="text-white/50">{row.k}</span>
                      <span className="font-medium text-right">{row.v}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-2 text-[12px] text-white/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-light" />
                  Device-held Â· selective disclosure
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Varied feature layout â€” not 4 identical icon cards */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-18 sm:py-22">
        <Reveal>
          <div className="max-w-xl mb-12 sm:mb-14">
            <h2 className="text-section">Built for dignity and clarity</h2>
            <p className="mt-3 text-body">
              One connected journey from first question to verified credential.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          <Reveal className="lg:col-span-7" delay={40}>
            <Card tone="elevated" padding="lg" className="h-full relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-48 h-48 glow-brand pointer-events-none" />
              <IconWell icon="smart_toy" size="lg" className="mb-6" />
              <h3 className="text-display-sm text-xl sm:text-2xl text-ink mb-3">AI-Powered Guidance</h3>
              <p className="text-body max-w-md">
                Explain your situation in any language. SANAD structures it for you â€” without forcing legal jargon.
              </p>
            </Card>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={80}>
            <Card tone="soft" padding="lg" className="h-full flex flex-col justify-between min-h-[220px]">
              <IconWell icon="verified_user" className="mb-5" />
              <div>
                <h3 className="text-lg font-semibold tracking-[-0.02em] text-ink mb-2">Verifiable Credentials</h3>
                <p className="text-[14px] text-ink-secondary leading-relaxed">
                  Carry sealed digital proof you control â€” share only when you choose.
                </p>
              </div>
            </Card>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={100}>
            <Card tone="inset" padding="md" className="h-full flex items-start gap-4">
              <IconWell icon="account_balance" size="sm" />
              <div className="pt-0.5">
                <h3 className="font-semibold tracking-[-0.015em] text-ink mb-1.5">Government Services</h3>
                <p className="text-[13px] text-ink-secondary leading-relaxed">
                  Match to labour complaints, shelters, and consular support pathways.
                </p>
              </div>
            </Card>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={120}>
            <Card tone="default" padding="md" className="h-full flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
              <IconWell icon="accessibility_new" />
              <div className="flex-1">
                <h3 className="font-semibold tracking-[-0.015em] text-ink mb-1.5">Accessible for Everyone</h3>
                <p className="text-[14px] text-ink-secondary leading-relaxed">
                  Voice-first, large text, high contrast, and multilingual by design.
                </p>
              </div>
              <Button variant="ghost" size="sm" className="self-start sm:self-center shrink-0" onClick={() => navigate('/settings/accessibility')}>
                Settings
              </Button>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* How it works â€” asymmetric numbered band */}
      <section id="how" className="bg-white border-y border-border py-18 sm:py-22">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 sm:mb-14">
              <h2 className="text-section max-w-sm">How it works</h2>
              <Button size="lg" onClick={() => navigate('/auth/signup')}>
                Create your account
              </Button>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-12">
            {[
              { n: '01', t: 'Speak to SANAD', d: 'Tell what happened in your words â€” voice or text, any language.' },
              { n: '02', t: 'Confirm & get proof', d: 'Check what we understood, give consent, carry a SANAD Digital Proof.' },
              { n: '03', t: 'Find support & track', d: 'See Wage Dispute help, prepare papers, and follow status simply.' },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 70}>
                <div className={i === 1 ? 'md:pt-8' : i === 2 ? 'md:pt-4' : ''}>
                  <div className="text-brand/80 font-extrabold text-3xl tracking-[-0.04em] mb-4">{s.n}</div>
                  <h3 className="text-lg font-semibold tracking-[-0.02em] text-ink mb-2">{s.t}</h3>
                  <p className="text-[14px] text-ink-secondary leading-relaxed max-w-xs">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <footer id="about" className="bg-brand-dark text-white py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between gap-8">
          <div>
            <Logo variant="dark" size="md" />
            <p className="mt-4 text-sm text-white/55 max-w-sm leading-relaxed">
              Independent worker support platform. Concept prototype â€” not an official government portal.
            </p>
          </div>
          <div className="text-sm text-white/55">
            <div className="text-label text-white/40 mb-2">24/7 Hotline</div>
            <div className="text-xl text-white font-bold tracking-tight">800-SANAD-SOS</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
