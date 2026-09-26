import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { TextArea } from '../components/ui/Input';
import {
  DEMO_HINGLISH_TRANSCRIPT,
  VoiceCaptureSession,
  analyzeCodeSwitching,
  isSpeechRecognitionSupported,
} from '../services/speechService';
import { structureWorkerNarrative } from '../services/aiService';
import {
  analysisToDossierPatch,
  createClaimFromText,
  understandVoiceTranscript,
} from '../services/sanadApi';
import { ApiError } from '../services/apiClient';

type Phase = 'listening' | 'review' | 'processing';

export const VoicePage: React.FC = () => {
  const { navigate, language, updateDossier } = useApp();
  const [phase, setPhase] = useState<Phase>('listening');
  const [transcript, setTranscript] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState("Listening… speak freely, then tap I'm done");

  const sessionRef = useRef<VoiceCaptureSession | null>(null);
  const timerRef = useRef<number | null>(null);
  const transcriptRef = useRef('');
  const phaseRef = useRef<Phase>('listening');

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    setPhase('listening');
    phaseRef.current = 'listening';
    setSeconds(0);
    setTranscript('');
    transcriptRef.current = '';
    timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);

    if (!isSpeechRecognitionSupported()) {
      setStatus('No speech recognition — demo loads when you tap done');
      return () => {
        if (timerRef.current) window.clearInterval(timerRef.current);
      };
    }

    const session = new VoiceCaptureSession(language, {
      onPartial: (text) => {
        setTranscript(text);
        transcriptRef.current = text;
      },
      onListeningChange: () => {},
      onFatalError: (code) => {
        setStatus(
          code === 'not-allowed'
            ? 'Mic blocked — tap done to use demo text'
            : 'Mic issue — tap done to continue with demo'
        );
      },
    });
    sessionRef.current = session;
    session.start();
    setStatus("Listening… speak freely, then tap I'm done");

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      sessionRef.current?.stop();
      sessionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finishListening = () => {
    const heard = (sessionRef.current?.transcript || transcriptRef.current).trim();
    sessionRef.current?.stop();
    sessionRef.current = null;
    if (timerRef.current) window.clearInterval(timerRef.current);
    const finalText = heard || DEMO_HINGLISH_TRANSCRIPT;
    setTranscript(finalText);
    transcriptRef.current = finalText;
    setPhase('review');
    phaseRef.current = 'review';
    setStatus(heard ? 'Review your words, then continue' : 'Demo transcript ready — edit if needed');
  };

  const continueToSituation = async () => {
    const text = transcript.trim() || DEMO_HINGLISH_TRANSCRIPT;
    setPhase('processing');
    phaseRef.current = 'processing';
    setStatus('SANAD is understanding…');
    try {
      const result = await understandVoiceTranscript(text);
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
        setPhase('review');
        phaseRef.current = 'review';
        setStatus(
          err instanceof ApiError ? err.message : 'Could not reach SANAD AI. Please try again.'
        );
      }
    }
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className="min-h-screen bg-brand-dark text-white flex flex-col">
      <header className="px-4 h-14 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            sessionRef.current?.stop();
            navigate('/chat');
          }}
          className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-white/10 cursor-pointer !text-white"
          aria-label="Close"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <span className="text-sm font-semibold tracking-tight">
          <span className="font-extrabold">SANAD</span> · Voice
        </span>
        <span className="w-11" />
      </header>

      <div className="sr-only" role="status" aria-live="assertive" aria-atomic="true">
        {status}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
        <div
          className={`w-40 h-40 rounded-full flex items-center justify-center ${
            phase === 'listening' ? 'bg-red-500 animate-pulse ring-4 ring-red-300/40' : 'bg-brand'
          }`}
        >
          <span className="material-symbols-outlined text-6xl filled text-white">
            {phase === 'processing' ? 'psychology' : phase === 'listening' ? 'mic' : 'check'}
          </span>
        </div>

        <div className="text-center space-y-1">
          <p className="text-lg font-semibold">{status}</p>
          {phase === 'listening' && (
            <p className="text-white/60 font-mono text-sm">
              Mic on · {mm}:{ss}
            </p>
          )}
        </div>

        {(phase === 'listening' || phase === 'review' || phase === 'processing') && (
          <div className="w-full max-w-lg">
            <label className="block text-sm text-white/70 mb-2">Your words</label>
            <TextArea
              value={transcript}
              onChange={(e) => {
                setTranscript(e.target.value);
                transcriptRef.current = e.target.value;
              }}
              className="bg-white/10 border-white/25 !text-white placeholder:text-white/40 min-h-[120px]"
              placeholder="Speak — words appear here…"
            />
          </div>
        )}
      </div>

      <div className="p-4 pb-8 flex gap-3 max-w-lg mx-auto w-full">
        <Button
          variant="outlineInverse"
          fullWidth
          onClick={() => {
            sessionRef.current?.stop();
            navigate('/chat');
          }}
        >
          Cancel
        </Button>
        {phase === 'listening' ? (
          <Button variant="inverse" fullWidth leftIcon="stop" onClick={finishListening}>
            I&apos;m done speaking
          </Button>
        ) : (
          <Button
            variant="inverse"
            fullWidth
            loading={phase === 'processing'}
            onClick={continueToSituation}
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
};
