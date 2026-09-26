"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { TextArea } from '../components/ui/Input';
import {
  DEMO_HINGLISH_TRANSCRIPT,
  analyzeCodeSwitching,
  createSpeechRecognizer,
  isSpeechRecognitionSupported,
} from '../services/speechService';
import { structureWorkerNarrative } from '../services/aiService';

type Phase = 'listening' | 'review' | 'processing';

/** Immersive voice capture â€” always lands on the Hinglish demo if SR fails */
export const VoicePage: React.FC = () => {
  const { navigate, language, updateDossier } = useApp();
  const [phase, setPhase] = useState<Phase>('listening');
  const [transcript, setTranscript] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState('Listeningâ€¦ speak freely');
  const recognizerRef = useRef<ReturnType<typeof createSpeechRecognizer>>(null);
  const timerRef = useRef<number | null>(null);
  const demoRef = useRef<number | null>(null);

  const cleanup = () => {
    try {
      recognizerRef.current?.stop?.();
    } catch {
      /* ignore */
    }
    recognizerRef.current = null;
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (demoRef.current) window.clearTimeout(demoRef.current);
    timerRef.current = null;
    demoRef.current = null;
  };

  const finishWith = (text: string, msg: string) => {
    cleanup();
    setTranscript(text);
    setStatus(msg);
    setPhase('review');
  };

  useEffect(() => {
    setPhase('listening');
    setSeconds(0);
    setTranscript('');
    setStatus('Listeningâ€¦ tell SANAD what happened');
    timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);

    if (!isSpeechRecognitionSupported()) {
      demoRef.current = window.setTimeout(() => {
        finishWith(DEMO_HINGLISH_TRANSCRIPT, 'Demo transcript ready â€” edit if you need to');
      }, 2800);
      return cleanup;
    }

    try {
      const recognizer = createSpeechRecognizer(
        language,
        (text) => setTranscript(text),
        () => finishWith(DEMO_HINGLISH_TRANSCRIPT, 'Mic unavailable â€” demo statement loaded'),
        () => {
          setTranscript((prev) => {
            const finalText = prev.trim() || DEMO_HINGLISH_TRANSCRIPT;
            setStatus('Review your words, then continue');
            setPhase('review');
            return finalText;
          });
          if (timerRef.current) window.clearInterval(timerRef.current);
        }
      );
      if (!recognizer) {
        demoRef.current = window.setTimeout(() => {
          finishWith(DEMO_HINGLISH_TRANSCRIPT, 'Demo transcript ready');
        }, 2800);
        return cleanup;
      }
      recognizerRef.current = recognizer;
      recognizer.start();
      demoRef.current = window.setTimeout(() => {
        setTranscript((prev) => {
          if (!prev.trim()) {
            try {
              recognizer.stop();
            } catch {
              /* ignore */
            }
            finishWith(DEMO_HINGLISH_TRANSCRIPT, 'Demo transcript ready â€” edit if you need to');
            return DEMO_HINGLISH_TRANSCRIPT;
          }
          try {
            recognizer.stop();
          } catch {
            /* ignore */
          }
          return prev;
        });
      }, 5500);
    } catch {
      demoRef.current = window.setTimeout(() => {
        finishWith(DEMO_HINGLISH_TRANSCRIPT, 'Demo transcript ready');
      }, 2800);
    }

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const continueToSituation = async () => {
    const text = transcript.trim() || DEMO_HINGLISH_TRANSCRIPT;
    setPhase('processing');
    setStatus('SANAD is understandingâ€¦');
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
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className="min-h-screen bg-brand-dark text-white flex flex-col">
      <header className="px-4 h-14 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            cleanup();
            navigate('/chat');
          }}
          className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-white/10 cursor-pointer !text-white"
          aria-label="Close"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <span className="text-sm font-semibold tracking-tight">
          <span className="font-extrabold">SANAD</span> Â· Voice
        </span>
        <span className="w-11" />
      </header>

      <div
        className="sr-only"
        role="status"
        aria-live="assertive"
        aria-atomic="true"
      >
        {status}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
        <div className="relative">
          <div
            className={`w-40 h-40 rounded-full bg-brand flex items-center justify-center ${
              phase === 'listening' ? 'animate-pulse ring-4 ring-white/25' : ''
            }`}
          >
            <span className="material-symbols-outlined text-6xl filled text-white">
              {phase === 'processing' ? 'psychology' : 'mic'}
            </span>
          </div>
        </div>

        <div className="text-center space-y-1">
          <p className="text-lg font-semibold">{status}</p>
          {phase === 'listening' && (
            <p className="text-white/60 font-mono text-sm">
              {mm}:{ss}
            </p>
          )}
        </div>

        {(phase === 'review' || phase === 'processing') && (
          <div className="w-full max-w-lg">
            <label className="block text-sm text-white/70 mb-2">Your words (editable)</label>
            <TextArea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="bg-white/10 border-white/25 !text-white placeholder:text-white/40 min-h-[120px]"
            />
          </div>
        )}
      </div>

      <div className="p-4 pb-8 flex gap-3 max-w-lg mx-auto w-full">
        <Button
          variant="outlineInverse"
          fullWidth
          onClick={() => {
            cleanup();
            navigate('/chat');
          }}
        >
          Cancel
        </Button>
        <Button
          variant="inverse"
          fullWidth
          loading={phase === 'processing'}
          disabled={phase === 'listening'}
          onClick={continueToSituation}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
