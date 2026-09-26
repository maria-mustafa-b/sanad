import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { StepTracker } from '../components/StepTracker';
import { 
  createSpeechRecognizer, 
  isSpeechRecognitionSupported, 
  speakText, 
  analyzeCodeSwitching,
  CodeSwitchAnalysis
} from '../services/speechService';
import { structureWorkerNarrative } from '../services/aiService';

export const VoiceIntakeView: React.FC = () => {
  const { t, language, navigate, updateDossier, activeDossier, setActiveStep } = useApp();

  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(18);
  const [transcriptText, setTranscriptText] = useState(activeDossier.verbatimTranscript);
  const [textInput, setTextInput] = useState('');
  const [analysis, setAnalysis] = useState<CodeSwitchAnalysis>(() => analyzeCodeSwitching(activeDossier.verbatimTranscript));
  const [isProcessing, setIsProcessing] = useState(false);
  const [empatheticResponse, setEmpatheticResponse] = useState({
    native: "SANAD is actively listening to your grievance. Once you finish, we will structure your statement into legal facts.",
    english: "AI Advocate is actively analyzing your statement for relevant legal claims..."
  });

  const recognizerRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const initialTextRef = useRef<string>('');

  useEffect(() => {
    setActiveStep(1);
    setAnalysis(analyzeCodeSwitching(transcriptText));
  }, [transcriptText, setActiveStep]);

  const startVoiceRecording = () => {
    if (!isSpeechRecognitionSupported()) {
      alert("Microphone recognition is not directly supported in this browser. Please use text input or speech simulation.");
      simulateRecording();
      return;
    }

    try {
      initialTextRef.current = transcriptText;
      const recognizer = createSpeechRecognizer(
        language,
        (text) => {
          const combined = initialTextRef.current ? initialTextRef.current + ' ' + text : text;
          setTranscriptText(combined);
          setAnalysis(analyzeCodeSwitching(combined));
        },
        (err) => {
          console.warn('Speech error:', err);
          setIsRecording(false);
        },
        () => {
          setIsRecording(false);
        }
      );

      if (recognizer) {
        recognizerRef.current = recognizer;
        recognizer.start();
        setIsRecording(true);
        setRecordingSeconds(0);
        timerRef.current = setInterval(() => {
          setRecordingSeconds(prev => prev + 1);
        }, 1000);
      }
    } catch {
      simulateRecording();
    }
  };

  const stopVoiceRecording = () => {
    if (recognizerRef.current) {
      try {
        recognizerRef.current.stop();
      } catch {
        // ignore
      }
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
  };

  const simulateRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    timerRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);

    setTimeout(() => {
      stopVoiceRecording();
      const simulated = "Mera kafeel passport return nahi kar raha hai aur 2 months ki salary pending hai, can SANAD help me file urgent grievance?";
      setTranscriptText(simulated);
      setAnalysis(analyzeCodeSwitching(simulated));
    }, 4000);
  };

  const handleUsePreset = (phrase: string) => {
    setTranscriptText(phrase);
    setAnalysis(analyzeCodeSwitching(phrase));
    speakText(phrase, language);
  };

  const handleApplyTextInput = () => {
    if (!textInput.trim()) return;
    setTranscriptText(textInput);
    setAnalysis(analyzeCodeSwitching(textInput));
    setTextInput('');
  };

  const handleProceedToStructuring = async () => {
    setIsProcessing(true);
    try {
      const structured = await structureWorkerNarrative(transcriptText, language);
      updateDossier({
        category: structured.category,
        categoryLabel: structured.categoryLabel,
        employmentStatus: structured.employmentStatus,
        employerName: structured.employerName,
        incidentPeriod: structured.incidentPeriod,
        claimedAmount: structured.claimedAmount,
        narrativeSummary: structured.narrativeSummary,
        verbatimTranscript: transcriptText,
        facts: structured.facts,
        status: 'draft',
      });
      navigate('/processing');
    } catch (e) {
      console.error(e);
      navigate('/processing');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlayResponse = () => {
    speakText(empatheticResponse.native, language);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 6-Step Stepper Header */}
      <StepTracker currentStepIndex={1} />

      {/* Page Title & Orientation */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold mb-3">
          <span className="material-symbols-outlined text-[15px] text-tertiary">mic_none</span>
          <span>Natural Conversational Intake • Screen 02-04</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold text-on-surface tracking-tight leading-tight">
          {t.intake.title}
        </h1>
        <p className="text-base sm:text-lg text-on-surface-variant mt-2 leading-relaxed">
          {t.intake.subtitle}
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Conversational Voice & Input Workspace */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Sanctuary Audio Card */}
          <div className="bg-surface-container rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Top Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
              <div className="flex items-center gap-2.5">
                <span className={`w-3 h-3 rounded-full ${isRecording ? 'bg-primary animate-ping' : 'bg-primary'}`}></span>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  {isRecording ? t.intake.micStatusActive : t.intake.micStatusIdle}
                </span>
                <span className="text-xs text-on-surface-variant font-mono">
                  {String(Math.floor(recordingSeconds / 60)).padStart(2, '0')}:
                  {String(recordingSeconds % 60).padStart(2, '0')} {t.intake.recordingTime}
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-surface-container-high px-3 py-1 rounded-full text-xs font-medium text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-tertiary">graphic_eq</span>
                <span>{t.intake.noiseReduction}</span>
              </div>
            </div>

            {/* Interactive Audio Waveform Visualizer */}
            <div className="bg-surface-container-lowest/80 rounded-xl p-5 mb-6 shadow-sm relative z-10">
              <div className="flex items-center justify-between mb-3 text-xs text-on-surface-variant">
                <span className="font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-primary">hearing</span>
                  <span>{t.intake.waveformTitle}</span>
                </span>
                <span className="font-mono text-[11px] text-secondary">
                  48.0 kHz • Live Multi-Token Stream
                </span>
              </div>

              {/* Rhythmic Organic Waveform Bars */}
              <div className="w-full h-16 flex items-center justify-between gap-1 sm:gap-1.5 px-2">
                <div className={`w-1.5 bg-primary/30 rounded-full h-4 ${isRecording ? 'animate-pulse' : ''}`}></div>
                <div className={`w-1.5 bg-primary/40 rounded-full h-8 ${isRecording ? 'animate-pulse' : ''}`}></div>
                <div className={`w-1.5 bg-primary/70 rounded-full h-12 ${isRecording ? 'animate-pulse' : ''}`}></div>
                <div className={`w-1.5 bg-primary rounded-full h-14 ${isRecording ? 'animate-pulse' : ''}`}></div>
                <div className={`w-1.5 bg-primary rounded-full h-9 ${isRecording ? 'animate-pulse' : ''}`}></div>
                <div className={`w-1.5 bg-primary/80 rounded-full h-16 ${isRecording ? 'animate-pulse' : ''}`}></div>
                <div className={`w-1.5 bg-primary rounded-full h-11 ${isRecording ? 'animate-pulse' : ''}`}></div>
                <div className={`w-1.5 bg-primary/90 rounded-full h-13 ${isRecording ? 'animate-pulse' : ''}`}></div>
                <div className={`w-1.5 bg-primary/60 rounded-full h-7 ${isRecording ? 'animate-pulse' : ''}`}></div>
                <div className={`w-1.5 bg-primary rounded-full h-15 ${isRecording ? 'animate-pulse' : ''}`}></div>
                <div className={`w-1.5 bg-tertiary rounded-full h-14 ${isRecording ? 'animate-pulse' : ''}`}></div>
                <div className={`w-1.5 bg-tertiary-container rounded-full h-10 ${isRecording ? 'animate-pulse' : ''}`}></div>
                <div className={`w-1.5 bg-primary/90 rounded-full h-14 ${isRecording ? 'animate-pulse' : ''}`}></div>
                <div className={`w-1.5 bg-primary rounded-full h-8 ${isRecording ? 'animate-pulse' : ''}`}></div>
                <div className={`w-1.5 bg-primary/60 rounded-full h-12 ${isRecording ? 'animate-pulse' : ''}`}></div>
                <div className={`w-1.5 bg-primary/40 rounded-full h-6 ${isRecording ? 'animate-pulse' : ''}`}></div>
                <div className={`w-1.5 bg-primary/70 rounded-full h-11 ${isRecording ? 'animate-pulse' : ''}`}></div>
                <div className={`w-1.5 bg-primary rounded-full h-15 ${isRecording ? 'animate-pulse' : ''}`}></div>
                <div className={`w-1.5 bg-primary/50 rounded-full h-5 ${isRecording ? 'animate-pulse' : ''}`}></div>
                <div className={`w-1.5 bg-primary/30 rounded-full h-3 ${isRecording ? 'animate-pulse' : ''}`}></div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-1 text-[11px] text-on-surface-variant font-mono">
                <span>Confidence: {(analysis.confidence * 100).toFixed(1)}%</span>
                <span className="text-primary font-bold">{analysis.primarySyntax}</span>
              </div>
            </div>

            {/* Record / Stop Button Control */}
            <div className="flex items-center gap-3">
              <button
                onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                  isRecording 
                    ? 'bg-tertiary text-on-tertiary animate-pulse' 
                    : 'bg-primary text-on-primary hover:bg-on-primary-fixed-variant'
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {isRecording ? 'stop_circle' : 'mic'}
                </span>
                <span>{isRecording ? 'Stop Recording' : 'Start Speaking in Any Language'}</span>
              </button>
            </div>
          </div>

          {/* Conversational Turn: Worker Speech Verbatim with Code-Switching Tags */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-on-surface-variant">
              <span className="font-bold uppercase tracking-wider text-secondary">
                {t.intake.workerSpeechTitle}
              </span>
              <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-[11px] font-bold">
                {t.intake.originalAudio}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm space-y-3 border border-surface-container-high/60">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </div>
                <div className="space-y-2 flex-1">
                  <p className="font-headline text-lg text-on-surface leading-relaxed">
                    “{transcriptText}”
                  </p>

                  {/* Code-switching tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {analysis.detectedLoans.map((loan, idx) => (
                      <span key={idx} className="text-[10px] bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded-full font-bold">
                        {loan.category}
                      </span>
                    ))}
                    {analysis.languagesIdentified.map((langName, idx) => (
                      <span key={`l_${idx}`} className="text-[10px] bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded-full font-bold">
                        {langName}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => speakText(transcriptText, language)}
                  className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-all cursor-pointer"
                  title="Replay Audio"
                >
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                </button>
              </div>
            </div>
          </div>

          {/* Conversational Turn: SANAD Empathetic AI Dual Response */}
          <div className="p-5 rounded-2xl bg-primary/10 relative shadow-sm border border-primary/20 space-y-3">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <span className="material-symbols-outlined text-[20px]">shield_person</span>
              </div>
              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary uppercase tracking-wide">
                    {t.intake.advocateResponseTitle}
                  </span>
                  <span className="text-[11px] font-mono text-on-surface-variant">
                    Instant Synthetic Audio Ready
                  </span>
                </div>

                <div className="p-3.5 bg-surface-container-lowest rounded-xl shadow-xs space-y-2">
                  <p className="font-headline text-base text-on-surface leading-relaxed">
                    "{empatheticResponse.native}"
                  </p>
                  <p className="text-xs text-on-surface-variant font-medium pt-1 border-t border-surface-container">
                    <em>English synopsis:</em> "{empatheticResponse.english}"
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={handleProceedToStructuring}
                    disabled={isProcessing}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">gavel</span>
                    <span>
                      {isProcessing ? t.intake.structuringWait : 'Yes, Confirm & Structure Case'}
                    </span>
                  </button>

                  <button
                    onClick={handlePlayResponse}
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-primary text-[18px]">volume_up</span>
                    <span>🔊 Listen Audio</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Text Input Fallback Area */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary block">
              Prefer Typing or Editing?
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={t.intake.textInputFallback}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container-high"
              />
              <button
                onClick={handleApplyTextInput}
                className="px-4 py-2 bg-surface-container-highest text-on-surface rounded-xl text-xs font-bold hover:bg-surface-variant transition-colors cursor-pointer"
              >
                Apply Text
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Spoken Prompt Presets & Guidance */}
        <div className="lg:col-span-5 space-y-6">
          {/* Guidance Card */}
          <div className="p-6 rounded-2xl bg-surface-container space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-tertiary">
              <span className="material-symbols-outlined text-[18px]">support_agent</span>
              <span>Intake Guidance</span>
            </div>

            <h3 className="font-headline font-bold text-xl text-on-surface">
              Speak naturally without fear
            </h3>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              SANAD's acoustic model is built specifically for code-switched phrases common in migrant worker corridors. You can speak in Urdu, Egyptian Arabic, Hindi, Tagalog, or Bengali.
            </p>

            <div className="space-y-2 pt-2">
              <div className="p-3 rounded-xl bg-surface text-xs flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                <span>Mentions of sponsor/kafeel are categorized neutrally</span>
              </div>
              <div className="p-3 rounded-xl bg-surface text-xs flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                <span>Unpaid months are calculated automatically</span>
              </div>
              <div className="p-3 rounded-xl bg-surface text-xs flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                <span>Passport withholding is prioritized as urgent</span>
              </div>
            </div>
          </div>

          {/* Quick Preset Scenarios */}
          <div className="p-6 rounded-2xl bg-surface-container-low space-y-4 shadow-sm">
            <span className="text-xs uppercase tracking-wider text-outline font-bold block">
              Sample Voice Scenarios:
            </span>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => handleUsePreset("Mera kafeel passport return nahi kar raha hai aur 2 months ki salary pending hai, can SANAD help me file urgent grievance?")}
                className="w-full text-left p-3 rounded-xl bg-surface hover:bg-surface-container-highest transition-colors flex items-start gap-2 shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-primary text-base mt-0.5">chat</span>
                <div>
                  <strong className="text-on-surface block font-semibold">Unpaid Wages + Passport Confiscation</strong>
                  <span className="text-[11px] text-outline">Hindi/Arabic/English code-switch (August case)</span>
                </div>
              </button>

              <button
                onClick={() => handleUsePreset("كفيلي رفض دفع تذكرة العودة ومكافأة نهاية الخدمة بعد انتهاء عقدي الرسمي")}
                className="w-full text-left p-3 rounded-xl bg-surface hover:bg-surface-container-highest transition-colors flex items-start gap-2 shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-primary text-base mt-0.5">chat</span>
                <div>
                  <strong className="text-on-surface block font-semibold">End-of-Service &amp; Repatriation Ticket</strong>
                  <span className="text-[11px] text-outline">Arabic labour dispute statement</span>
                </div>
              </button>

              <button
                onClick={() => handleUsePreset("আমার কোম্পানির সাথে ২ বছরের চুক্তি শেষ হয়েছে কিন্তু তারা পাসপোর্ট দিচ্ছে না")}
                className="w-full text-left p-3 rounded-xl bg-surface hover:bg-surface-container-highest transition-colors flex items-start gap-2 shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-primary text-base mt-0.5">chat</span>
                <div>
                  <strong className="text-on-surface block font-semibold">Contract Completion &amp; Passport Retrieval</strong>
                  <span className="text-[11px] text-outline">Bengali dialect grievance</span>
                </div>
              </button>
            </div>
          </div>

          {/* Next Step Action Button */}
          <div className="p-4 rounded-xl bg-primary-fixed/40 space-y-2">
            <span className="text-xs font-bold text-primary block">Ready to confirm your story?</span>
            <p className="text-xs text-on-surface-variant">
              SANAD structures your statement into clean facts. You can edit every fact before generating proof.
            </p>
            <button
              onClick={handleProceedToStructuring}
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-opacity cursor-pointer mt-2"
            >
              <span>{isProcessing ? 'Structuring Account...' : 'Continue to Step 2: Confirm Situation'}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
