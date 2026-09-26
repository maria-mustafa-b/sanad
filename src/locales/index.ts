 
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
  ar: { label: 'Arabic', nativeLabel: 'Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©', dir: 'rtl', region: 'Middle East' },
  hi: { label: 'Hindi', nativeLabel: 'à¤¹à¤¿à¤¨à¥à¤¦à¥€', dir: 'ltr', region: 'South Asia' },
  ur: { label: 'Urdu', nativeLabel: 'Ø§Ø±Ø¯Ùˆ', dir: 'rtl', region: 'South Asia' },
  bn: { label: 'Bengali', nativeLabel: 'à¦¬à¦¾à¦‚à¦²à¦¾', dir: 'ltr', region: 'South Asia' },
};

export const extendedLanguages = [
  { code: 'tl', name: 'Tagalog / Filipino', script: 'Filipino' },
  { code: 'ta', name: 'Tamil', script: 'à®¤à®®à®¿à®´à¯' },
  { code: 'te', name: 'Telugu', script: 'à°¤à±†à°²à±à°—à±' },
  { code: 'ml', name: 'Malayalam', script: 'à´®à´²à´¯à´¾à´³à´‚' },
  { code: 'pa', name: 'Punjabi', script: 'à¨ªà©°à¨œà¨¾à¨¬à©€' },
  { code: 'si', name: 'Sinhala', script: 'à·ƒà·’à¶‚à·„à¶½' },
  { code: 'ne', name: 'Nepali', script: 'à¤¨à¥‡à¤ªà¤¾à¤²à¥€' },
  { code: 'fr', name: 'FranÃ§ais', script: 'French' },
  { code: 'sw', name: 'Kiswahili', script: 'Swahili' },
  { code: 'am', name: 'Amharic', script: 'áŠ áˆ›áˆ­áŠ›' },
  { code: 'ps', name: 'Pashto', script: 'Ù¾ÚšØªÙˆ' },
  { code: 'vi', name: 'Vietnamese', script: 'Tiáº¿ng Viá»‡t' },
  { code: 'id', name: 'Indonesian', script: 'Bahasa Indonesia' },
];

