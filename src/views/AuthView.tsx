/* eslint-disable */
"use client";
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { languageMeta } from '../locales';
import { LanguageCode } from '../types';
import { registerWorkerAccount, verifyOtpCode, signInWorker } from '../services/authService';

export const AuthView: React.FC<{ initialMode?: 'welcome' | 'register' | 'otp' | 'signin' }> = ({ initialMode = 'welcome' }) => {
  const { t, language, setLanguage, loginUser, resetToDemo, navigate } = useApp();

  const [mode, setMode] = useState<'welcome' | 'register' | 'otp' | 'signin'>(initialMode);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [nationality, setNationality] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(30);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // OTP Countdown
  React.useEffect(() => {
    let interval: any = null;
    if (mode === 'otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, otpTimer]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!phone) {
      setErrorMessage('Please enter your mobile phone number.');
      return;
    }
    setIsLoading(true);

    try {
      await registerWorkerAccount({
        name,
        phone,
        preferredLanguage: language,
        nationality,
        pin,
      });
      setMode('otp');
      setOtpTimer(30);
    } catch {
      setErrorMessage('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await verifyOtpCode(phone, otpCode);
      if (res.success) {
        loginUser({
          id: `usr_${Date.now()}`,
          name: name || 'Worker',
          phone,
          preferredLanguage: language,
          nationality,
          isGuest: false,
        });
        navigate('/journey');
      } else {
        setErrorMessage(res.error || 'Invalid code');
      }
    } catch {
      setErrorMessage('Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await signInWorker(phone, pin);
      if (res.success && res.user) {
        loginUser(res.user);
        navigate('/journey');
      } else {
        setErrorMessage(res.error || 'Sign in failed');
      }
    } catch {
      setErrorMessage('Could not sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-12">
      {/* Container Box */}
      <div className="bg-surface-container-low rounded-2xl p-6 sm:p-8 shadow-sm border border-surface-container-high/60 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center font-headline font-bold text-2xl mx-auto shadow-sm">
            Ø³Ù€
          </div>
          <h2 className="text-2xl font-headline font-bold text-on-surface">
            {t.auth.welcomeTitle}
          </h2>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
            {t.auth.welcomeSubtitle}
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-error/10 border border-error/30 text-xs text-error font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. WELCOME SCREEN */}
        {mode === 'welcome' && (
          <div className="space-y-4 pt-2">
            {/* Preferred Language selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider block">
                Preferred Interface Language:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['en', 'ar', 'hi', 'ur', 'bn'] as LanguageCode[]).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLanguage(code)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      language === code
                        ? 'bg-primary text-on-primary font-bold shadow-xs'
                        : 'bg-surface hover:bg-surface-container text-on-surface border border-surface-container-high'
                    }`}
                  >
                    <span>{languageMeta[code].nativeLabel}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 space-y-3">
              {/* Continue as Guest / Demo Mode */}
              <button
                type="button"
                onClick={resetToDemo}
                className="w-full py-3.5 px-4 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-on-primary-fixed-variant transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">explore</span>
                <span>{t.auth.continueGuest}</span>
              </button>

              {/* Create Account */}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="w-full py-3 px-4 rounded-xl bg-surface hover:bg-surface-container text-on-surface font-semibold text-xs border border-surface-container-high transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg text-primary">person_add</span>
                <span>{t.auth.createAccount}</span>
              </button>

              {/* Sign In */}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="w-full py-2.5 text-xs text-secondary hover:text-primary font-bold text-center cursor-pointer transition-colors"
              >
                {t.auth.signIn}
              </button>
            </div>
          </div>
        )}

        {/* 2. REGISTRATION SCREEN */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-secondary-container text-on-secondary-container text-[11px] leading-relaxed">
              <span className="font-bold block mb-0.5">Trust &amp; Privacy Notice:</span>
              {t.auth.whyInfoNeeded}
            </div>

            <div>
              <label className="font-bold text-on-surface block mb-1">
                Name or Preferred Pseudonym:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.auth.namePlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface text-on-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="font-bold text-on-surface block mb-1">
                Mobile Number (for OTP): <span className="text-error">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+971 50 123 4567"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface text-on-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-on-surface block mb-1">
                  Nationality (Optional):
                </label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder="e.g. India, Bangladesh"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface text-on-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">
                  Security PIN (4 Digits):
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="â€¢â€¢â€¢â€¢"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface text-on-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary font-mono text-center tracking-widest"
                />
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-on-primary-fixed-variant transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Generating OTP...' : 'Send SMS Verification Code'}
              </button>

              <button
                type="button"
                onClick={() => setMode('welcome')}
                className="w-full py-2 text-xs text-secondary hover:text-on-surface text-center cursor-pointer"
              >
                Back to Options
              </button>
            </div>
          </form>
        )}

        {/* 3. OTP VERIFICATION SCREEN */}
        {mode === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5 pt-2 text-xs text-center">
            <div className="space-y-1">
              <h3 className="font-headline font-bold text-lg text-on-surface">
                {t.auth.otpTitle}
              </h3>
              <p className="text-on-surface-variant">
                {t.auth.otpSubtitle} <strong className="font-mono text-on-surface">{phone}</strong>
              </p>
            </div>

            {/* 6-Digit input */}
            <div>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-48 mx-auto px-4 py-3 rounded-xl bg-surface text-on-surface font-mono text-xl tracking-widest text-center border-2 border-primary focus:outline-none shadow-sm"
                autoFocus
              />
              <span className="text-[10px] text-outline block mt-1">
                Demo code: Enter any 6 numbers (e.g. 123456)
              </span>
            </div>

            <div className="text-xs text-on-surface-variant">
              {otpTimer > 0 ? (
                <span>Resend code in {otpTimer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={() => setOtpTimer(30)}
                  className="font-bold text-primary hover:underline cursor-pointer"
                >
                  {t.auth.resendOtp}
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || otpCode.length !== 6}
              className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-on-primary-fixed-variant transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : t.auth.verifyOtp}
            </button>
          </form>
        )}

        {/* 4. SIGN IN SCREEN */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4 pt-2 text-xs">
            <div>
              <label className="font-bold text-on-surface block mb-1">
                Registered Mobile Number:
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+971 50 123 4567"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface text-on-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-on-surface block mb-1">
                Security PIN:
              </label>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="â€¢â€¢â€¢â€¢"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface text-on-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary font-mono text-center tracking-widest"
              />
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-on-primary-fixed-variant transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Signing In...' : 'Sign In to SANAD'}
              </button>

              <button
                type="button"
                onClick={() => setMode('welcome')}
                className="w-full py-2 text-xs text-secondary hover:text-on-surface text-center cursor-pointer"
              >
                Back to Options
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};


