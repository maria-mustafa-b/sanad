"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppShell } from '../layouts/AppShell';
import { Button } from '../components/ui/Button';
import { TextArea } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { HumanHelpCard } from '../components/HumanHelpCard';
import {
  DEMO_HINGLISH_TRANSCRIPT,
  analyzeCodeSwitching,
  createSpeechRecognizer,
  isSpeechRecognitionSupported,
  speakText,
} from '../services/speechService';
import { structureWorkerNarrative } from '../services/aiService';

type Phase = 'idle' | 'listening' | 'processing' | 'ready';

/**
 * Voice-first intake â€” primary SANAD experience.
 * Speak â†’ listen â†’ transcript â†’ understand â†’ confirm (no credential yet).
 */
export const ChatPage: React.FC = () => {
  const { navigate, language, updateDossier, t } = useApp();
  const [phase, setPhase] = useState<Phase>('idle');
  const [transcript, setTranscript] = useState('');
  const [mode, setMode] = useState<'voice' | 'text'>('voice');
  const [statusMsg, setStatusMsg] = useState('Tap the microphone and speak freely â€” any language is fine.');
  const [seconds, setSeconds] = useState(0);
  const recognizerRef = useRef<ReturnType<typeof createSpeechRecognizer>>(null);
  const timerRef = useRef<number | null>(null);
  const demoTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopListening(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearTimers = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (demoTimerRef.current) window.clearTimeout(demoTimerRef.current);
    timerRef.current = null;
    demoTimerRef.current = null;
  };

  const stopListening = (silent = false) => {
    try {
      recognizerRef.current?.stop?.();
    } catch {
      /* ignore */
    }
    recognizerRef.current = null;
    clearTimers();
    if (!silent) setPhase((p) => (p === 'listening' ? 'ready' : p));
  };

  const runDemoFallback = () => {
    setPhase('listening');
    setStatusMsg('Listeningâ€¦ speak naturally. (Demo mode if mic unavailable)');
    setSeconds(0);
    setTranscript('');
    timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    demoTimerRef.current = window.setTimeout(() => {
      clearTimers();
      setTranscript(DEMO_HINGLISH_TRANSCRIPT);
      setPhase('ready');
      setStatusMsg('We heard you. You can edit the text below, then continue.');
      setMode('voice');
    }, 2800);
  };

  const startListening = () => {
    setMode('voice');
    if (!isSpeechRecognitionSupported()) {
      runDemoFallback();
      return;
    }

    try {
      const recognizer = createSpeechRecognizer(
        language,
        (text) => {
          setTranscript(text);
          setPhase('listening');
        },
        () => {
          // On error, still deliver reliable hackathon demo transcript
          stopListening(true);
          setTranscript(DEMO_HINGLISH_TRANSCRIPT);
          setPhase('ready');
          setStatusMsg('Speech unavailable â€” using demo statement. You can edit it.');
        },
        () => {
          clearTimers();
          setPhase((p) => {
            if (p === 'listening') {
              setStatusMsg('Review what we heard, then continue.');
              return 'ready';
            }
            return p;
          });
        }
      );

      if (!recognizer) {
        runDemoFallback();
        return;
      }

      recognizerRef.current = recognizer;
      recognizer.start();
      setPhase('listening');
      setStatusMsg('Listeningâ€¦ tell SANAD what happened.');
      setSeconds(0);
      setTranscript('');
      timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);

      // Safety net for hackathon: if nothing captured, populate demo phrase
      demoTimerRef.current = window.setTimeout(() => {
        setTranscript((prev) => {
          if (!prev.trim()) {
            setStatusMsg('Using demo statement for this session. Edit if needed.');
            return DEMO_HINGLISH_TRANSCRIPT;
          }
          return prev;
        });
        try {
          recognizer.stop();
        } catch {
          /* ignore */
        }
        clearTimers();
        setPhase('ready');
      }, 6000);
    } catch {
      runDemoFallback();
    }
  };

  const handleUnderstand = async () => {
    const text = transcript.trim();
    if (!text) return;
    setPhase('processing');
    setStatusMsg('SANAD is understanding your situationâ€¦');
    try {
      const structured = await structureWorkerNarrative(text, language);
      updateDossier({
        category: structured.category,
        categoryLabel: structured.categoryLabel,
        employmentStatus: structured.employmentStatus,
        employerName: structured.employerName,
        incidentPeriod: structured.incidentPeriod,
        claimedAmount: structured.claimedAmount,
        narrativeSummary: structured.narrativeSummary,
        verbatimTranscript: text,
        facts: structured.facts,
        detectedLanguages: analyzeCodeSwitching(text).languagesIdentified,
        status: 'draft',
      });
      navigate('/situation');
    } catch {
      setPhase('ready');
      setStatusMsg('Something went wrong. Please try again.');
    }
  };

  const analysis = transcript ? analyzeCodeSwitching(transcript) : null;
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6 pb-8">
        <div className="space-y-2">
          <p className="text-label text-brand">
            Tell <span className="font-extrabold tracking-tight">SANAD</span>
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-[-0.03em]">
            {t.intake.title}
          </h1>
          <p className="text-ink-secondary leading-relaxed">
            Just speak what happened. No forms. No legal words needed. Hindi, Arabic, Urdu, English â€” or mix.
          </p>
        </div>

        <div
          className="rounded-2xl bg-brand-dark text-white px-5 py-8 sm:px-8 sm:py-10 flex flex-col items-center text-center relative overflow-hidden"
          role="region"
          aria-label="Voice intake"
        >
          <div className="absolute inset-0 glow-brand-strong pointer-events-none opacity-50" />
          <div className="relative z-10 flex flex-col items-center gap-5 w-full">
            <div
              className="sr-only"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {statusMsg}
            </div>
            <p className="text-sm text-white/70 max-w-sm">{statusMsg}</p>

            <button
              type="button"
              onClick={() => (phase === 'listening' ? stopListening() : startListening())}
              className={`relative w-32 h-32 sm:w-36 sm:h-36 rounded-full flex items-center justify-center transition-transform cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                phase === 'listening'
                  ? 'bg-white scale-105'
                  : 'bg-brand hover:bg-brand-light'
              }`}
              aria-label={phase === 'listening' ? 'Stop listening' : 'Start speaking'}
            >
              {phase === 'listening' && (
                <span className="absolute inset-0 rounded-full border-4 border-white/40 animate-ping" />
              )}
              <span
                className={`material-symbols-outlined text-5xl sm:text-6xl filled relative z-10 ${
                  phase === 'listening' ? 'text-brand-dark' : 'text-white'
                }`}
              >
                {phase === 'listening' ? 'stop' : 'mic'}
              </span>
            </button>

            <div className="flex items-center gap-2 text-sm font-medium">
              {phase === 'listening' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  <span>Listening Â· {mm}:{ss}</span>
                </>
              )}
              {phase === 'processing' && <span>Understandingâ€¦</span>}
              {phase === 'ready' && transcript && <Badge tone="success">Ready to continue</Badge>}
              {phase === 'idle' && <span className="text-white/60">Tap mic to speak</span>}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant="inverse"
                size="lg"
                leftIcon="mic"
                onClick={startListening}
                disabled={phase === 'listening' || phase === 'processing'}
              >
                Speak to SANAD
              </Button>
              <Button
                variant="outlineInverse"
                size="lg"
                leftIcon="keyboard"
                onClick={() => {
                  stopListening(true);
                  setMode('text');
                  setPhase('ready');
                  setStatusMsg('Type what happened in your own words.');
                }}
              >
                Type instead
              </Button>
            </div>
          </div>
        </div>

        {(mode === 'text' || transcript || phase === 'ready') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="sanad-transcript" className="text-sm font-semibold text-ink">
                What you said
              </label>
              {analysis && analysis.languagesIdentified.length > 0 && (
                <Badge tone="info">Mixed language OK</Badge>
              )}
            </div>
            <TextArea
              id="sanad-transcript"
              value={transcript}
              onChange={(e) => {
                setTranscript(e.target.value);
                if (e.target.value.trim()) setPhase('ready');
              }}
              placeholder='Example: Meri job chali gayi hai aur August ka salary nahi mila.'
              className="min-h-[120px] text-base"
              aria-label="Editable transcript"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                fullWidth
                size="lg"
                loading={phase === 'processing'}
                disabled={!transcript.trim() || phase === 'processing'}
                onClick={handleUnderstand}
                rightIcon="arrow_forward"
              >
                SANAD, understand this
              </Button>
              <Button
                variant="outline"
                fullWidth
                size="lg"
                leftIcon="volume_up"
                disabled={!transcript.trim()}
                onClick={() => speakText(transcript, language)}
              >
                Hear it back
              </Button>
            </div>
          </div>
        )}

        <HumanHelpCard compact />
      </div>
    </AppShell>
  );
};
