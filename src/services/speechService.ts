import { LanguageCode } from '../types';

/** Hackathon demo fallback when browser speech recognition is unavailable */
export const DEMO_HINGLISH_TRANSCRIPT =
  'Meri job chali gayi hai aur August ka salary nahi mila.';

export interface CodeSwitchAnalysis {
  primarySyntax: string;
  detectedLoans: { word: string; category: string }[];
  languagesIdentified: string[];
  confidence: number;
}

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
};

export type VoiceCaptureHandlers = {
  onPartial: (text: string) => void;
  onListeningChange: (listening: boolean) => void;
  onFatalError: (code: string) => void;
};

/**
 * Keeps the mic open until stop() is called.
 * Chrome often fires onend after a few seconds — we auto-restart while active.
 */
export class VoiceCaptureSession {
  private recognition: SpeechRecognitionLike | null = null;
  private committed = '';
  private active = false;
  private intentionalStop = false;
  private restarting = false;
  private handlers: VoiceCaptureHandlers;
  private lang: LanguageCode;

  constructor(lang: LanguageCode, handlers: VoiceCaptureHandlers) {
    this.lang = lang;
    this.handlers = handlers;
  }

  get isSupported() {
    return isSpeechRecognitionSupported();
  }

  get transcript() {
    return this.committed;
  }

  start() {
    if (!isSpeechRecognitionSupported()) {
      this.handlers.onFatalError('not-supported');
      return;
    }
    this.active = true;
    this.intentionalStop = false;
    this.committed = '';
    this.bootRecognizer();
  }

  /** User tapped stop — end session and keep whatever we heard */
  stop() {
    this.intentionalStop = true;
    this.active = false;
    this.teardownRecognizer();
    this.handlers.onListeningChange(false);
  }

  private bootRecognizer() {
    this.teardownRecognizer();

    const SpeechRecognitionConstructor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition: SpeechRecognitionLike = new SpeechRecognitionConstructor();

    const langMap: Record<LanguageCode, string> = {
      en: 'en-IN',
      ar: 'ar-AE',
      hi: 'hi-IN',
      ur: 'en-IN',
      bn: 'en-IN',
    };

    // continuous=false + auto-restart is more stable in Chrome than continuous=true
    recognition.lang = langMap[this.lang] || 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      this.restarting = false;
      this.handlers.onListeningChange(true);
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const piece = event.results[i][0]?.transcript || '';
        if (event.results[i].isFinal) {
          this.committed = `${this.committed} ${piece}`.trim();
        } else {
          interim += piece;
        }
      }
      const display = `${this.committed} ${interim}`.trim();
      if (display) this.handlers.onPartial(display);
    };

    recognition.onerror = (event: any) => {
      const code = String(event?.error || 'error');
      // Soft / expected — keep session alive; onend will restart
      if (
        code === 'no-speech' ||
        code === 'aborted' ||
        code === 'speech-timeout'
      ) {
        return;
      }
      if (
        code === 'not-allowed' ||
        code === 'service-not-allowed' ||
        code === 'audio-capture'
      ) {
        this.active = false;
        this.handlers.onFatalError(code);
        return;
      }
      // network etc. — try restart via onend if still active
      console.warn('Speech recognition error:', code);
    };

    recognition.onend = () => {
      if (!this.active || this.intentionalStop) {
        this.handlers.onListeningChange(false);
        return;
      }
      // Chrome ended the segment — immediately start again so the user can keep talking
      this.restarting = true;
      window.setTimeout(() => {
        if (!this.active || this.intentionalStop) return;
        try {
          recognition.start();
        } catch (e) {
          // InvalidStateError if already started — ignore; otherwise rebuild
          console.warn('Speech restart failed, rebuilding', e);
          try {
            this.bootRecognizer();
          } catch {
            this.active = false;
            this.handlers.onFatalError('restart-failed');
          }
        }
      }, 80);
    };

    this.recognition = recognition;
    try {
      recognition.start();
    } catch (e) {
      console.warn('Speech start failed', e);
      this.active = false;
      this.handlers.onFatalError('start-failed');
    }
  }

  private teardownRecognizer() {
    const rec = this.recognition;
    this.recognition = null;
    if (!rec) return;
    try {
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
      rec.onstart = null;
      rec.abort();
    } catch {
      try {
        rec.stop();
      } catch {
        /* ignore */
      }
    }
  }
}

export const isSpeechRecognitionSupported = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  );
};

export const isSpeechSynthesisSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

/** Legacy helper — prefer VoiceCaptureSession for intake */
export const requestMicrophoneAccess = async (): Promise<boolean> => {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    return false;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Keep tracks briefly so Chrome permission sticks; stop after SpeechRecognition can attach
    window.setTimeout(() => stream.getTracks().forEach((t) => t.stop()), 1500);
    return true;
  } catch {
    return false;
  }
};

/** @deprecated use VoiceCaptureSession */
export const createSpeechRecognizer = (
  lang: LanguageCode,
  onResult: (transcript: string, isFinal: boolean) => void,
  onError: (err: string) => void,
  onEnd: () => void
): SpeechRecognitionLike | null => {
  if (!isSpeechRecognitionSupported()) return null;
  const session = {
    _s: null as VoiceCaptureSession | null,
  };
  void session;
  const SpeechRecognitionConstructor =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition: SpeechRecognitionLike = new SpeechRecognitionConstructor();
  recognition.lang = 'en-IN';
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  let committed = '';
  recognition.onresult = (event: any) => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const piece = event.results[i][0]?.transcript || '';
      if (event.results[i].isFinal) committed = `${committed} ${piece}`.trim();
      else interim += piece;
    }
    const display = `${committed} ${interim}`.trim();
    if (display) onResult(display, !interim && Boolean(committed));
  };
  recognition.onerror = (event: any) => {
    const code = String(event?.error || 'error');
    if (code === 'aborted' || code === 'no-speech') return;
    onError(code);
  };
  recognition.onend = () => onEnd();
  return recognition;
};

export const speakText = (text: string, lang: LanguageCode) => {
  if (!isSpeechSynthesisSupported()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const langMap: Record<LanguageCode, string> = {
    en: 'en-US',
    ar: 'ar-XA',
    hi: 'hi-IN',
    ur: 'ur-PK',
    bn: 'bn-BD',
  };
  utterance.lang = langMap[lang] || 'en-US';
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if (isSpeechSynthesisSupported()) window.speechSynthesis.cancel();
};

export const analyzeCodeSwitching = (text: string): CodeSwitchAnalysis => {
  const lower = text.toLowerCase();
  const detectedLoans: { word: string; category: string }[] = [];
  const languages = new Set<string>();

  const arabicTerms = [
    { word: 'kafeel', category: 'Arabic loan: كفيل (Sponsor)' },
    { word: 'iqama', category: 'Arabic loan: إقامة (Residency)' },
    { word: 'shurti', category: 'Arabic loan: شرطي (Police)' },
    { word: 'tasreeh', category: 'Arabic loan: تصريح (Permit)' },
    { word: 'khedmah', category: 'Arabic loan: نهاية الخدمة (End of Service)' },
    { word: 'mushkila', category: 'Arabic loan: مشكلة (Grievance/Problem)' },
    { word: 'maktab', category: 'Arabic loan: مكتب (Labour Office)' },
  ];

  const southAsianTerms = [
    { word: 'mera', category: 'Hindi/Urdu: मेरा (My)' },
    { word: 'meri', category: 'Hindi/Urdu: मेरी (My)' },
    { word: 'pagar', category: 'Hindi/Urdu loan: पगार (Salary/Wage)' },
    { word: 'chutti', category: 'Hindi/Urdu loan: छुट्टी (Leave/Vacation)' },
    { word: 'nahi', category: 'Hindi/Urdu: नहीं (Denial/Negative)' },
    { word: 'nahi mila', category: 'Hindi/Urdu: नहीं मिला (Did not receive)' },
    { word: 'chali gayi', category: 'Hindi/Urdu: चली गई (Gone / ended)' },
    { word: 'job', category: 'English loan in Hinglish: job' },
    { word: 'amar', category: 'Bengali: আমার (My)' },
    { word: 'beton', category: 'Bengali: বেতন (Wage)' },
    { word: 'taka', category: 'Bengali: টাকা (Money)' },
  ];

  const englishIntentTerms = [
    'salary', 'passport', 'months', 'company', 'grievance', 'help', 'urgent',
    'contract', 'court', 'visa', 'august', 'job',
  ];

  for (const item of arabicTerms) {
    if (lower.includes(item.word)) {
      detectedLoans.push(item);
      languages.add('Arabic dialect');
    }
  }
  for (const item of southAsianTerms) {
    if (lower.includes(item.word)) {
      detectedLoans.push(item);
      languages.add('Hindi / Urdu / Bengali');
    }
  }
  for (const word of englishIntentTerms) {
    if (lower.includes(word)) {
      detectedLoans.push({ word, category: 'English legal intent' });
      languages.add('English');
    }
  }
  if (/[\u0600-\u06FF]/.test(text)) languages.add('Arabic / Urdu Script');
  if (/[\u0900-\u097F]/.test(text)) languages.add('Devanagari (Hindi) Script');
  if (/[\u0980-\u09FF]/.test(text)) languages.add('Bengali Script');

  return {
    primarySyntax: languages.size > 1 ? 'Multilingual Code-Switching' : 'Monolingual Utterance',
    detectedLoans,
    languagesIdentified: Array.from(languages),
    confidence: Math.min(0.99, 0.88 + detectedLoans.length * 0.03),
  };
};
