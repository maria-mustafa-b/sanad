"use client";
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export const AuthPage: React.FC<{ mode?: 'signin' | 'signup' }> = ({ mode: initial = 'signin' }) => {
  const { navigate, loginUser } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>(initial);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      loginUser({
        id: 'user_local',
        name: name || email.split('@')[0] || 'Worker',
        phone: '+971500000000',
        preferredLanguage: 'en',
        isGuest: false,
      });
      setLoading(false);
      navigate(mode === 'signup' ? '/onboarding' : '/dashboard');
    }, 600);
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
                onClick={() => setMode(m)}
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
              ? 'Sign in to continue your support journey.'
              : 'Set up a protected worker account on this device.'}
          </p>

          <form onSubmit={submit} className="space-y-4">
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
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
              leftIcon="lock"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              required
            />
            <Button type="submit" fullWidth loading={loading} size="lg">
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-ink-muted">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                loginUser({
                  id: 'google_user',
                  name: 'Demo Worker',
                  phone: '',
                  preferredLanguage: 'en',
                  isGuest: false,
                });
                navigate('/dashboard');
              }}
            >
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                loginUser({
                  id: 'ms_user',
                  name: 'Demo Worker',
                  phone: '',
                  preferredLanguage: 'en',
                  isGuest: false,
                });
                navigate('/dashboard');
              }}
            >
              Microsoft
            </Button>
          </div>

          <button
            type="button"
            onClick={() => {
              loginUser({
                id: 'guest',
                name: 'Guest Worker',
                phone: '',
                preferredLanguage: 'en',
                isGuest: true,
              });
              navigate('/dashboard');
            }}
            className="mt-5 w-full text-center text-sm font-medium text-brand hover:underline cursor-pointer min-h-touch"
          >
            Continue as guest (demo)
          </button>
        </Card>
      </div>
    </div>
  );
};
