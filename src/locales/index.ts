import { en } from './en';
import { ar } from './ar';
import { hi } from './hi';
import { ur } from './ur';
import { bn } from './bn';
import { LanguageCode } from '../types';

export const translations: Record<LanguageCode, typeof en> = {
  en,
  ar,
  hi,
  ur,
  bn,
};

export const languageMeta: Record<LanguageCode, { label: string; nativeLabel: string; dir: 'ltr' | 'rtl'; region: string }> = {
  en: { label: 'English', nativeLabel: 'English', dir: 'ltr', region: 'Global' },
  ar: { label: 'Arabic', nativeLabel: 'العربية', dir: 'rtl', region: 'Middle East' },
  hi: { label: 'Hindi', nativeLabel: 'हिन्दी', dir: 'ltr', region: 'South Asia' },
  ur: { label: 'Urdu', nativeLabel: 'اردو', dir: 'rtl', region: 'South Asia' },
  bn: { label: 'Bengali', nativeLabel: 'বাংলা', dir: 'ltr', region: 'South Asia' },
};

export const extendedLanguages = [
  { code: 'tl', name: 'Tagalog / Filipino', script: 'Filipino' },
  { code: 'ta', name: 'Tamil', script: 'தமிழ்' },
  { code: 'te', name: 'Telugu', script: 'తెలుగు' },
  { code: 'ml', name: 'Malayalam', script: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', script: 'ਪੰਜਾਬੀ' },
  { code: 'si', name: 'Sinhala', script: 'සිංහල' },
  { code: 'ne', name: 'Nepali', script: 'नेपाली' },
  { code: 'fr', name: 'Français', script: 'French' },
  { code: 'sw', name: 'Kiswahili', script: 'Swahili' },
  { code: 'am', name: 'Amharic', script: 'አማርኛ' },
  { code: 'ps', name: 'Pashto', script: 'پښتو' },
  { code: 'vi', name: 'Vietnamese', script: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian', script: 'Bahasa Indonesia' },
];
