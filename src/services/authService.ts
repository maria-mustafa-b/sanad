import { LanguageCode, UserProfile } from '../types';

export interface RegisterPayload {
  name: string;
  phone: string;
  preferredLanguage: LanguageCode;
  nationality?: string;
  pin: string;
}

export const createGuestSession = (lang: LanguageCode = 'en'): UserProfile => {
  return {
    id: 'guest',
    name: 'Anonymous Worker',
    phone: '',
    preferredLanguage: lang,
    isGuest: true,
  };
};

export const registerWorkerAccount = async (
  payload: RegisterPayload
): Promise<{ user: UserProfile; otpRequired: boolean }> => {
  try {
    // 1. Force a demo session creation to get a real backend ID
    await fetch('/api/auth/demo', { method: 'POST' });
    
    // 2. Fetch the newly assigned backend ID
    const meRes = await fetch('/api/auth/me');
    const meJson = await meRes.json();
    const backendId = meJson.data?.id || `usr_${Date.now()}`;

    // 3. Update the profile on the backend
    await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        display_name: payload.name.trim() || 'Anonymous Worker',
        preferred_language: payload.preferredLanguage || 'en',
        accessibility: { larger_text: false, reduced_motion: false, screen_reader: false }
      })
    }).catch(console.error);

    return {
      user: {
        id: backendId,
        name: payload.name.trim() || 'Anonymous Worker',
        phone: payload.phone.trim(),
        preferredLanguage: payload.preferredLanguage,
        nationality: payload.nationality?.trim() || 'Not Disclosed',
        isGuest: false,
      },
      otpRequired: true,
    };
  } catch (e) {
    console.error(e);
    // Fallback if backend is down
    return {
      user: {
        id: `usr_${Date.now()}`,
        name: payload.name.trim() || 'Anonymous Worker',
        phone: payload.phone.trim(),
        preferredLanguage: payload.preferredLanguage,
        isGuest: false,
      },
      otpRequired: true,
    };
  }
};

export const verifyOtpCode = async (
  _phone: string,
  code: string
): Promise<{ success: boolean; error?: string }> => {
  await new Promise(resolve => setTimeout(resolve, 700));
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
  if (!phone || phone.length < 7) {
    return { success: false, error: 'Please enter a valid mobile phone number.' };
  }
  
  try {
    await fetch('/api/auth/demo', { method: 'POST' });
    const meRes = await fetch('/api/auth/me');
    const meJson = await meRes.json();
    
    return {
      success: true,
      user: {
        id: meJson.data?.id || `usr_${Date.now()}`,
        name: 'Returning Worker',
        phone,
        preferredLanguage: 'en',
        isGuest: false,
      },
    };
  } catch (e) {
    return {
      success: true,
      user: { id: `usr_${Date.now()}`, name: 'Returning Worker', phone, preferredLanguage: 'en', isGuest: false },
    };
  }
};
