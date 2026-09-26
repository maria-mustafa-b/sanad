/* eslint-disable */
"use client";
import React from 'react';
import { useApp } from '../context/AppContext';

export const NotificationsView: React.FC = () => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    navigate 
  } = useApp();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-[16px] text-tertiary">notifications</span>
            <span>Case Milestones &amp; Safety Notices</span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl text-on-surface font-bold tracking-tight">
            Updates &amp; Notifications
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Real-time notifications regarding your verified credentials, assigned advocates, and statutory advisories.
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors cursor-pointer self-start sm:self-auto"
        >
          Mark all as read
        </button>
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-12 text-center bg-surface-container-low rounded-2xl border border-surface-container-high/60 space-y-2">
            <span className="material-symbols-outlined text-4xl text-outline">notifications_off</span>
            <h3 className="font-headline font-bold text-base text-on-surface">No Notifications Right Now</h3>
            <p className="text-xs text-on-surface-variant">We'll alert you whenever an advocate updates your case file.</p>
          </div>
        ) : (
          notifications.map((item) => {
            const iconMap = {
              case_update: 'gavel',
              security: 'verified_user',
              rights: 'info',
              system: 'bolt'
            };

            return (
              <div
                key={item.id}
                onClick={() => {
                  markNotificationRead(item.id);
                  if (item.relatedRoute) navigate(item.relatedRoute);
                }}
                className={`p-5 rounded-2xl shadow-xs transition-all cursor-pointer flex items-start gap-4 border ${
                  !item.read
                    ? 'bg-surface-container-low border-primary-fixed hover:bg-surface-container'
                    : 'bg-surface hover:bg-surface-container border-surface-container-high/60 opacity-80'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  !item.read ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'
                }`}>
                  <span className="material-symbols-outlined text-xl">
                    {iconMap[item.category] || 'notifications'}
                  </span>
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-bold ${!item.read ? 'text-primary font-headline' : 'text-on-surface'}`}>
                      {item.title}
                    </h3>
                    <span className="text-[11px] text-outline font-mono">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {item.message}
                  </p>
                </div>

                {!item.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-2"></span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};


