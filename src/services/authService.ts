"use client";
import { LanguageCode, UserProfile } from '../types';
import { mockUser } from '../data/mockData';

export interface RegisterPayload {
  name: string;
  phone: string;
  preferredLanguage: LanguageCode;
  nationality?: string;
  pin: string;
}

export const createGuestSession = (lang: LanguageCode = 'en'): UserProfile => {
  return {
    ...mockUser,
    preferredLanguage: lang,
    isGuest: true,
  };
};

export const registerWorkerAccount = async (
  payload: RegisterPayload
): Promise<{ user: UserProfile; otpRequired: boolean }> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  const newUser: UserProfile = {
    id: `usr_${Date.now()}`,
    name: payload.name.trim() || 'Anonymous Worker',
    phone: payload.phone.trim(),
    preferredLanguage: payload.preferredLanguage,
    nationality: payload.nationality?.trim() || 'Not Disclosed',
    isGuest: false,
  };

  return {
    user: newUser,
    otpRequired: true,
  };
};

export const verifyOtpCode = async (
  _phone: string,
  code: string
): Promise<{ success: boolean; error?: string }> => {
  await new Promise(resolve => setTimeout(resolve, 700));

  // In demo prototype mode, any 6-digit code or "123456" succeeds
  if (code.length === 6 && /^\d+$/.test(code)) {
    return { success: true };
  }

  return {
    success: false,
    error: 'Invalid or expired verification code. Please enter 6 numeric digits.',
  };
};

export const signInWorker = async (
  phone: string,
  _pin: string
): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  if (!phone || phone.length < 7) {
    return { success: false, error: 'Please enter a valid mobile phone number.' };
  }

  return {
    success: true,
    user: {
      ...mockUser,
      phone,
      isGuest: false,
    },
  };
};
