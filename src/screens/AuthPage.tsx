import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import {
  ApiError,
  getAuthMe,
  loginWithPassword,
  registerWithPassword,
} from '../services/sanadApi';
import { LanguageCode } from '../types';

export const AuthPage: React.FC<{ mode?: 'signin' | 'signup' }> = ({ mode: initial = 'signin' }) => {
  const { navigate, loginUser } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>(initial);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const applySessionUser = async (fallbackName: string) => {
    try {
      const me = await getAuthMe();
      loginUser({
        id: me.id,
        name: fallbackName || me.email?.split('@')[0] || 'Worker',
        phone: '',
        preferredLanguage: 'en' as LanguageCode,
        isGuest: Boolean(me.demo),
      });
    } catch {
      loginUser({
        id: 'user_local',
        name: fallbackName || email.split('@')[0] || 'Worker',
        phone: '',
        preferredLanguage: 'en',
        isGuest: false,
      });
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (password.length < 10) {
      setError('Password must be at least 10 characters (backend requirement).');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signup') {
        const result = await registerWithPassword(email.trim(), password);
        if (result && typeof result === 'object' && 'confirmationRequired' in result && result.confirmationRequired) {
          setInfo('Account created. Check your email to confirm, then sign in.');
          setMode('signin');
          setLoading(false);
          return;
        }
        await applySessionUser(name || email.split('@')[0] || 'Worker');
        navigate('/onboarding');
      } else {
        await loginWithPassword(email.trim(), password);
        await applySessionUser(name || email.split('@')[0] || 'Worker');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not sign in. Check your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  const continueGuest = () => {
    loginUser({
      id: 'guest',
      name: 'Guest Worker',
      phone: '',
      preferredLanguage: 'en',
      isGuest: true,
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-5 sm:px-8 py-6">
        <Logo size="md" onClick={() => navigate('/')} />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <Card className="w-full max-w-md" padding="lg" tone="elevated">
          <div className="flex p-1 bg-surface-container rounded-lg mb-7">
            {(['signin', 'signup'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setError('');
                  setInfo('');
                }}
                className={`flex-1 py-2.5 rounded-md text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
                  mode === m ? 'bg-white text-brand-dark shadow-card' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {m === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <h1 className="text-display-sm text-2xl text-ink mb-1.5">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-[14px] text-ink-secondary mb-7 leading-relaxed">
            {mode === 'signin'
              ? 'Sign in to sync claims, documents, and Digital Proofs.'
              : 'Create an account to save your case on the SANAD server.'}
          </p>

          <form onSubmit={(e) => void submit(e)} className="space-y-4">
            {mode === 'signup' && (
              <Input
                label="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name or preferred name"
                autoComplete="name"
              />
            )}
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              leftIcon="mail"
              autoComplete="email"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 10 characters"
              leftIcon="lock"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              required
              hint="Minimum 10 characters"
            />
            {error && <p className="text-sm text-danger-fg">{error}</p>}
            {info && <p className="text-sm text-success-fg">{info}</p>}
            <Button type="submit" fullWidth loading={loading} size="lg">
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <button
            type="button"
            onClick={continueGuest}
            className="mt-5 w-full text-center text-sm font-medium text-brand hover:underline cursor-pointer min-h-touch"
          >
            Continue as guest (device-only demo)
          </button>
        </Card>
      </div>
    </div>
  );
};
