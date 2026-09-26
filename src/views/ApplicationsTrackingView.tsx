 
"use client";
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StepTracker } from '../components/StepTracker';

export const ApplicationsTrackingView: React.FC = () => {
  const { t, applications, setActiveStep, navigate } = useApp();
  const [selectedCaseId, setSelectedCaseId] = useState<string>(applications[0]?.id || 'APP-2026-9912');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'Fatima Al-Hashemi (Legal Advocate)', text: 'Hello Rashid, I have reviewed your WPS statement and verified the 42-day delay against the MOHRE portal. I am preparing the demand letter to Al-Noor Contracting today.', time: 'Today, 10:15 AM' }
  ]);

  React.useEffect(() => {
    setActiveStep(6);
  }, [setActiveStep]);

  const activeCase = applications.find(a => a.id === selectedCaseId) || applications[0];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [
      ...prev,
      { sender: 'You (Worker)', text: newMessage.trim(), time: 'Just now' }
    ]);
    setNewMessage('');
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: 'Fatima Al-Hashemi (Legal Advocate)', text: 'Thank you for this note. I will incorporate this additional context into the mediation file before the tribunal hearing.', time: 'Just now' }
      ]);
    }, 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 6-Step Stepper Header */}
      <StepTracker currentStepIndex={6} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-[15px]">timeline</span>
            <span>Step 06 â€¢ Smart Tracking Stream</span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl text-on-surface font-bold tracking-tight">
            {t.tracking.title}
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            {t.tracking.subtitle}
          </p>
        </div>

        <button
          onClick={() => navigate('/verify')}
          className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-primary text-base">verified_user</span>
          <span>Public Verification Portal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Applications List & Selected Case Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Case Card */}
          {activeCase && (
            <div className="bg-surface-container-low rounded-2xl p-6 sm:p-8 shadow-sm border border-surface-container-high/60 space-y-6">
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-surface-container-high/60 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-primary bg-primary-fixed/50 px-2 py-0.5 rounded">
                      {activeCase.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold text-xs capitalize">
                      {activeCase.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h2 className="text-xl font-headline font-bold text-on-surface mt-1">
                    {activeCase.title}
                  </h2>
                </div>

                <div className="text-right text-xs text-on-surface-variant font-mono">
                  <span>Linked Proof: </span>
                  <button 
                    onClick={() => navigate('/my-proof')}
                    className="font-bold text-primary hover:underline cursor-pointer"
                  >
                    {activeCase.credentialId}
                  </button>
                </div>
              </div>

              {/* Timeline Progress Tracker */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-secondary">
                  {t.tracking.timelineTitle}
                </h3>

                <div className="space-y-6 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container-highest">
                  {activeCase.timeline.map((step, idx) => (
                    <div key={idx} className="relative space-y-1">
                      <span
                        className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-surface flex items-center justify-center text-[9px] font-bold ${
                          step.completed
                            ? 'bg-primary text-on-primary'
                            : step.current
                            ? 'bg-tertiary text-on-tertiary animate-pulse'
                            : 'bg-surface-variant text-on-surface-variant'
                        }`}
                      >
                        {step.completed ? 'âœ“' : idx + 1}
                      </span>
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-bold ${step.current ? 'text-primary' : 'text-on-surface'}`}>
                          {step.title}
                        </span>
                        <span className="text-[11px] text-outline font-mono">{step.date}</span>
                      </div>
                      {step.description && (
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          {step.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Caseworker Notes */}
              <div className="p-4 rounded-xl bg-surface-container space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-primary uppercase tracking-wider">
                  <span className="material-symbols-outlined text-base">sticky_note_2</span>
                  <span>{t.tracking.caseworkerNotes}</span>
                </div>
                <p className="text-on-surface leading-relaxed">
                  {activeCase.notes}
                </p>
                <span className="text-[10px] text-outline block pt-1">
                  Last updated: {new Date(activeCase.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          {/* Secure Messaging Stream with Assigned Caseworker */}
          <div className="bg-surface-container-low rounded-2xl p-6 sm:p-8 shadow-sm border border-surface-container-high/60 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">
                  FA
                </div>
                <div>
                  <h4 className="font-bold text-xs text-on-surface">Fatima Al-Hashemi</h4>
                  <span className="text-[10px] text-primary font-medium">Assigned Pro Bono Legal Counselor</span>
                </div>
              </div>
              <span className="text-[10px] text-outline bg-surface-container px-2 py-0.5 rounded-full">
                End-to-End Encrypted Channel
              </span>
            </div>

            <div className="space-y-3 max-h-56 overflow-y-auto p-2">
              {messages.map((m, idx) => (
                <div 
                  key={idx}
                  className={`p-3.5 rounded-xl text-xs space-y-1 ${
                    m.sender.startsWith('You') 
                      ? 'bg-primary-container text-on-primary-container ml-8' 
                      : 'bg-surface text-on-surface mr-8 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] opacity-75 font-semibold">
                    <span>{m.sender}</span>
                    <span>{m.time}</span>
                  </div>
                  <p className="leading-relaxed">{m.text}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t.tracking.messageAdvocate}
                className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-surface text-on-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1"
              >
                <span>Send</span>
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Case Selector & Organization Details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-surface-container space-y-4 shadow-sm">
            <span className="text-xs uppercase tracking-wider font-bold text-secondary block">
              All My Submitted Cases ({applications.length})
            </span>

            <div className="space-y-2">
              {applications.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelectedCaseId(app.id)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all cursor-pointer flex flex-col gap-1 ${
                    selectedCaseId === app.id
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold">{app.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      selectedCaseId === app.id ? 'bg-on-primary/20 text-on-primary' : 'bg-secondary-container text-on-secondary-container'
                    }`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                  <strong className="text-xs truncate">{app.title}</strong>
                  <span className={`text-[10px] ${selectedCaseId === app.id ? 'opacity-85' : 'text-outline'}`}>
                    {app.orgName}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Org Support Info */}
          <div className="p-6 rounded-2xl bg-surface-container-low border border-surface-container-high/60 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-primary uppercase tracking-wider">
              <span className="material-symbols-outlined text-base">verified</span>
              <span>Handling Organization</span>
            </div>
            <h4 className="font-headline font-bold text-base text-on-surface">
              Migrant Justice Legal Clinic
            </h4>
            <p className="text-on-surface-variant leading-relaxed">
              Certified pro bono labor advocacy wing. Provides representation before the Ministry tribunals and coordinates with consular desks.
            </p>
            <div className="pt-2 flex items-center justify-between font-mono text-[11px] text-secondary">
              <span>Hotline: +971 800 53425</span>
              <span>Fee: Free (Pro Bono)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


