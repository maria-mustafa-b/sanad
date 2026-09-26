import { LanguageCode } from '../types';

export interface CodeSwitchAnalysis {
  primarySyntax: string;
  detectedLoans: { word: string; category: string }[];
  languagesIdentified: string[];
  confidence: number;
}

// Check for Web Speech API availability
export const isSpeechRecognitionSupported = (): boolean => {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
};

// Check for SpeechSynthesis availability
export const isSpeechSynthesisSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

// Create a SpeechRecognition instance with locale configuration
export const createSpeechRecognizer = (
  lang: LanguageCode,
  onResult: (transcript: string, isFinal: boolean) => void,
  onError: (err: any) => void,
  onEnd: () => void
) => {
  if (!isSpeechRecognitionSupported()) {
    return null;
  }

  const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognitionConstructor();

  const langMap: Record<LanguageCode, string> = {
    en: 'en-US',
    ar: 'ar-AE',
    hi: 'hi-IN',
    ur: 'ur-PK',
    bn: 'bn-BD',
  };

  recognition.lang = langMap[lang] || 'en-US';
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    const currentText = finalTranscript || interimTranscript;
    onResult(currentText, Boolean(finalTranscript));
  };

  recognition.onerror = (event: any) => {
    console.warn('Speech recognition event:', event.error);
    onError(event.error);
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
};

// Natural Voice Read-Aloud / Accessibility TTS
export const speakText = (text: string, lang: LanguageCode) => {
  if (!isSpeechSynthesisSupported()) {
    console.warn('Speech synthesis not supported in this browser environment');
    return;
  }

  window.speechSynthesis.cancel(); // cancel any active speaking
  const utterance = new SpeechSynthesisUtterance(text);

  const langMap: Record<LanguageCode, string> = {
    en: 'en-US',
    ar: 'ar-XA',
    hi: 'hi-IN',
    ur: 'ur-PK',
    bn: 'bn-BD',
  };

  utterance.lang = langMap[lang] || 'en-US';
  utterance.rate = 0.95; // comfortable, clear pace
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
};

// Code-Switching & Multilingual Token Analyzer
export const analyzeCodeSwitching = (text: string): CodeSwitchAnalysis => {
  const lower = text.toLowerCase();
  const detectedLoans: { word: string; category: string }[] = [];
  const languages = new Set<string>();

  // Arabic loan terms common in Gulf migrant settings
  const arabicTerms = [
    { word: 'kafeel', category: 'Arabic loan: كفيل (Sponsor)' },
    { word: 'iqama', category: 'Arabic loan: إقامة (Residency)' },
    { word: 'shurti', category: 'Arabic loan: شرطي (Police)' },
    { word: 'tasreeh', category: 'Arabic loan: تصريح (Permit)' },
    { word: 'khedmah', category: 'Arabic loan: نهاية الخدمة (End of Service)' },
    { word: 'mushkila', category: 'Arabic loan: مشكلة (Grievance/Problem)' },
    { word: 'maktab', category: 'Arabic loan: مكتب (Labour Office)' },
  ];

  // South Asian loan terms (Hindi/Urdu/Bengali)
  const southAsianTerms = [
    { word: 'mera', category: 'Hindi/Urdu: मेरा (My)' },
    { word: 'meri', category: 'Hindi/Urdu: मेरी (My)' },
    { word: 'pagar', category: 'Hindi/Urdu loan: पगार (Salary/Wage)' },
    { word: 'chutti', category: 'Hindi/Urdu loan: छुट्टी (Leave/Vacation)' },
    { word: 'nahi', category: 'Hindi/Urdu: नहीं (Denial/Negative)' },
    { word: 'amar', category: 'Bengali: আমার (My)' },
    { word: 'beton', category: 'Bengali: বেতন (Wage)' },
    { word: 'taka', category: 'Bengali: টাকা (Money)' },
  ];

  // English legal intent terms
  const englishIntentTerms = [
    'salary', 'passport', 'months', 'company', 'grievance', 'help', 'urgent', 'contract', 'court', 'visa'
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

  // Check script ranges
  if (/[\u0600-\u06FF]/.test(text)) {
    languages.add('Arabic / Urdu Script');
  }
  if (/[\u0900-\u097F]/.test(text)) {
    languages.add('Devanagari (Hindi) Script');
  }
  if (/[\u0980-\u09FF]/.test(text)) {
    languages.add('Bengali Script');
  }

  return {
    primarySyntax: languages.size > 1 ? 'Multilingual Code-Switching' : 'Monolingual Utterance',
    detectedLoans,
    languagesIdentified: Array.from(languages),
    confidence: Math.min(0.99, 0.88 + detectedLoans.length * 0.03),
  };
};
