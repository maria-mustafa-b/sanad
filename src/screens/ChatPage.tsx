import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppShell } from '../layouts/AppShell';
import { Button } from '../components/ui/Button';
import { TextArea } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { HumanHelpCard } from '../components/HumanHelpCard';
import {
  DEMO_HINGLISH_TRANSCRIPT,
  VoiceCaptureSession,
  analyzeCodeSwitching,
  isSpeechRecognitionSupported,
  speakText,
} from '../services/speechService';
import { structureWorkerNarrative } from '../services/aiService';
import {
  analysisToDossierPatch,
  createClaimFromText,
  understandSituation,
} from '../services/sanadApi';
import { ApiError } from '../services/apiClient';

type Phase = 'idle' | 'listening' | 'processing' | 'ready';

/**
 * Voice-first intake — mic stays open until the worker taps stop.
 */
export const ChatPage: React.FC = () => {
  const { navigate, language, updateDossier, t } = useApp();
  const [phase, setPhase] = useState<Phase>('idle');
  const [transcript, setTranscript] = useState('');
  const [mode, setMode] = useState<'voice' | 'text'>('voice');
  const [statusMsg, setStatusMsg] = useState(
    'Tap Speak to SANAD, then talk. Tap the mic again when you are done.'
  );
  const [seconds, setSeconds] = useState(0);

  const sessionRef = useRef<VoiceCaptureSession | null>(null);
  const timerRef = useRef<number | null>(null);
  const transcriptRef = useRef('');
  const phaseRef = useRef<Phase>('idle');

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    return () => {
      sessionRef.current?.stop();
      sessionRef.current = null;
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const clearTimer = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const goReady = (text: string, msg: string) => {
    clearTimer();
    sessionRef.current?.stop();
    sessionRef.current = null;
    const finalText = text.trim();
    setTranscript(finalText);
    transcriptRef.current = finalText;
    setPhase('ready');
    phaseRef.current = 'ready';
    setStatusMsg(msg);
  };

  const startListening = () => {
    if (phaseRef.current === 'listening' || phaseRef.current === 'processing') return;

    sessionRef.current?.stop();
    sessionRef.current = null;
    clearTimer();

    setMode('voice');
    setTranscript('');
    transcriptRef.current = '';
    setSeconds(0);

    if (!isSpeechRecognitionSupported()) {
      setStatusMsg('This browser cannot listen — loading demo statement.');
      setPhase('listening');
      phaseRef.current = 'listening';
      timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
      window.setTimeout(() => {
        goReady(DEMO_HINGLISH_TRANSCRIPT, 'Demo statement ready. Edit if needed, then continue.');
      }, 1500);
      return;
    }

    setPhase('listening');
    phaseRef.current = 'listening';
    setStatusMsg('Listening… speak now. Tap the red mic when you finish.');
    timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);

    const session = new VoiceCaptureSession(language, {
      onPartial: (text) => {
        setTranscript(text);
        transcriptRef.current = text;
      },
      onListeningChange: (listening) => {
        if (listening && phaseRef.current === 'listening') {
          setStatusMsg('Listening… speak now. Tap the mic when you finish.');
        }
      },
      onFatalError: (code) => {
        console.warn('Voice capture fatal:', code);
        // Keep UX moving — offer demo text but explain why
        goReady(
          DEMO_HINGLISH_TRANSCRIPT,
          code === 'not-allowed' || code === 'service-not-allowed'
            ? 'Microphone blocked. Allow mic access, or edit the demo statement below.'
            : 'Could not keep the mic open. Demo statement loaded — edit or try again.'
        );
      },
    });

    sessionRef.current = session;
    session.start();
  };

  const stopListening = () => {
    if (phaseRef.current !== 'listening') return;
    const heard = (sessionRef.current?.transcript || transcriptRef.current).trim();
    sessionRef.current?.stop();
    sessionRef.current = null;
    goReady(
      heard,
      heard
        ? 'Review what we heard, then continue.'
        : 'Nothing was heard yet. Type below, use the demo phrase, or tap Speak again.'
    );
  };

  const handleUnderstand = async () => {
    const text = transcript.trim();
    if (!text) return;
    setPhase('processing');
    phaseRef.current = 'processing';
    setStatusMsg('SANAD is understanding your situation…');
    try {
      const result = await understandSituation(text);
      let claimId: string | undefined;
      try {
        const claim = await createClaimFromText(text);
        claimId = claim.id;
      } catch {
        /* optional */
      }
      updateDossier(analysisToDossierPatch(text, result, claimId));
      navigate('/situation');
    } catch (err) {
      console.error(err);
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
        phaseRef.current = 'ready';
        setStatusMsg(
          err instanceof ApiError
            ? err.message
            : 'Could not reach SANAD AI. Please try again.'
        );
      }
    }
  };

  const useDemoPhrase = () => {
    sessionRef.current?.stop();
    sessionRef.current = null;
    setMode('voice');
    goReady(DEMO_HINGLISH_TRANSCRIPT, 'Demo statement loaded. You can edit it, then continue.');
  };

  const analysis = transcript ? analyzeCodeSwitching(transcript) : null;
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  const showTranscript = mode === 'text' || Boolean(transcript) || phase === 'ready' || phase === 'listening';

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
            Speak freely. The mic stays on until you tap it again to stop.
          </p>
        </div>

        <div
          className="rounded-2xl bg-brand-dark text-white px-5 py-8 sm:px-8 sm:py-10 flex flex-col items-center text-center relative overflow-hidden"
          role="region"
          aria-label="Voice intake"
        >
          <div className="absolute inset-0 glow-brand-strong pointer-events-none opacity-50" />
          <div className="relative z-10 flex flex-col items-center gap-5 w-full">
            <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
              {statusMsg}
            </div>
            <p className="text-sm text-white/80 max-w-md leading-relaxed">{statusMsg}</p>

            <button
              type="button"
              disabled={phase === 'processing'}
              onClick={() => {
                if (phase === 'listening') stopListening();
                else startListening();
              }}
              className={`relative w-36 h-36 sm:w-40 sm:h-40 rounded-full flex items-center justify-center transition-transform cursor-pointer shadow-elev focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:opacity-60 ${
                phase === 'listening'
                  ? 'bg-red-500 scale-105 ring-4 ring-red-300/40'
                  : 'bg-brand hover:bg-brand-light active:scale-95'
              }`}
              aria-label={phase === 'listening' ? 'Stop listening' : 'Start speaking to SANAD'}
            >
              {phase === 'listening' && (
                <span className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping pointer-events-none" />
              )}
              <span className="material-symbols-outlined text-6xl filled relative z-10 pointer-events-none text-white">
                {phase === 'listening' ? 'stop' : 'mic'}
              </span>
            </button>

            <div className="flex items-center gap-2 text-sm font-medium min-h-[1.5rem]">
              {phase === 'listening' && (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />
                  <span className="font-semibold">
                    Mic is on · {mm}:{ss} · tap to stop
                  </span>
                </>
              )}
              {phase === 'processing' && <span>Understanding…</span>}
              {phase === 'ready' && transcript && <Badge tone="success">Ready to continue</Badge>}
              {phase === 'idle' && <span className="text-white/60">Tap to start</span>}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {phase === 'listening' ? (
                <Button variant="inverse" size="lg" leftIcon="stop" onClick={stopListening}>
                  I&apos;m done speaking
                </Button>
              ) : (
                <Button
                  variant="inverse"
                  size="lg"
                  leftIcon="mic"
                  disabled={phase === 'processing'}
                  onClick={startListening}
                >
                  Speak to SANAD
                </Button>
              )}
              <Button
                variant="outlineInverse"
                size="lg"
                leftIcon="keyboard"
                disabled={phase === 'listening'}
                onClick={() => {
                  sessionRef.current?.stop();
                  sessionRef.current = null;
                  clearTimer();
                  setMode('text');
                  setPhase('ready');
                  phaseRef.current = 'ready';
                  setStatusMsg('Type what happened in your own words.');
                }}
              >
                Type instead
              </Button>
              <Button
                variant="outlineInverse"
                size="lg"
                leftIcon="record_voice_over"
                disabled={phase === 'listening'}
                onClick={useDemoPhrase}
              >
                Use demo phrase
              </Button>
            </div>
          </div>
        </div>

        {showTranscript && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="sanad-transcript" className="text-sm font-semibold text-ink">
                {phase === 'listening' ? 'Hearing you…' : 'What you said'}
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
                transcriptRef.current = e.target.value;
                if (e.target.value.trim() && phase !== 'listening') {
                  setPhase('ready');
                  phaseRef.current = 'ready';
                }
              }}
              placeholder="Your words will appear here as you speak…"
              className="min-h-[120px] text-base"
              aria-label="Editable transcript"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                fullWidth
                size="lg"
                loading={phase === 'processing'}
                disabled={!transcript.trim() || phase === 'processing' || phase === 'listening'}
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
                disabled={!transcript.trim() || phase === 'listening'}
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
